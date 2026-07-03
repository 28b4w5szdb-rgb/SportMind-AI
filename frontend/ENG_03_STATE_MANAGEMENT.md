# 03 · State Management

> Every kind of state has a designated home. No global god-store. No prop-drilling nightmares.

---

## 3.1 The Four Kinds of State

| Kind | Home | Example |
|---|---|---|
| **UI state** (ephemeral, local) | `useState` / `useReducer` | Modal open, form field, tab index |
| **Shared client state** (cross-screen, no server) | Zustand slice | Theme, direction, current athlete filter |
| **Server state** (data from API) | React Query (TanStack Query) | Athletes list, test results |
| **Persistent state** (survives app kill) | SecureStore / MMKV / SQLite | Auth session, offline queue, cached lists |

### The First Rule of State
> Pick the lowest layer that solves the problem. Escalate only when necessary.

---

## 3.2 Local State (`useState` / `useReducer`)

### When to use
- The state is only used within a single component subtree.
- Losing it on unmount is acceptable.
- Example: form input drafts, modal visibility, expanded/collapsed toggles.

### Rules
- Prefer `useState` for ≤3 related values.
- Prefer `useReducer` for state machines or when transitions are non-trivial.
- Don't lift state prematurely — lift only when a sibling needs it.

---

## 3.3 Global State (Zustand)

### When to use
- The state is genuinely cross-screen (theme, current user profile).
- The state is a UI concern (not server data).
- The state doesn't need TanStack Query's caching machinery.

### Rules
- One store per feature slice, plus a small number of app-wide slices.
- **No server data in Zustand.** That's React Query's job.
- Store shape is typed with a discriminated union where applicable.
- Selectors are used to avoid over-rendering (`useStore(s => s.athletes.filter)`).
- Actions are pure functions on the slice; async orchestration happens in services.

### Canonical slices
- `authStore` — session, current user, roles.
- `themeStore` — light/dark preference, density mode.
- `directionStore` — language + RTL preference.
- `syncStore` — offline queue length, syncing status.
- `uiStore` — global toasts, modals.

---

## 3.4 Server State (React Query / TanStack Query)

### Why
Server state has its own lifecycle: fetching, staleness, refetching, background updates, retries, pagination. Zustand is the wrong tool. React Query is the right one.

### Conventions
- **Query keys** are namespaced arrays: `['athletes', 'list', { teamId, filter }]`.
- **Stale time** default: **60 s**. Override per query with a written justification.
- **Cache time** default: **5 min**.
- **Retry** default: 3 with exponential backoff (see Chapter 04).
- **`enabled`** flag used to gate queries on prerequisites (auth ready, permission granted).
- **Mutations** return typed results and invalidate related queries explicitly.

### Query Hooks Live in Features

```ts
// features/athletes/hooks/useAthletes.ts
export const useAthletes = (query: AthleteQuery) =>
  useQuery({
    queryKey: ['athletes', 'list', query],
    queryFn: () => athleteService.list(query),
    staleTime: 60_000,
  });
```

---

## 3.5 Persistent State

| Data | Storage |
|---|---|
| Auth tokens | **expo-secure-store** (encrypted) |
| User preferences (theme, language, density) | **MMKV** (fast, sync) |
| Cached lists (athletes, tests) for offline | **SQLite** (structured, queryable) |
| Draft form data | **MMKV** with TTL |
| Attachments (images, PDFs pre-upload) | **File system** with path in SQLite |

### Rules
- **Never** store credentials in AsyncStorage, MMKV, or SQLite.
- **Never** store PII in plaintext. Athlete records with medical data live in encrypted SQLite.
- **Always** version-tag persisted schemas. Migrate on read if version mismatches.

---

## 3.6 Cache Strategy

### Three-Tier Cache

```
RAM (React Query cache)   ← ms latency, cleared on kill
  ↓
MMKV / SQLite            ← sub-ms sync reads, survives kill
  ↓
Remote (API / Firestore) ← network required
```

### Read Strategy (per repository)
1. Return cached data if fresh (`staleTime` window).
2. Kick off background revalidation.
3. Update UI when new data arrives (React Query auto-refreshes bindings).

### Write Strategy
- **Online:** write remote → on success update local cache.
- **Offline:** write local + enqueue mutation → sync engine drains queue when connectivity returns.

---

## 3.7 Offline Synchronization

### The Sync Engine
A single `SyncEngine` service manages the write-behind queue:

```ts
interface QueuedMutation {
  id: string;
  feature: 'athlete' | 'test' | 'note' | …;
  op: 'create' | 'update' | 'delete';
  payload: unknown;
  clientRev: number;
  createdAt: number;
  attempts: number;
  lastError?: string;
}
```

### Lifecycle
1. Mutation is issued → optimistic local write + enqueue.
2. UI reflects the local state immediately (see Optimistic Updates §3.8).
3. On connectivity + auth valid → SyncEngine processes queue in order.
4. Each mutation attempts with exponential backoff (max 8 attempts).
5. Server responds with authoritative record → local reconciles (see Conflict Resolution §3.9).
6. Queue item is removed on success or moved to `dead-letter` after max retries.

### Sync Status (surfaced via `syncStore`)
- `offline` — network unavailable.
- `queued` — network available, N mutations pending.
- `syncing` — processing queue.
- `synced` — empty queue, all reconciled.
- `error` — one or more items in dead-letter.

The Sync Pulse Bar (UIUX Doc 03 §3.47) visualizes this state.

### Rule
**Every mutation must be idempotent** on the server. Clients may retry.

---

## 3.8 Optimistic Updates

### The Pattern
1. On user action, immediately update local state / cache.
2. Fire the mutation.
3. On success, replace optimistic with server response.
4. On failure, roll back + surface error toast.

### React Query implementation
```ts
useMutation({
  mutationFn: athleteService.update,
  onMutate: async (patch) => {
    await queryClient.cancelQueries({ queryKey: ['athletes', patch.id] });
    const prev = queryClient.getQueryData(['athletes', patch.id]);
    queryClient.setQueryData(['athletes', patch.id], next);
    return { prev };
  },
  onError: (_e, _v, ctx) => queryClient.setQueryData(['athletes', patch.id], ctx.prev),
  onSettled: (_d, _e, v) => queryClient.invalidateQueries(['athletes', v.id]),
});
```

### When NOT to use optimistic updates
- Irreversible operations (delete an audit log entry).
- Financial or subscription changes.
- Operations that require server-generated IDs before subsequent actions.

---

## 3.9 Conflict Resolution

### Strategies (chosen per resource)

| Resource | Strategy | Rationale |
|---|---|---|
| Athlete profile | Last-writer-wins with field-level merge | Rare concurrent edits |
| Test results | Immutable / append-only | Scientific integrity |
| Notes | Vector-clock CRDT-lite (per-note) | Multiple coaches may edit |
| Team roster | Server-authoritative | Admin controls truth |
| Consent records | Server-authoritative + audit | Legal implications |

### The `_rev` Field
- Every syncable record carries a server revision integer.
- Client sends the `_rev` it saw with each update.
- Server rejects if `_rev` is stale → client refetches, merges, retries.

---

## 3.10 State Persistence Rules

- **Never** persist secrets outside SecureStore.
- **Never** persist server auth cookies (use SecureStore-encrypted tokens).
- **Always** clear persistent state on sign-out.
- **Always** version persisted schemas and migrate on read.
- **Never** persist large blobs in MMKV (>1 MB); use the file system.

---

## 3.11 Anti-Patterns

- ❌ Global Zustand slice for server data.
- ❌ useEffect fetching data (use React Query hooks).
- ❌ Prop-drilling context beyond 3 levels (introduce a context or store slice).
- ❌ Sharing state across features via imports (use shared services).
- ❌ Storing derived state (compute in a selector or memoized hook).
- ❌ Storing UI-only concerns in persistent storage.

---

_Continue to Chapter 04 — API Standards._

# 02 · Architecture Rules

> How code is organized at the macro level. Feature-first, layered, dependency-injected, and testable end-to-end.

---

## 2.1 Feature-First Architecture

### The Principle
The app is a **composition of feature modules**, not a tree of technical layers. Feature modules are self-contained slices of the product surface. They own their UI, hooks, services, repositories, types, and tests.

### Feature Module Structure (canonical)

```
features/athletes/
├─ api/               ← HTTP endpoint definitions (thin)
├─ components/        ← Feature-only UI (AthleteCard, AthleteForm)
├─ hooks/             ← Feature-only hooks (useAthletes, useAthleteReadiness)
├─ repositories/      ← Data access (offline + remote merge)
├─ screens/           ← Screen composers (List, Detail, Add)
├─ services/          ← Business logic (athlete.service.ts)
├─ store/             ← Zustand slice (athlete.store.ts)
├─ types/             ← athlete.types.ts
└─ __tests__/         ← Feature-level tests
```

### Feature Isolation Rules
1. **A feature never imports from another feature.** Cross-feature interactions go through:
   - Shared services (`src/services/`)
   - Shared components (`src/components/`)
   - The global store or event bus
2. **A feature never imports Expo Router routes** — those import features, not the other way around.
3. **A feature exposes a public API** via its `index.ts`:
   ```ts
   // features/athletes/index.ts
   export { AthletesListScreen, AthleteDetailScreen } from './screens';
   export { useAthletes } from './hooks';
   export type { Athlete } from './types';
   ```
4. **Everything else is private** to the feature.

---

## 2.2 Dependency Injection

### The Pattern
Services are defined by **interfaces**, not concrete classes. Concrete implementations are wired at the app root through a lightweight DI container (context-based or Zustand-based).

### Example Contract

```ts
// src/services/auth/auth.types.ts
export interface AuthProvider {
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
  currentSession(): Session | null;
  onSessionChange(cb: (s: Session | null) => void): () => void;
}
```

```ts
// src/services/auth/emergentGoogle.provider.ts
export class EmergentGoogleAuthProvider implements AuthProvider { … }
```

```ts
// src/providers/AuthProvider.tsx
const AuthContext = createContext<AuthProvider | null>(null);
export const AuthProviderRoot = ({ provider, children }) => (
  <AuthContext.Provider value={provider}>{children}</AuthContext.Provider>
);
```

### Benefits
- Swappable in tests (fake provider).
- Swappable per environment (mock in Storybook, real in prod).
- No file directly imports Firebase / Emergent SDK — only the adapter does.

### Rule
**A UI component or hook must never `import` a third-party SDK directly.** SDKs are wrapped in adapters that implement domain interfaces.

---

## 2.3 Repository Pattern

Repositories abstract data access. They know about local caches, remote APIs, and merge strategies.

### Repository Interface

```ts
export interface AthleteRepository {
  list(query?: AthleteQuery): Promise<Athlete[]>;
  get(id: string): Promise<Athlete | null>;
  create(input: NewAthlete): Promise<Athlete>;
  update(id: string, patch: Partial<Athlete>): Promise<Athlete>;
  delete(id: string): Promise<void>;
  observe(id: string): Observable<Athlete>; // for reactive UI
}
```

### Implementation Layers
1. **Remote adapter** — speaks HTTP or Firestore.
2. **Local adapter** — speaks SQLite/MMKV.
3. **Repository** — orchestrates offline-first reads, write-behind sync, conflict resolution.

### Rule
**Only the repository layer touches storage or network.** Services and hooks call repositories, never fetch directly.

---

## 2.4 Service Layer

Services contain **business logic**. They:
- Compose repositories.
- Enforce invariants (e.g., "cannot save a test without a consenting athlete").
- Call domain-specific engines (SIE, SKB, LLM).
- Never touch React.
- Are testable in isolation with fake repos.

### Example

```ts
export class AthleteService {
  constructor(
    private readonly repo: AthleteRepository,
    private readonly sie: SIEEngine,
    private readonly audit: AuditLog,
  ) {}

  async computeReadiness(athleteId: string): Promise<ReadinessResult> {
    const athlete = await this.repo.get(athleteId);
    if (!athlete) throw new NotFoundError('athlete', athleteId);
    const result = this.sie.readiness(athlete);
    await this.audit.record('readiness.computed', { athleteId, result });
    return result;
  }
}
```

---

## 2.5 Separation of Concerns

### The Layer Cake (top → bottom)

```
Route files (Expo Router)      ← 5-line composers
   ↓
Screens (features/*/screens)   ← Compose components, subscribe to hooks
   ↓
Components                     ← Presentation only (props in, JSX out)
   ↓
Hooks                          ← UI-facing state & effects
   ↓
Services                       ← Business logic
   ↓
Repositories                   ← Data access orchestration
   ↓
Adapters                       ← SDK / API / storage boundaries
```

### Golden Rules
- **Data flows down, events flow up.**
- **Higher layers may depend on lower layers. Never the reverse.**
- **UI is a projection of state, not the source of state.**
- **Hooks may not call adapters.** Hooks call services.
- **Services may not call React.** Services are UI-agnostic.

---

## 2.6 Error Boundaries

### Three-Level Strategy

1. **Component-level Error Boundary** — catches render errors within a single card/widget. Shows an inline error state; the rest of the screen keeps working. Every dashboard widget has one.
2. **Screen-level Error Boundary** — catches errors that escape widget boundaries. Shows the standard Error State (UIUX Doc 03 §3.39) with Retry.
3. **App-level Error Boundary** — last-resort catcher. Shows a full-screen crash card with restart CTA and sends a Sentry report.

### Async Error Handling
- Every async function has a `try/catch` OR returns a `Result<T, E>` type.
- Never let promises reject silently.
- Distinguish **domain errors** (`ValidationError`, `NotFoundError`, `PermissionError`) from **infrastructure errors** (`NetworkError`, `StorageError`).

### The `Result` Pattern (optional but preferred for services)

```ts
type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

---

## 2.7 Cross-Cutting Concerns

Handled once, applied everywhere via middleware/providers/decorators:

| Concern | Mechanism |
|---|---|
| Auth session propagation | `AuthProvider` context |
| RTL/LTR direction | `DirectionProvider` context |
| Theme (light/dark) | `ThemeProvider` context |
| Localization | `I18nProvider` context |
| Feature flags | `FeatureFlagsProvider` |
| Analytics | `AnalyticsProvider` + `useTrackEvent` hook |
| RBAC | `<Guard permission="athletes.write" />` component |
| Network availability | `NetInfoProvider` |
| Error boundaries | React error boundaries at 3 levels |
| Logging | `logger` singleton (see Chapter 09) |

---

## 2.8 Extension & Plugin Points

SportMind AI is architected for future plugin extensibility (per PRD refinement doc):

- **SIE Formulas** register via `sie.register(formulaDef)` — no code change needed to add a new formula.
- **Chart types** register via `charts.register(chartDef)`.
- **Report sections** register via `reports.registerSection(sectionDef)`.
- **Integrations** (wearables, LMS, EHR) implement an `Integration` interface and plug into `integrationsRegistry`.

### Rule
When adding a new **kind of thing** (formula, chart, integration), consider registering it rather than hard-coding.

---

## 2.9 Backend Architecture Mirror

The FastAPI backend mirrors the same layering:

```
routes/                 ← Thin HTTP handlers (validate + call service)
↓
services/               ← Business logic
↓
repositories/           ← MongoDB / storage access
↓
models/                 ← Pydantic + DB models
```

Dependency injection via FastAPI's `Depends()`. Interfaces defined in `core/interfaces.py`.

---

## 2.10 Architecture Decision Records (ADRs)

Every non-trivial architectural choice is documented in `/app/adr/`:

```
/app/adr/
├─ 0001-use-expo-router.md
├─ 0002-zustand-over-redux.md
├─ 0003-repository-pattern-for-offline-first.md
└─ …
```

ADR template:

```md
# ADR-000X: Title
Date: YYYY-MM-DD
Status: Proposed | Accepted | Superseded by ADR-XYZ

## Context

## Decision

## Consequences (positive, negative, neutral)

## Alternatives Considered
```

### Rule
**No architectural change ships without an ADR.**

---

_Continue to Chapter 03 — State Management._

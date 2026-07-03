# 04 · API Standards

> The contract between mobile and backend. Predictable, versioned, defensively coded.

---

## 4.1 Base URL & Routing

- Frontend hits **`${EXPO_BACKEND_URL}/api/...`**.
- Kubernetes ingress routes `/api/*` → backend port `8001`.
- Backend binds to `0.0.0.0:8001`. Never modified.
- All backend routes are namespaced under `/api/v{N}/...`.

---

## 4.2 Versioning

### URL-based Versioning
- `/api/v1/athletes`
- `/api/v2/athletes` when breaking changes are introduced.

### Rules
1. **Additive changes** (new optional fields, new endpoints) do NOT bump the version.
2. **Breaking changes** (removed field, changed type, renamed field, removed endpoint) require a new version.
3. **Two versions coexist** for at least 90 days after a bump.
4. The client sends `X-Client-Version` header on every request. Server may respond with `Sunset` and `Deprecation` headers.

### Rule
**Never break v1 in place.** Add v2.

---

## 4.3 Resource Naming

- Nouns, plural, kebab-case: `/api/v1/athletes`, `/api/v1/performance-tests`.
- Sub-resources nested: `/api/v1/athletes/{id}/tests`.
- Verbs only for non-CRUD actions: `/api/v1/athletes/{id}:archive`.
- IDs are UUIDv7 (time-ordered, sortable).

---

## 4.4 HTTP Verbs & Semantics

| Verb | Purpose | Idempotent | Body |
|---|---|---|---|
| GET | Read | Yes | No |
| POST | Create | No | Yes |
| PUT | Full replace | Yes | Yes |
| PATCH | Partial update | Yes | Yes |
| DELETE | Remove | Yes | No |

---

## 4.5 Request & Response Envelopes

### Success Response (Single)
```json
{
  "data": { "...": "resource fields" },
  "meta": {
    "requestId": "01H8Z...",
    "serverTime": "2026-06-15T09:30:00Z"
  }
}
```

### Success Response (List)
```json
{
  "data": [ { "...": "..." } ],
  "meta": {
    "requestId": "01H8Z...",
    "pagination": {
      "cursor": "eyJpZCI6...",
      "nextCursor": "eyJpZCI6...",
      "pageSize": 25,
      "total": 342
    }
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "ATHLETE_NOT_FOUND",
    "message": "No athlete with id abc123.",
    "details": { "id": "abc123" },
    "traceId": "01H8Z..."
  }
}
```

### Rule
**Every response has a `requestId`/`traceId`.** For support triage.

---

## 4.6 Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|---|---|---|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failure |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Authenticated but not permitted (RBAC) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Stale `_rev`, duplicate unique field |
| 422 | Unprocessable | Semantic validation failed |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Uncaught exception |
| 503 | Service Unavailable | Downstream (LLM, DB) unavailable |

### Error Codes (Application-level)
Stable string codes independent of HTTP status:

- `VALIDATION_ERROR`
- `NOT_FOUND`
- `PERMISSION_DENIED`
- `CONFLICT`
- `RATE_LIMITED`
- `SUBSCRIPTION_REQUIRED`
- `CONSENT_REQUIRED`
- `INTEGRATION_UNAVAILABLE` (LLM/SIE upstream down)
- `INTERNAL`

### Client-side Mapping
A single `ApiErrorMapper` translates responses into typed `AppError` subclasses which the UI can pattern-match.

---

## 4.7 Retry Policy

### Retry Only When Safe
- Retry: `GET`, `PUT`, `DELETE`, `PATCH` (idempotent).
- Do NOT retry: `POST` — unless `Idempotency-Key` header is used.

### Backoff Schedule
- Base delay: 500 ms.
- Exponential factor: 2.
- Jitter: ±20%.
- Max attempts: 3 for user-visible calls; 8 for background sync.
- Circuit breaker: after 5 consecutive failures within 60 s to the same endpoint, halt for 30 s and surface offline UI.

### Retry Conditions
- Network errors (no HTTP response).
- 5xx.
- 429 (honor `Retry-After` header).
- 408 Request Timeout.

---

## 4.8 Timeouts

| Kind | Timeout |
|---|---|
| Regular API call | 15 s |
| Long-running (report gen, LLM) | 60 s (streamed) |
| Upload | 120 s |
| Health check | 5 s |

All timeouts are enforced client-side via AbortController.

---

## 4.9 Pagination

### Cursor-Based (default)
- Query: `?cursor=xxx&pageSize=25`.
- Response returns `nextCursor` in meta.
- Cursors are opaque (base64-encoded server state).
- `pageSize` default 25, max 100.

### Offset-Based (only for admin/report listings)
- Query: `?page=1&pageSize=25`.
- Response includes `total`.

---

## 4.10 Filtering, Sorting, Field Selection

### Filtering
- Simple: `?teamId=abc&status=injured`.
- Range: `?ageMin=18&ageMax=25`.
- Search: `?q=ahmed` (full-text where supported).

### Sorting
- `?sort=lastName,asc` or `?sort=-createdAt` (leading minus = desc).

### Field Selection
- `?fields=id,firstName,lastName,team.name` — shrink payload for lists.

---

## 4.11 Request Idempotency

For unsafe operations (`POST` create), clients may send `Idempotency-Key: <uuid>`. Server dedupes for 24 h. Prevents double-charges, duplicate athletes, etc.

---

## 4.12 Security

### Authentication
- All endpoints (except health & auth) require `Authorization: Bearer <jwt>` header.
- Tokens are short-lived (15 min) with refresh tokens (7 days) via SecureStore.
- Refresh flow is transparent to callers via an axios/fetch interceptor.

### Authorization (RBAC)
- Server checks role & permission on every request.
- 403 with `PERMISSION_DENIED` includes the required permission in `error.details.required`.

### Transport
- TLS 1.2+ only. HSTS enforced.
- Certificate pinning on release builds (see Chapter 06).

### Input Validation
- Every request body is validated with Pydantic (backend) and Zod (client) schemas.
- Reject unknown fields (strict mode).

### Output Sanitization
- Never leak stack traces or PII in error messages.
- Numeric IDs stripped from public URLs when possible (use UUIDs).

### CORS
- Allow list of exact origins.
- Credentials on cookies never used (we use bearer tokens).

### CSRF
- Not applicable (mobile clients + bearer tokens, no cookies).

### Headers
Every response includes:
- `X-Request-Id`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Cache-Control` (appropriate to endpoint)

---

## 4.13 Rate Limiting

### Tiered Limits

| Tier | Rate |
|---|---|
| Anonymous | 30 req/min per IP |
| Authenticated (free tier) | 300 req/min per user |
| Authenticated (pro tier) | 1200 req/min per user |
| LLM endpoints | 60 req/min per user, tokens/min cap |
| Admin | 3000 req/min |

### Response Headers
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset` (epoch seconds)
- `Retry-After` on 429

---

## 4.14 Streaming (SSE / Chunked)

Used for:
- AI Coach token streaming.
- Large report generation progress.

Contract:
- SSE events named per domain (`token`, `done`, `error`, `citation`).
- Client reconnects on drop with `Last-Event-ID`.
- Server flushes every ≤200 ms to keep UI responsive.

---

## 4.15 File Uploads

- **Chunked upload** for anything > 5 MB (bypass proxy limits).
- Request: `POST /api/v1/uploads/init` → returns `uploadId`.
- Each chunk: `PUT /api/v1/uploads/{uploadId}/chunks/{n}`.
- Finalize: `POST /api/v1/uploads/{uploadId}/complete`.
- Chunk size: 2 MB default.
- Retries per chunk.
- Server virus-scans on complete.

---

## 4.16 Logging & Observability

- Every request logged with `requestId`, `userId`, `route`, `method`, `status`, `latencyMs`.
- **Never** log tokens, passwords, or full PII.
- Structured JSON logs.
- Client sends `X-Client-Version`, `X-Platform` (ios/android/web) for triage.

---

## 4.17 API Contract Testing

- OpenAPI spec generated from FastAPI — committed to repo.
- Client types generated from OpenAPI — no hand-written types.
- Contract tests run in CI for every PR that touches routes.

---

_Continue to Chapter 05 — Performance._

# 09 · Documentation Standards

> Code that isn't documented doesn't fully exist. Documentation is a first-class deliverable.

---

## 9.1 Documentation Layers

| Layer | Audience | Location |
|---|---|---|
| Inline code comments | Fellow devs | Source files |
| JSDoc / TSDoc / Python docstrings | API consumers | Source files, auto-extracted |
| ADRs | Future devs, architects | `/app/adr/` |
| API reference | Client teams, integrators | Auto-generated from OpenAPI |
| Feature docs | Product, support | `/app/docs/features/` |
| User-facing help | End users | In-app Knowledge Center |
| Onboarding guide | New engineers | `/app/docs/onboarding.md` |
| Runbooks | On-call | `/app/runbooks/` |
| Changelog | All | `CHANGELOG.md` |
| Release notes | Users | In-app + store listings |

---

## 9.2 Code Comments

### Rules
- Comments explain **why**, not **what**.
- Explain **non-obvious tradeoffs, business rules, edge cases**.
- Reference specs and citations for scientific code:
  ```ts
  /**
   * ACWR (Acute:Chronic Workload Ratio).
   * Ref: Gabbett T. (2016) BJSM 50(5):273-280.
   * Ratios > 1.5 correlate with elevated injury risk.
   */
  ```
- Delete stale comments. A wrong comment is worse than no comment.

### JSDoc / TSDoc
All **exported functions and types** carry TSDoc:

```ts
/**
 * Compute Karvonen target heart rate.
 * @param restHR Resting heart rate in bpm.
 * @param maxHR Maximum heart rate in bpm.
 * @param intensity 0..1 fraction of heart rate reserve.
 * @returns Target heart rate in bpm.
 * @throws ValidationError if restHR >= maxHR or intensity ∉ [0,1].
 */
export function karvonenHeartRate(...) { ... }
```

### Python Docstrings (Google style)
```py
def compute_readiness(athlete_id: str) -> ReadinessResult:
    """Compute athlete readiness using SIE.

    Args:
        athlete_id: UUID of the athlete.

    Returns:
        ReadinessResult with score and status.

    Raises:
        NotFoundError: If athlete does not exist.
        ConsentError: If athlete has not consented.
    """
```

---

## 9.3 API Documentation

- **OpenAPI 3.1** spec auto-generated from FastAPI — committed at `/app/backend/openapi.json`.
- **Client TS types** auto-generated from the OpenAPI spec into `/app/frontend/src/types/api/`.
- **Human-readable API docs** hosted (Redoc or Scalar) linked from the developer portal.
- Every endpoint documents:
  - Purpose (one sentence).
  - Auth requirement.
  - Required permission.
  - Path/query/body params with descriptions.
  - Success responses with examples.
  - Error responses with `code` values.
  - Rate limit tier.

### Rule
**No public endpoint ships without a documented example request and response.**

---

## 9.4 Feature Documentation

Every feature module has a `README.md` inside `features/{name}/`:

```md
# Athletes Feature

## Purpose
Manage athlete records, biometrics, and consent.

## Scope
Owns: athlete CRUD, athlete list/detail screens, athlete-service, athlete-repository.
Does NOT own: tests, notes, reports (see respective features).

## Public API
- `useAthletes(query)` — hook returning paginated athletes.
- `AthleteDetailScreen({ id })` — default-exported screen.
- `athleteService.computeReadiness(id)` — service function.

## Data Model
See `types/athlete.types.ts`.

## Related Docs
PRD §…, ADR-0007, UIUX Doc 04 §4.8–4.13.
```

---

## 9.5 Architecture Decision Records (ADRs)

See Chapter 02 §2.10 for the template. Every ADR is immutable once accepted; new ADRs supersede old ones.

---

## 9.6 Onboarding Documentation

`/app/docs/onboarding.md` gets a new engineer to a green PR within a day:

1. Prerequisites (Node, Python, Xcode/Android Studio).
2. Clone + install steps (validated monthly).
3. First green test run.
4. Reading order: this Engineering guide + UI/UX guide + PRD.
5. First-PR guide: pick a `good-first-issue` and follow it end-to-end.

---

## 9.7 Runbooks

`/app/runbooks/` contains one file per on-call scenario:

- `auth-outage.md`
- `llm-proxy-down.md`
- `database-failover.md`
- `certificate-rotation.md`
- `data-restore-from-backup.md`

Each runbook has: symptoms, diagnosis steps, mitigation steps, verification, escalation path.

---

## 9.8 Changelog

`CHANGELOG.md` at repo root. Format follows [Keep a Changelog](https://keepachangelog.com):

```md
## [1.4.0] - 2026-06-15
### Added
- Offline sync engine (SM-142)
- Arabic Ramadan-aware scheduling (SM-158)

### Changed
- ACWR calculation now includes 7-day rolling median (SM-160)

### Fixed
- Chart animation stutter on Android 12 (SM-155)

### Security
- Bumped bcrypt cost to 12 (SM-149)
```

Auto-populated from conventional commit messages; manually reviewed before each release.

---

## 9.9 Release Notes

User-facing, bilingual, in `/app/release-notes/vX.Y.Z.md`:

```md
## v1.4.0 (June 15, 2026)

### What's new
- Your work now syncs seamlessly, even without internet.
- Arabic calendar and Ramadan-aware scheduling.

### Fixed
- Smoother chart animations on some Android devices.

---

## إصدار 1.4.0 (15 يونيو 2026)

### جديد
- مزامنة سلسة حتى بدون إنترنت.
- التقويم الهجري وجدولة تراعي رمضان.

### إصلاحات
- انسيابية أفضل للرسوم على أجهزة أندرويد.
```

---

## 9.10 Diagrams

- Use **Mermaid** where possible — rendered natively in Markdown.
- For deeper visuals, use PlantUML or draw.io with source committed.
- Diagrams live near the code they describe or in `/app/docs/diagrams/`.

---

## 9.11 Glossary

`/app/docs/glossary.md` defines every domain term used in code and UI:

- **Athlete** — A person under performance monitoring within an org.
- **ACWR** — Acute:Chronic Workload Ratio; injury risk indicator.
- **SIE** — SportMind Intelligence Engine.
- **SKB** — Scientific Knowledge Base.
- **Readiness** — A composite score (0-100) blending HRV, sleep, subjective wellness.
- …

Glossary terms carry translations for Arabic UI copy.

---

## 9.12 Documentation as Code

- Docs live in-repo in Markdown.
- Pull-request reviews apply to docs as they do to code.
- Broken links fail CI.
- Spelling/grammar checked by an automated tool (Vale or textlint) with a curated dictionary of sports-science jargon.

---

## 9.13 Anti-Patterns

- ❌ "Self-documenting code" as an excuse to skip docs on public APIs.
- ❌ Screenshots that go stale (prefer describing the state textually).
- ❌ Docs in a separate wiki that drifts from code.
- ❌ Sales-y language in engineering docs.

---

_Continue to Chapter 10 — Quality Gates._

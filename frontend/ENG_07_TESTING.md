# 07 · Testing Strategy

> Every code path we ship is proven. Every scientific formula is defended by tests. Test debt is real debt.

---

## 7.1 Test Pyramid

```
            🔺  E2E                (~5%)
         Integration              (~20%)
      Unit                        (~70%)
Static (types, lint, snapshot)    (baseline)
```

- **Static** — free, runs on every save.
- **Unit** — fast (< 10 ms each), majority of coverage.
- **Integration** — slower (< 500 ms each), tests interactions between layers.
- **E2E** — slowest (10+ s each), covers critical user journeys.

---

## 7.2 Coverage Targets

| Layer | Coverage Floor |
|---|---|
| Services & repositories | 90% lines, 85% branches |
| Hooks | 85% lines |
| Utilities & SIE formulas | 100% lines, 100% branches |
| UI components | Visual + interaction smoke |
| Backend routes | 85% lines |
| Overall project | 80% lines |

CI blocks PRs that drop coverage below the floor.

---

## 7.3 Unit Tests

### Frontend
- **Runner:** Jest + `@testing-library/react-native`.
- **Location:** co-located `Xxx.test.ts(x)` next to the file OR under `__tests__/` in the feature.
- **Style:** AAA (Arrange, Act, Assert).

```ts
describe('AthleteService.computeReadiness', () => {
  it('returns green when acwr < 1.3', async () => {
    const svc = new AthleteService(fakeRepo({...}), fakeSie, fakeAudit);
    const result = await svc.computeReadiness('a1');
    expect(result.status).toBe('green');
  });
});
```

### Backend
- **Runner:** pytest + pytest-asyncio.
- Same AAA discipline.
- Fakes and factories over mocks where possible.

---

## 7.4 Integration Tests

Test interactions between layers with real (or realistic) dependencies:

- **Frontend:** hook + service + fake repository (uses in-memory implementations of adapters).
- **Backend:** route + service + real MongoDB test container (spun up per suite).

Examples:
- "Signing in stores a session that persists across a simulated app restart."
- "Creating an athlete while offline enqueues a mutation and flushes on reconnect."
- "Requesting a report with unauthorized role returns 403."

---

## 7.5 End-to-End Tests

- **Framework:** Detox (native) OR Playwright (Expo web).
- **Scope:** critical user journeys only. Not every screen.

### The Sacred Nine E2E Journeys
1. New user signs up → verifies email → lands on empty dashboard.
2. Existing user signs in → sees populated dashboard.
3. Sports Scientist adds a new athlete → form validates → athlete appears in list.
4. Coach opens athlete detail → sees readiness ring → taps Explain → sees SIE trace.
5. User asks AI Coach a question → sees streaming answer → saves to athlete note.
6. Researcher runs a cohort query → sees scatter plot → exports as PDF.
7. User toggles language AR/EN → UI mirrors correctly → preference persists.
8. User goes offline → creates athlete → comes online → mutation syncs.
9. Admin invites user → assigns role → verifies RBAC gating in second session.

Each journey has explicit success/failure assertions and runs on both iOS and Android in CI.

---

## 7.6 Scientific Validation Tests (Domain Contract)

**The most important test category.** SportMind AI's credibility depends on correct calculations.

### The SIE Test Suite
Every formula in the SportMind Intelligence Engine has a test file with:
- **Reference cases** from peer-reviewed literature.
- **Known-good inputs → known-good outputs**.
- **Edge cases**: age boundaries, sex/gender, altitude, environmental adjustments.
- **Unit round-trips**: converting between imperial/metric produces identical outputs.

### Example
```ts
describe('SIE.karvonenHeartRate', () => {
  // Karvonen K. et al. 1957, Ann Med Exp Biol Fenn 35:307
  it.each([
    { restHR: 60, maxHR: 190, intensity: 0.7, expected: 151 },
    { restHR: 55, maxHR: 200, intensity: 0.85, expected: 178.25 },
  ])('computes target HR for $intensity intensity', ({ restHR, maxHR, intensity, expected }) => {
    expect(karvonenHeartRate({ restHR, maxHR, intensity })).toBeCloseTo(expected, 2);
  });
});
```

### The SKB Consistency Test
- Every SIE formula must have a matching entry in the Scientific Knowledge Base with a citation.
- CI verifies bidirectional consistency (no orphaned formulas, no orphan citations).

### Rule
**No SIE formula ships without a scientific reference and a test.**

---

## 7.7 UI Snapshot & Visual Tests

- **Snapshot tests** (Jest) for stable presentation components. Regenerated deliberately, reviewed as diffs.
- **Visual regression** (Chromatic, Percy, or Loki) for component library states — covers light/dark, LTR/RTL, and each of the 4 states.
- **A11y snapshots** validate accessibility tree structure of key screens.

### Rule
Every component in the library ships with:
- Light + Dark screenshots
- LTR + RTL screenshots
- Each state (empty, loading, error, success where applicable)

---

## 7.8 Accessibility Tests

- **Axe-core** for React (web preview) in CI.
- **iOS Accessibility Inspector** on every release candidate build.
- **Android Accessibility Scanner** likewise.
- Every interactive element has an `accessibilityLabel` and `accessibilityRole`.
- Keyboard/screen-reader navigation covered in E2E for the Sacred Nine journeys.

---

## 7.9 Performance Tests

- Automated **cold-start benchmark** per PR (baseline device).
- **List scroll benchmark** for FlashList athlete list.
- **Chart render benchmark** on Athlete Detail.
- **Bundle size check** — fails if delta > +100 KB without justification.

---

## 7.10 Security Tests

- **SAST** — Semgrep / CodeQL on every PR.
- **Dependency scan** — `yarn audit`, `pip-audit`, Snyk weekly.
- **DAST** — ZAP nightly against staging.
- **Auth flow fuzzing** — replay/tamper tokens; expect 401/403.
- **Rate limit tests** — assert limits enforced correctly.

---

## 7.11 Chaos & Resilience Tests

- Simulate network drop mid-request → UI stays responsive.
- Simulate 5xx from LLM proxy → UI degrades gracefully.
- Simulate stale token → refresh interceptor kicks in seamlessly.
- Simulate clock skew ± 5 min → tokens still validate.

---

## 7.12 Manual QA (Structured, Not Ad Hoc)

Before every release:
- **Smoke test matrix**: 3 devices × 2 languages = 6 runs of the Sacred Nine.
- **Regression scripts** in `/app/qa/scripts/` — versioned.
- **Exploratory session** of ≥ 30 min per major feature.

---

## 7.13 Test Data Strategy

- **Factories** for domain objects (`athleteFactory`, `testFactory`).
- **Seed data** for staging: 3 orgs, 5 teams, 40 athletes, 200 tests, 50 notes.
- **Anonymized production data** never used outside secured environments; PII scrubbed via a scrubbing pipeline.

### Rule
**Never test against real PII in dev/staging.** Ever.

---

## 7.14 Test Naming & Structure

- Test files mirror source: `athlete.service.ts` → `athlete.service.test.ts`.
- `describe` names the unit under test.
- `it` reads as a sentence describing behavior:
  - ✅ `it('returns error when athlete lacks consent')`
  - ❌ `it('test 1')`

---

## 7.15 Testing Anti-Patterns

- ❌ Testing implementation details (private methods, internal state).
- ❌ Snapshotting entire screens (creates brittle noise).
- ❌ Mocking React — use real testing library.
- ❌ Shared mutable test fixtures.
- ❌ Sleeping instead of waiting on state (`await screen.findByText(...)`).
- ❌ Skipping tests to unblock a PR (create a ticket, don't skip).

---

_Continue to Chapter 08 — CI/CD._

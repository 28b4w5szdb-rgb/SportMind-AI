# SportMind AI — Project State

> Living snapshot for project management. Update at phase boundaries.

| Field | Value |
|-------|-------|
| **Current version** | v0.9-alpha |
| **Current branch** | `develop/cloud-foundation` |
| **Stable tag** | `v0.9-alpha` on `main` |
| **Current phase** | Phase 6C.7 — SSID Scientific Sports Intelligence Engine (complete) |
| **Next phase** | Phase 6C.8 — Firestore Session Persistence + Security Rules |

---

## Completed Phases Summary

| Phase | Focus | Status |
|-------|-------|--------|
| **3A–3K** | Core product modules, SSID, testing center, wellness stack | ✅ Complete |
| **4A–5G** | Wearables, design system, dashboard, AI Coach, lab, reports, brand | ✅ Complete |
| **5F–5F.1** | Production polish + localization | ✅ Complete |
| **6A** | Firebase cloud foundation (config, models, feature flag) | ✅ Complete |
| **6B** | Firebase Authentication production layer | ✅ Complete |
| **6B.1** | Auth persistence, Firestore user profiles, SessionManager | ✅ Complete |
| **6C.0.1–6C.0.3** | Scientific audit + data model + elite extensions (design) | ✅ Approved |
| **6C.1** | Scientific Firestore core foundation (types, paths, contracts) | ✅ Complete |
| **6C.2** | Catalog seed data + read-only Firestore/mock repository adapters | ✅ Complete |
| **6C.3** | Assessment Definition Engine — 130 catalog definitions + search API | ✅ Complete |
| **6C.4** | Normative Reference Engine — 34 placeholder profiles + classification API | ✅ Complete |
| **6C.5** | Universal Assessment Session Engine — Raw → Derived → Interpretation pipeline | ✅ Complete |
| **6C.6** | Scientific Calculation Engine — 14 versioned formulas, sole calculation layer | ✅ Complete |
| **6C.6.1** | Scientific Calculation Audit — validation hardening, HR zones v1.1, 24 tests | ✅ Complete |
| **6C.7** | SSID Scientific Sports Intelligence Engine — rule-based bilingual interpretation | ✅ Complete |

---

## Active Architecture Summary

### Frontend (Expo / React Native)

- **Router:** Expo Router — unchanged; mock mode default
- **State:** Zustand mock store — runtime source of truth when `USE_CLOUD_DATA=false`
- **i18n:** English + Arabic with RTL
- **Analytics / SSID / AI Coach:** Unchanged — local mock engines

### Data Mode (current runtime)

| Setting | Default | Effect |
|---------|---------|--------|
| `EXPO_PUBLIC_USE_CLOUD_DATA` | `false` | Mock store for all screens |
| `EXPO_PUBLIC_DEV_BYPASS_AUTH` | `true` (dev) | Dev auth bypass |

### Cloud Stack

```
frontend/src/cloud/
├── firebase/       # Lazy-init app, auth, firestore, storage
├── auth/           # Firebase + Supabase unified AuthProvider
├── firestore/      # Phase 6A entity models + repository interfaces
├── scientific/     # Phase 6C.1–6C.7 — catalog, engines, session + calculation + SSID pipeline
├── storage/        # Placeholder
└── sync/           # Readiness diagnostics + sync placeholder
```

#### Phase 6C.7 — SSID Scientific Sports Intelligence Engine

| Principle | Implementation |
|-----------|----------------|
| **Scientific Inside, Simple Outside** | Five deterministic interpretation layers — no AI text generation |
| **Pipeline** | Session → Calculation → Normative → SSID → Standardized Interpretation |
| **Rule-based** | 36 SSID rules (7 band + 18 category + 11 metric) covering 130 definitions |
| **Bilingual** | English + Arabic for all five layers |

| Area | Contents |
|------|----------|
| **Layers** | Classification, Scientific Meaning, Performance Meaning, Risk Analysis, Action Recommendation |
| **Engine API** | `generateInterpretation`, `interpret`, `resolveRule`, `listSupportedRules` |
| **Integration** | `AssessmentSessionEngine.generateScientificInterpretation()` when SSID engine injected |
| **Metadata** | formulaVersion, referenceVersion, ruleVersion, confidence, generatedAt |

#### Phase 6C.6.1 — Scientific Calculation Audit & Validation

| Principle | Implementation |
|-----------|----------------|
| **Correctness first** | All 14 formulas audited — input, unit, output, and edge-case validation |
| **HR Zones upgrade** | Five zones via `%HRmax` or Karvonen (HRR); method stored in `structured_result` |
| **Traceable metadata** | Every result exposes `formulaVersion`, `calculationTime`, `warnings`, `validationStatus` |
| **Test coverage** | 24 lightweight tests across 11 formula groups + validation edge cases |

| Area | Contents |
|------|----------|
| **Validation** | Negative values, impossible BMI/HR, body fat >100%, division by zero, unit mismatch |
| **Post-calc checks** | Output validators reject impossible derived values after formula execution |
| **HR Zones** | `hrZoneCalculator.ts` — Zone 1–5 with `%HRmax` and Karvonen methods (v1.1.0) |
| **Tests** | `npm run test:scientific` — 24 passing audit tests |

#### Phase 6C.6 — Scientific Calculation Engine

| Principle | Implementation |
|-----------|----------------|
| **Scientific Inside, Simple Outside** | Versioned formulas with bilingual metadata; deterministic executors only |
| **Catalog First** | Formula registry aligned with catalog seed (14 formulas) + optional catalog resolution |
| **Raw → Formula → Derived Metric** | `ScientificCalculationEngine.calculate()` — sole platform calculation layer |
| **Traceable calculations** | Every output stores formula version, input keys, timestamp, status, warnings |

| Area | Contents |
|------|----------|
| **Formula registry** | 14 active formulas: BMI, body fat, lean mass, muscle mass, body water, VO₂max, HR zones, training load, ACWR, recovery, readiness, relative strength, sprint momentum, running speed |
| **Engine API** | `calculate`, `calculateBatch`, `validateInputs`, `validateUnits`, `resolveFormula`, `getFormulaByKey`, `listSupportedFormulas` |
| **Validation** | Negative height/weight, invalid HR/body fat, division by zero, missing fields, unit mismatch |
| **Integration** | `AssessmentSessionEngine.calculateDerivedMetrics()` delegates to calculation engine |

#### Phase 6C.5 — Universal Assessment Session Engine

| Principle | Implementation |
|-----------|----------------|
| **Catalog First** | No session without a catalog Assessment Definition + protocol version |
| **Raw → Derived → Interpretation** | Trials → calculated metrics → normative snapshot only (no reference tables stored) |
| **Append-only events** | In-memory mock store; no Firestore writes in this phase |
| **No interpretation generation** | Interpretation placeholder only (`generated: false`) |

| Area | Contents |
|------|----------|
| **Session model** | Identity, raw measurements, calculated metrics, normative snapshot, protocol snapshot, interpretation placeholder |
| **Engine API** | `createAssessmentSession`, `validateAssessmentSession`, `calculateDerivedMetrics`, `compareWithNormativeReference`, `buildSessionSnapshot`, `getAssessmentSummary` |
| **Repository** | Read-only `AssessmentSessionRepository` + mock memory store |
| **Validation** | Definition/protocol existence, required inputs, units, source types, snapshot integrity |

#### Phase 6C.4 — Normative Reference Engine

| Principle | Implementation |
|-----------|----------------|
| **No overclaiming** | Default `sourceQuality: placeholder` with explicit citation placeholders |
| **Missing reference behavior** | Returns `classification: unknown`, `reason: no_reference_available`, recommends raw value + trend |
| **Raw / Derived / Interpretation** | Engine classifies raw metric values against catalog bands only — no SSID/analytics changes |

| Area | Contents |
|------|----------|
| **Profiles** | 34 priority placeholder reference profiles for key assessments |
| **Engine** | `findBestReferenceProfile`, `classifyMetricValue`, `calculateZScore`, `getPerformanceBand` |
| **Bands** | Six-level bands: poor → elite with population filters |
| **Repository** | Seed-backed mock + Firestore fallback read paths |

#### Phase 6C.3 — Assessment Definition Engine

| Principle | Implementation |
|-----------|----------------|
| **Scientific Inside, Simple Outside** | Rich catalog documents; UI unchanged — Performance Lab still uses local registry |
| **Progressive Disclosure** | `beginner` / `professional` / `research` usability mode field groups on every definition |
| **Catalog First** | 130 assessment definitions seeded; no hardcoded tests in new cloud paths |
| **Three-Click Rule** | Repository search + category/tier filters ready for future UI wiring |

| Area | Contents |
|------|----------|
| **Definitions** | 71 Performance Lab mappings + 59 scientific audit additions = **130** active definitions |
| **Engine** | `AssessmentDefinitionEngine` with list/get/search/category/tier methods |
| **Validation** | Keys, category, evidence tier, input/output schema, source types, protocol versions |
| **Repository** | Seed-backed mock + Firestore fallback for all definition read paths |

#### Phase 6C.2 — `scientific/` catalog layer (read-only)

| Area | Contents |
|------|----------|
| **Seed data** | Sports, assessment categories (A–R), evidence tiers, equipment types, formulas + versions, questionnaire templates |
| **Memory cache** | In-process catalog/org read cache (no persistence) |
| **Mock adapters** | Default when `USE_CLOUD_DATA=false` — seed-backed catalog, empty org stubs |
| **Firestore adapters** | Read-only catalog (Firestore first, seed fallback) + org subcollection reads when cloud enabled |
| **Registry** | `getScientificRepositoryRegistry()` returns real adapters when cloud gate passes |

#### Phase 6C.1 — `scientific/` module (infrastructure)

| Area | Contents |
|------|----------|
| **Paths** | Global `catalog/*` + `organizations/{orgId}/*` path helpers |
| **Catalog models** | Sports, assessment categories (A–R), definitions, evidence tiers, formulas, equipment types/models, normative references, questionnaire templates |
| **Org models** | Organization root, users, teams, athletes, seasons, locations, equipment, sport_configs, role_definitions |
| **Validation** | Runtime validators for versioned catalog + org entities |
| **Security** | Collection policy metadata for future Firestore rules |
| **Repositories** | Interface contracts + registry with mock/Firestore adapter factories |

**Not implemented (by design):** passport, timeline, equipment business logic, environmental records, Firestore session persistence, security rules deployment, SSID/AI/report generation from sessions.

### Authentication (Phase 6B / 6B.1)

- Firebase Auth when `USE_CLOUD_DATA=true` + Firebase configured
- Native/web session persistence (AsyncStorage / browser)
- Firestore `users/{uid}` profile on sign-up (cloud mode)
- Supabase + dev bypass preserved

---

## Key Commits (recent)

| Commit | Phase | Description |
|--------|-------|-------------|
| *(pending)* | 6C.7 | SSID Scientific Sports Intelligence Engine — 36 rules, 130 definitions |
| `a91f98f` | 6C.6.1 | Scientific Calculation Audit — HR zones, validation, 24 tests |
| `4b9c54f` | 6C.6 | Scientific Calculation Engine — 14 versioned formulas |
| `96a1133` | 6C.5 | Universal Assessment Session Engine |
| `2a73393` | 6C.4 | Normative Reference Engine — 34 placeholder profiles |
| `e81b8c2` | 6C.1 | Scientific Firestore core foundation |
| `8ee0f4b` | UX | Calculator Hub entry from More screen |
| `f9d693e` | 6B.1 | Auth persistence + user profiles |
| `6973515` | 6B | Firebase Auth production layer |
| `202de29` | 6A | Cloud foundation architecture |

---

## Next Planned Phase: 6C.8

- Firestore assessment session persistence
- Security rules deployment from `scientific/security/collectionPolicy.ts`
- Performance Lab bridge (optional)

See [ROADMAP.md](./ROADMAP.md).

---

## Important Notes

1. **Mock data is active by default.** No Firestore scientific writes occur in UI paths.
2. **Scientific catalog reads use seed data in mock mode.** Firestore adapters fall back to seed when collections are empty.
3. **`USE_CLOUD_DATA=false` by default.** Safe for v0.9-alpha demos.
4. **Do not commit secrets.** Use `frontend/.env.example`.
5. **UI, dashboard, analytics, AI Coach unchanged** through Phase 6C.7 — cloud SSID is engine-only.
6. **Sessions are in-memory only** — append-only mock store until Firestore persistence phase.
7. **All derived metrics must flow through `ScientificCalculationEngine`** — no duplicated equations in session or UI paths.
8. **SSID interpretation is rule-based and deterministic** — use `createSsidInterpretationEngineFromRegistry()` in cloud pipeline.
9. **Scientific Calculation Audit complete** — run `npm run test:scientific` before integration work.

---

## Documentation Index

| Document | Location |
|----------|----------|
| Roadmap | [ROADMAP.md](./ROADMAP.md) |
| Changelog | [docs/CHANGELOG.md](./docs/CHANGELOG.md) |
| Brand guide | [frontend/BRAND_GUIDE.md](./frontend/BRAND_GUIDE.md) |
| Env template | [frontend/.env.example](./frontend/.env.example) |

*Last updated: Phase 6C.7*

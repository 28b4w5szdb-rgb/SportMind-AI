# SportMind AI — Project State

> Living snapshot for project management. Update at phase boundaries.

| Field | Value |
|-------|-------|
| **Current version** | v0.9-alpha |
| **Current branch** | `develop/cloud-foundation` |
| **Stable tag** | `v0.9-alpha` on `main` |
| **Current phase** | Phase 6D.3 — Athlete Workspace Role Context & Cloud Readiness (complete) |
| **Next phase** | Phase 6D — Firebase Storage |

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
| **6C.8** | Scientific Persistence Layer — repository-backed mock/Firestore gateway | ✅ Complete |
| **6C.8.1** | Atomic Scientific Persistence — transactional bundle writes, audit, retry | ✅ Complete |
| **6C.9** | Performance Lab Bridge — Scientific Core integration via adapter layer | ✅ Complete |
| **6C.9.1** | Performance Lab Read Path Bridge — result/history scientific read + dedup | ✅ Complete |
| **6C.9.2** | Performance Lab Read Screen Bridge — dashboard, library, category, benchmark, compare | ✅ Complete |
| **6C.9.3** | Custom Assessments Bridge — org-scoped definitions, scientific entry pipeline, legacy fallback | ✅ Complete |
| **6C.10** | Scientific Security & RBAC — Firestore rules, multi-tenant isolation, permission helpers | ✅ Complete |
| **6C.10.1** | Firebase Rules Emulator & Security Tests — 36 rules tests, emulator config | ✅ Complete |
| **6C.11** | Custom Claims & Membership Permissions — effective resolver, rules + tests | ✅ Complete |
| **6D.1** | Athlete Digital Passport — summary layer, builder, workspace overview | ✅ Complete |
| **6D.2** | Scientific Timeline — chronological index layer, builder, workspace UI | ✅ Complete |
| **6D.3** | Workspace Context — role-aware passport/timeline, cloud bridge, dev diagnostics | ✅ Complete |

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
├── scientific/     # Phase 6C.1–6C.9 — catalog, engines, bridge, atomic persistence
├── storage/        # Placeholder
└── sync/           # Readiness diagnostics + sync placeholder
```

#### Phase 6D.3 — Athlete Workspace Role Context & Cloud Readiness

| Principle | Implementation |
|-----------|----------------|
| **Workspace context** | `AthleteWorkspaceProvider` — athlete, org, role, permissions, passport, timeline, visibility |
| **Role presets** | coach, sports_scientist, team_doctor, physiotherapist, researcher, athlete, org_admin |
| **Security** | `filterPassportForContext` / `filterTimelineForContext` via `SecurityContext` |
| **Cloud bridge** | `loadCloudSessionsForAthlete()` when scientific cloud enabled |
| **Mock fallback** | Shared `buildWorkspaceArtifacts()` from mock store when cloud off |
| **Dev diagnostics** | `WorkspaceVisibilityDiagnostics` — `__DEV__` only |
| **Performance** | Single source aggregation; timeline lazy-loaded after passport |

#### Phase 6D.2 — Scientific Timeline

| Principle | Implementation |
|-----------|----------------|
| **Index layer** | `ScientificTimelineEvent` with source references — no raw duplication |
| **Event types** | 13 types: assessment, training, match, injury, recovery, nutrition, wearable, GPS, laboratory, report, research, AI placeholder, passport version |
| **Builder** | `scientificTimelineBuilder.ts` from sessions, injuries, wellness, training, nutrition, wearables, reports, passport |
| **Visibility** | `timelineAccess.ts` — coach/clinical/research filtering |
| **UI** | `WorkspaceScientificTimeline` with category filters, severity badges, compact cards |
| **Tests** | 7 unit tests (builder + access) |

#### Phase 6D.1 — Athlete Digital Passport

| Principle | Implementation |
|-----------|----------------|
| **Summary layer** | `AthletePassport` with 18 sections — references source collections, no raw duplication |
| **Builder** | `passportBuilder.ts` assembles from athlete profile, tests, analytics, wellness, training, nutrition, wearables |
| **Visibility** | `passportAccess.ts` — coach, sports scientist, clinical, research, athlete views |
| **Mock bridge** | `athletePassportMockBridge.ts` + `useAthletePassport()` hook |
| **UI** | `WorkspacePassportOverview` in Athlete Intelligence Workspace overview section |
| **Tests** | 7 unit tests (builder + access) |

#### Phase 6C.11 — Custom Claims & Membership Permissions

| Principle | Implementation |
|-----------|----------------|
| **Effective resolver** | `effectivePermissionsResolver.ts` unions claims + membership roles + direct permissions + flags |
| **Membership fields** | `role_ids`, `permissions`, `clinical_access`, `research_access`, `export_research` on OrgMember |
| **Claims helpers** | `buildCustomClaimsPayload`, `validateClaimsPayload`, `buildClaimsFromMembership` |
| **Firestore rules** | `hasPermission(orgId, permission)` checks claims OR membership-derived permissions |
| **Rules tests** | 45 total including 9 membership permission scenarios |

#### Phase 6C.10.1 — Firebase Rules Emulator & Security Tests

| Principle | Implementation |
|-----------|----------------|
| **Emulator config** | `firebase.json` + `.firebaserc.example` (no real project IDs) |
| **Rules tests** | 36 tests across 9 suites via `@firebase/rules-unit-testing` |
| **Scripts** | Root `yarn test:rules`, `yarn emulators:start` |
| **Validation** | Multi-tenant, RBAC, clinical, research, catalog, reports, audit |

#### Phase 6C.10 — Scientific Security & RBAC

| Principle | Implementation |
|-----------|----------------|
| **Multi-tenant isolation** | All org data scoped by `orgId`; rules deny cross-org access |
| **RBAC** | 10 system roles with 13 permission keys |
| **Clinical protection** | Full medical in `medical_records`; coaches see `availability_status` only |
| **Research de-identification** | PII stripped; `pseudonym_id` required for research datasets |
| **Custom claims design** | TypeScript types prepared; provisioning deferred |
| **Audit policy** | 7 event types defined; append-only `audit_logs` path |
| **Rules artifact** | `firestore.rules` authored — not deployed |

#### Phase 6C.9.3 — Custom Assessments Bridge

| Principle | Implementation |
|-----------|----------------|
| **Org-scoped definitions** | Custom tests create `CatalogAssessmentDefinition` + protocol via `customAssessmentBridge` |
| **Registry overlay** | `customAssessmentRegistry` + `createCustomAwareDefinitionRepository` merge customs into mock catalog |
| **Entry pipeline** | Custom scientific defs follow validation → calculation → normative → SSID → session → persistence |
| **Legacy fallback** | Pre-bridge customs marked `scientificStatus: legacy_custom`; incomplete defs use legacy SSID path |
| **Progressive disclosure** | Basic / Advanced / Research sections on custom create — defaults to `screening` evidence tier |
| **Validation** | Name, unit, metric, category, source type, duplicate keys; clinical/research require metadata |

#### Phase 6C.9.2 — Performance Lab Read Screen Bridge

| Principle | Implementation |
|-----------|----------------|
| **Dashboard** | Scientific session stats via merged history + catalog protocol count |
| **Library** | `useScientificTestLibrary` — Assessment Definition Engine with lazy cache |
| **Category** | `useScientificCategoryAssessments` — dynamic catalog load per category |
| **Compare / Benchmark** | Merged scientific sessions with SSID/normative-enriched ratings |
| **Filters** | Evidence tier + usability mode filters using existing filter bar pattern |

#### Phase 6C.9.1 — Performance Lab Read Path Bridge

| Principle | Implementation |
|-----------|----------------|
| **Result read** | `usePerformanceLabResult` — scientific session first, mock fallback |
| **History merge** | `usePerformanceLabHistory` — scientific sessions preferred, deduped dual-write |
| **View model** | `PerformanceLabResultViewModel` maps session → existing UI model |
| **ID alignment** | Save path uses `session_id` as result id for read consistency |
| **Errors** | Friendly loading/read failure i18n — no internal IDs exposed |

#### Phase 6C.9 — Performance Lab Bridge

| Principle | Implementation |
|-----------|----------------|
| **Adapter layer** | `performance-lab/bridge/` — Legacy UI → Scientific Core without screen redesign |
| **Pipeline** | Definition → Calculation → Normative → SSID → Session → Persistence Gateway |
| **Dual write** | Scientific session persisted + mock store updated for analytics/history continuity |
| **Preview** | `useScientificTestPreview` — async scientific preview with legacy fallback |
| **Errors** | Friendly i18n messages — no Firebase IDs or stack traces exposed |

#### Phase 6C.8.1 — Atomic Scientific Persistence

| Principle | Implementation |
|-----------|----------------|
| **Atomic bundle** | Single `persist_session_bundle` operation writes all 6 entity types |
| **Firestore transaction** | `runTransaction` with read-before-write duplicate guard |
| **Mock rollback** | Staging + rollback simulation; failure/partial-write hooks for tests |
| **Transaction audit** | `transactionId`, status, timestamps, duration, retry count, failure reason |
| **Retry policy** | Transient Firestore errors retried (max 3); validation errors fail immediately |
| **Structured logging** | In-memory ring buffer via `persistenceLogger` — no console spam |

#### Phase 6C.8 — Scientific Persistence Layer

| Principle | Implementation |
|-----------|----------------|
| **Single gateway** | `ScientificPersistenceGateway` — sole write path to mock or Firestore |
| **Append-only** | Rejects duplicate sessions; immutable scientific records |
| **Feature gate** | Cloud enabled → Firestore adapters; cloud disabled → mock adapters |
| **Validate before write** | `validatePersistableAssessmentSession` rejects invalid records |

| Area | Contents |
|------|----------|
| **Repositories** | `AssessmentSessionRepository`, `ScientificCalculationRepository`, `NormativeSnapshotRepository`, `ScientificInterpretationRepository` |
| **Entities persisted** | Session metadata, raw measurements, calculated metrics, normative snapshot, SSID interpretation, audit metadata (6 types) |
| **Adapters** | Identical mock + Firestore APIs for all four repositories |
| **Integration** | Session engine persists via gateway when injected from registry |

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

**Not implemented (by design):** timeline, equipment business logic, environmental records, Firestore session persistence, security rules deployment, SSID/AI/report generation from sessions, passport cloud persistence, passport transfer.

### Authentication (Phase 6B / 6B.1)

- Firebase Auth when `USE_CLOUD_DATA=true` + Firebase configured
- Native/web session persistence (AsyncStorage / browser)
- Firestore `users/{uid}` profile on sign-up (cloud mode)
- Supabase + dev bypass preserved

---

## Key Commits (recent)

| Commit | Phase | Description |
|--------|-------|-------------|
| *(pending)* | 6C.8 | Scientific Persistence Layer — 4 repositories, mock/Firestore gateway |
| `84b163e` | 6C.7 | SSID Scientific Sports Intelligence Engine — 36 rules, 130 definitions |
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

## Next Planned Phase: 6C.9

- Organization write paths
- Performance Lab bridge to cloud scientific pipeline

See [ROADMAP.md](./ROADMAP.md).

---

## Important Notes

1. **Mock data is active by default.** Persistence uses in-memory mock adapters when cloud is disabled.
2. **Scientific catalog reads use seed data in mock mode.** Firestore adapters fall back to seed when collections are empty.
3. **`USE_CLOUD_DATA=false` by default.** Safe for v0.9-alpha demos.
4. **Do not commit secrets.** Use `frontend/.env.example`.
5. **UI, dashboard, analytics, AI Coach unchanged** through Phase 6C.8.
6. **All scientific writes route through `ScientificPersistenceGateway`** — append-only, validated, version-aware.
7. **All derived metrics must flow through `ScientificCalculationEngine`** — no duplicated equations.
8. **SSID interpretation is rule-based and deterministic** — persisted as immutable session sub-records.
9. **Run `npm run test:scientific` and `npm run test:ssid`** before integration work.

---

## Documentation Index

| Document | Location |
|----------|----------|
| Roadmap | [ROADMAP.md](./ROADMAP.md) |
| Changelog | [docs/CHANGELOG.md](./docs/CHANGELOG.md) |
| Brand guide | [frontend/BRAND_GUIDE.md](./frontend/BRAND_GUIDE.md) |
| Env template | [frontend/.env.example](./frontend/.env.example) |

*Last updated: Phase 6C.9.2*

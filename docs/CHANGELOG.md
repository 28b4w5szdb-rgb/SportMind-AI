# Changelog

All notable changes to SportMind AI are documented here.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Phase 7.0 — Scientific Reporting Engine] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Scientific Report domain model** — `ScientificReport`, 18 modular sections, evidence summary, version metadata, source references
- **Report types** — athlete, team, performance, recovery, sports_medicine, research
- **Deterministic builder** — `scientificReportBuilder.ts` inputs passport, timeline, sessions; no AI text generation
- **Evidence-aware language** — `evidenceLanguage.ts` tier-based phrasing (screening/field/professional/research/clinical)
- **Role-aware reporting** — `reportAccess.ts` filters sections for coach, sports_scientist, clinical, research viewers
- **Feature module** — `features/scientific-report/` bridge, hook, legacy mapper, `ScientificReportPreview` component
- **UI integration** — Report Builder preview shows structured scientific sections; export placeholders reference engine ID
- **Bilingual output** — all section titles and bodies in EN/AR
- **Unit tests** — 15 tests (builder, access, evidence language)

### Design principles documented

- Scientific inside, simple outside — report is output layer, not data source
- No duplicate scientific truth — source references only
- PDF export explicitly deferred

### Unchanged (by design)

- Dashboard, Performance Lab pipeline, Scientific Core engines
- No AI generation, Cloud Functions, email, or research export pipeline
- Legacy mock reports and wizard steps remain functional

---

## [v0.9-alpha] — 2026-07-06

**Tag:** `v0.9-alpha`  
**Branch at freeze:** `main`

### Milestone Summary

v0.9-alpha is the first stable product baseline before Firebase integration. The app is fully functional in **offline/mock mode** with bilingual EN/AR support, premium UI, and comprehensive sports-science modules — no backend required for demos or development.

### Added

- **Sports Science Testing Center** with registry-driven protocols, SSID interpretation, and demographic reference groups
- **Athlete Intelligence Workspace** with body map, analytics panels, and quick actions
- **AI Coach** premium consultant UI with structured mock responses and module routing
- **Dashboard** command center with KPIs, team intelligence strip, and readiness overview
- **Performance Lab** premium laboratory experience with benchmarks and history
- **Scientific Report Builder** — 6-step wizard, 10 report types, themes, live preview, mock export
- **Training Builder**, **Nutrition Center**, **Recovery Center**, **Sports Medicine**, **Daily Check-In**
- **Team Intelligence** squad analytics
- **Wearables** device center with mock sync architecture
- **SSID Engine** for calculator and test interpretation (EN/AR)
- **Design system** (Phase 5A): tokens, `Button`, `Card`, `EmptyState`, `ErrorState`, `Skeleton`
- **Brand identity** (Phase 5G): brand guide, splash screen, onboarding, app icon, auth shell
- **Localization pass** (Phase 5F.1): More, Help, Knowledge Center, benchmark, mock AI surfaces

### Changed

- Migrated high-traffic screens to shared design system primitives
- RTL/LTR consistency improvements across navigation and forms
- Internal developer-facing strings replaced with i18n keys across major screens

### Fixed

- AI Coach scroll, keyboard, and composer layout on iPhone
- Arabic message bubble text clipping
- More screen quick-access localization
- Team trend labels and ranking meta display

### Known Limitations (v0.9-alpha)

- All data is local mock / AsyncStorage — no cloud persistence
- Auth uses Supabase stub or dev bypass — not production Firebase
- AI Coach uses mock responses — no OpenAI
- Wearables use mock sync only
- Some screens retain inline bilingual strings (athletes tab, mock AI data layer)

---

## [Phase 6A — Cloud Foundation] — 2026-07-06

**Branch:** `develop/cloud-foundation`  
**Commit:** `202de29`

### Added

- **Firebase SDK** (`firebase` package) with lazy initialization
- **Cloud config layer** (`frontend/src/core/config/firebase.ts`, `cloud.ts`)
- **Feature flag** `EXPO_PUBLIC_USE_CLOUD_DATA` (default: `false`)
- **Cloud architecture folders:**
  - `src/cloud/firebase` — app, auth, firestore, storage, messaging placeholder
  - `src/cloud/auth` — `AuthRepository` interface
  - `src/cloud/firestore` — typed models + repository interfaces
  - `src/cloud/storage` — `StorageRepository` placeholder
  - `src/cloud/sync` — sync engine placeholder + readiness diagnostics
- **Typed cloud models:** UserProfile, Organization, Team, Athlete, TestResult, TrainingPlan, InjuryRecord, NutritionLog, Report, WearableRecord
- **Repository interfaces:** Auth, Athlete, Team, Test, Report
- **Settings → Cloud & Data → Firebase Readiness** screen
- **`.env.example`** updated with Firebase key placeholders

### Unchanged (by design)

- Mock Zustand store remains the runtime data source
- No Firestore reads/writes from UI screens
- No Firebase Auth wired to login flow
- Supabase auth layer preserved for parallel migration in Phase 6B

---

## [Phase 6C.1 — Scientific Firestore Core Foundation] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **`frontend/src/cloud/scientific/`** — infrastructure-only scientific module
- **Global catalog path helpers** — sports, assessment categories (A–R), definitions, evidence tiers, formulas, equipment types/models, normative references, questionnaire templates
- **Organization path helpers** — users, teams, athletes, seasons, locations, equipment, sport_configs, role_definitions
- **Typed models** — versioned catalog documents + org-scoped scientific entities
- **Validation layer** — runtime validators for evidence tier, category codes, version meta, key entities
- **Security policy metadata** — future Firestore rules preparation (tenant isolation, no public writes)
- **Repository contracts** — catalog + organization interfaces; lazy registry stub (`null` adapters)
- **Feature gate** — `isScientificCloudEnabled()` requires `USE_CLOUD_DATA=true` + Firebase configured

### Unchanged (by design)

- No UI, dashboard, analytics, SSID, or AI Coach changes
- No assessment sessions, passport, timeline, or environmental records
- No Firestore reads/writes, migrations, Cloud Functions, or BigQuery
- Mock store remains default runtime

---

## [Phase 6C.2 — Firestore Catalog Seed & Repository Adapters] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Catalog seed data** — sports, assessment categories (A–R), evidence tiers, equipment types, formula registry + versions, questionnaire templates
- **`CatalogSeedIndex`** — in-memory lookup helpers with bilingual metadata
- **Memory cache** — lightweight in-process cache for catalog and org reads
- **Mock adapters** — seed-backed `CatalogRepository`; empty read-only `OrganizationRepository`
- **Firestore adapters** — read-only catalog (remote first, seed fallback) and org subcollection reads
- **Adapter factories** — `createCatalogRepository()` / `createOrganizationRepository()` gated by `canAccessScientificFirestore()`
- **Registry** — `getScientificRepositoryRegistry()` returns real adapters when `USE_CLOUD_DATA=true` and Firebase configured

### Unchanged (by design)

- No UI, dashboard, analytics, SSID, or AI Coach changes
- No assessment sessions, passport, timeline, or environmental records
- No Firestore writes, migrations, Cloud Functions, BigQuery, or security rules deployment
- Mock store remains default runtime

---

## [Phase 6C.3 — Assessment Definition Engine] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Assessment Definition Engine** — `AssessmentDefinitionEngine` with list/get/search/category/tier read API
- **130 assessment definitions** — 71 mapped from Performance Lab registry + 59 scientific audit additions
- **Extended catalog model** — purpose, audience, usability modes, inputs/outputs, protocol summary, evidence tier, tags, AI/report compatibility
- **Seed pipeline** — `definitionBuilder`, Performance Lab mapper, `CatalogSeedIndex` definition lookups
- **Repository methods** — `listAssessmentDefinitions`, `getAssessmentDefinitionByKey`, `listAssessmentDefinitionsByCategory`, `listAssessmentDefinitionsByEvidenceTier`, `searchAssessmentDefinitions`
- **Validation** — assessment keys, schemas, source types, usability modes, protocol versions

### Design principles documented

- Scientific Inside, Simple Outside
- Progressive Disclosure (beginner / professional / research modes)
- Catalog First — no hardcoded scientific tests in cloud layer

### Unchanged (by design)

- No UI, dashboard, analytics, SSID, or AI Coach changes
- No assessment sessions, result recording, passport, timeline, or normative engine
- No Firestore writes or security rules deployment
- Mock store + Performance Lab registry remain default runtime

---

## [Phase 6C.4 — Normative Reference Engine] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Normative Reference Engine** — `NormativeReferenceEngine` with list/get/classify/z-score/band methods
- **34 priority reference profiles** — conservative placeholder bands for key assessments (BMI, sprints, CMJ, Yo-Yo, FMS, ACWR, etc.)
- **Extended normative model** — six-level bands, population filters, source quality, z-score support, citation placeholders
- **Seed pipeline** — `normativeReferenceBuilder`, `priorityNormativeSpecs`, validated at load
- **Repository methods** — `listNormativeReferences`, `getNormativeReferenceByKey`, `listReferencesForAssessment`, `listNormativeProfiles`
- **Missing reference policy** — returns `unknown` classification with recommendation to use raw value + longitudinal trend

### Design principles documented

- No overclaiming — placeholder source quality by default
- Raw / Derived / Interpretation separation
- Catalog First — references linked to assessment definition keys

### Unchanged (by design)

- No UI, dashboard, analytics, SSID, AI Coach, or report changes
- No assessment sessions, athlete migration, or Firestore writes
- Mock store + Performance Lab registry remain default runtime

---

## [Phase 6C.5 — Universal Assessment Session Engine] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Universal Assessment Session Engine** — sole future pathway for recording scientific assessments
- **Session model** — identity, multi-trial raw measurements, calculated metrics, normative comparison snapshot, protocol snapshot, interpretation placeholder
- **Engine API** — `createAssessmentSession`, `validateAssessmentSession`, `calculateDerivedMetrics`, `compareWithNormativeReference`, `buildSessionSnapshot`, `getAssessmentSummary`
- **Mock session repository** — read-only contract + append-only in-memory store
- **Session validators** — raw measurements, calculated metrics, metadata, required inputs, snapshot integrity
- **Registry integration** — `registry.sessions` + `createAssessmentSessionEngineFromRegistry()`

### Design principles documented

- Scientific Inside, Simple Outside
- Catalog First — no session without Assessment Definition
- Raw → Derived → Interpretation separation
- Append-only scientific events
- Missing normative reference returns `classification: unknown`

### Unchanged (by design)

- No UI, dashboard, analytics, SSID, AI Coach, reports, passport, or timeline
- No Firestore session writes or security rules deployment
- Mock store + Performance Lab registry remain default runtime

---

## [Phase 6C.6 — Scientific Calculation Engine] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Scientific Calculation Engine** — sole platform calculation layer (`ScientificCalculationEngine`)
- **14 versioned formulas** — BMI, body fat %, lean body mass, muscle mass, body water %, VO₂max (field), HR zones, training load, ACWR, recovery score, readiness score, relative strength, sprint momentum, running speed
- **Formula registry** — `SCIENTIFIC_FORMULA_REGISTRY` with bilingual metadata, evidence tiers, validation rules, citation placeholders
- **Deterministic executors** — `FORMULA_EXECUTORS` keyed by `expression_key` (no duplicated equations)
- **Engine API** — `calculate`, `calculateBatch`, `validateInputs`, `validateUnits`, `resolveFormula`, `getFormulaByKey`, `listSupportedFormulas`
- **Calculation validators** — reject negative height/weight, invalid HR/body fat, division by zero, missing fields, unit mismatch
- **Catalog alignment** — `SEED_FORMULAS` expanded from 6 → 14 entries
- **Session integration** — `AssessmentSessionEngine.calculateDerivedMetrics()` delegates to calculation engine
- **Registry factory** — `createScientificCalculationEngineFromRegistry()`

### Design principles documented

- Scientific Inside, Simple Outside
- Catalog First — formulas versioned in registry + catalog seed
- Raw → Formula → Derived Metric
- Traceable outputs — formula version, input keys, timestamp, status, warnings

### Unchanged (by design)

- No UI, dashboard, analytics, SSID, AI Coach, reports, passport, or timeline
- No Firestore session writes or security rules deployment
- Mock store + Performance Lab registry remain default runtime

---

## [Phase 6C.6.1 — Scientific Calculation Audit & Validation] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Scientific Calculation Audit** — all 14 formulas verified for version, units, inputs, edge cases, and deterministic output
- **HR Zones v1.1.0** — five zones (Zone 1–5) via `%HRmax` or Karvonen (HRR); method stored in `structured_result.hr_zones`
- **Post-calculation validators** — reject impossible BMI, body fat >100%, invalid HR zones, lean mass > weight
- **Strengthened input validation** — negative values, impossible HR, unit mismatch, division by zero
- **Calculation metadata** — `formulaVersion`, `calculationTime`, `warnings`, `validationStatus` on every result (backward compatible)
- **Test suite** — 24 audit tests across 11 formula groups (`npm run test:scientific`)

### Design principles documented

- Correctness and consistency before SSID integration
- Backward-compatible API — existing snake_case fields preserved
- Traceable calculation metadata on every result

### Unchanged (by design)

- No UI, dashboard, analytics, SSID, AI Coach, reports, passport, or timeline
- No Firestore session writes or security rules deployment
- Mock store + Performance Lab registry remain default runtime

---

## [Phase 6C.7 — SSID Scientific Sports Intelligence Engine] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **SSID Interpretation Engine** — deterministic rule-based scientific interpretation layer (no AI text)
- **Five interpretation layers** — Classification, Scientific Meaning, Performance Meaning, Risk Analysis, Action Recommendation
- **36 SSID rules** — 7 normative band templates + 18 category rules + 11 metric-specific rules
- **130 definition coverage** — all catalog assessment definitions resolve to a rule via metric or category fallback
- **Bilingual output** — English + Arabic for all interpretation fields
- **Session integration** — `generateScientificInterpretation()` + optional SSID injection in session engine
- **Registry factories** — `createSsidInterpretationEngineFromRegistry()`, `createAssessmentSessionEngineFromRegistry({ includeSsid: true })`
- **Validation** — `validateScientificInterpretation`, `validateSessionInterpretationState`
- **Tests** — 4 SSID audit tests (`npm run test:ssid`)

### Design principles documented

- Scientific Inside, Simple Outside
- Pipeline: Session → Calculation → Normative → SSID → Standardized Interpretation
- Deterministic, traceable metadata (formulaVersion, referenceVersion, ruleVersion, confidence)

### Unchanged (by design)

- No UI, dashboard, analytics, feature SSID UI components, AI Coach, reports, passport, or timeline
- No Firestore session writes
- Mock store + Performance Lab registry remain default runtime

---

## [Phase 6D.3 — Athlete Workspace Role Context & Cloud Readiness] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **AthleteWorkspaceProvider** — unified context: athlete, org, role, permissions, data mode, passport, timeline, visibility profile
- **Workspace role presets** — coach, sports_scientist, team_doctor, physiotherapist, researcher, athlete, org_admin (dev via `EXPO_PUBLIC_DEV_WORKSPACE_ROLE`)
- **Role-aware filtering** — passport/timeline use `filterPassportForContext` and `filterTimelineForContext`
- **Cloud bridge** — `loadCloudSessionsForAthlete()` merges scientific sessions when cloud enabled
- **Shared artifact builder** — `buildWorkspaceArtifacts()` avoids duplicate mock reads
- **Dev diagnostics** — `WorkspaceVisibilityDiagnostics` (`__DEV__` only)
- **Unit tests** — 4 workspace context tests (15 total with prior phases)

### Unchanged (by design)

- No UI redesign, Dashboard, Performance Lab, Reports, AI, or Firestore persistence changes
- Mock mode remains default

---

## [Phase 6D.2 — Scientific Timeline] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Scientific Timeline domain model** — 13 event types with source references, evidence tier, severity, visibility, key metrics
- **Timeline builder** — `buildAthleteScientificTimeline()` from assessments, injuries, wellness, training, nutrition, wearables, reports, passport
- **Role-based filtering** — `timelineAccess.ts` for coach, clinical, and research views
- **Mock bridge** — `buildMockAthleteScientificTimeline()` + `useScientificTimeline()` hook
- **Workspace UI** — `WorkspaceScientificTimeline` with category filters, severity badges, expandable compact cards
- **Unit tests** — 7 tests for builder and access filtering
- **i18n** — `scientificTimeline.*` keys (EN/AR)

### Unchanged (by design)

- No Dashboard, Performance Lab, Timeline Firestore persistence, AI, Reports, or security rules changes
- Mock mode remains default runtime

---

## [Phase 6D.1 — Athlete Digital Passport] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Passport domain model** — 18 summary sections with source references, confidence, visibility, and missing-data state
- **Passport builder** — `buildAthletePassport()` from profile, assessments, analytics, wellness, training, nutrition, wearables
- **Role-based visibility** — `passportAccess.ts` filters coach, clinical, research, and athlete views
- **Mock bridge** — `buildMockAthletePassport()` + `useAthletePassport()` hook
- **Workspace UI** — `WorkspacePassportOverview` in Athlete Intelligence Workspace overview (badges, SSID insights, collapsible details)
- **Unit tests** — 7 tests for builder and access filtering
- **i18n** — `athletePassport.*` keys (EN/AR)

### Unchanged (by design)

- No Dashboard, Performance Lab pipeline, Timeline, AI, Reports, or Firestore rules changes
- No passport cloud persistence, transfer, or research export
- Mock mode remains default runtime

---

## [Phase 6C.11 — Custom Claims & Membership Permissions] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Effective permissions resolver** — unions custom claims, membership `role_ids`, direct `permissions`, and access flags
- **OrgMember extensions** — `permissions[]`, `clinical_access`, `research_access`, `export_research`
- **Custom claims helpers** — build, validate, and map role IDs to permissions (no Cloud Functions yet)
- **Firestore rules** — `hasPermission(orgId, permission)` resolves membership document permissions
- **Rules tests** — 9 new membership permission tests (45 total)

### Unchanged (by design)

- No UI, Cloud Functions deployment, or data migration
- Mock mode unchanged; rules not deployed to production

---

## [Phase 6C.10.1 — Firebase Rules Emulator & Security Tests] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Firebase config** — `firebase.json`, `.firebaserc.example` (placeholder project id only)
- **Root package** — Yarn workspace for rules tests (`@firebase/rules-unit-testing`, `firebase-tools`)
- **Rules test suite** — 36 tests in 9 suites under `tests/firestore-rules/`
- **Scripts** — `yarn test:rules`, `yarn emulators:start` (requires Java 11+)
- **Documentation** — rules test coverage and run instructions in `docs/SECURITY_MODEL.md`

### Validation

- Frontend TypeScript: pass
- Rules tests: 36 tests authored; emulator execution requires Java runtime (not available in initial validation environment)

### Unchanged (by design)

- No UI, engine, migration, or Cloud Functions changes
- Mock mode unchanged; rules not deployed to production

---

## [Phase 6C.10 — Scientific Security & RBAC] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Firestore rules** — `firestore.rules` with multi-tenant isolation, RBAC, clinical, and research policies
- **Permission model** — 13 permission keys (`read_athletes`, `write_assessments`, `read_medical`, etc.)
- **System roles** — 10 roles: org_admin, head_coach, coach, sports_scientist, physiotherapist, team_doctor, researcher, analyst, viewer, athlete_portal
- **Security helpers** — `accessControl`, `clinicalAccess`, `researchAccess` mirroring rules logic
- **Custom claims types** — `SportMindCustomClaims` design (not provisioned)
- **Audit policy** — 7 audit event types with severity mapping
- **Documentation** — `docs/SECURITY_MODEL.md`
- **Tests** — `npm run test:security` (7 access control tests)

### Unchanged (by design)

- No UI, dashboard, Performance Lab, passport, timeline, reports, or AI changes
- Mock mode fully functional; rules not deployed
- No Cloud Functions or custom claims provisioning

---

## [Phase 6C.9.3 — Custom Assessments Bridge] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Custom assessment bridge** — `customAssessmentBridge` creates org-scoped `CatalogAssessmentDefinition` + protocol versions
- **Mock registry** — `customAssessmentRegistry` with hydrate/persist via mock store `customAssessmentBundles`
- **Catalog overlay** — `createCustomAwareDefinitionRepository` merges custom definitions into seed catalog reads
- **Scientific entry** — custom tests with complete definitions use scientific pipeline on test entry save/preview
- **Progressive disclosure** — Basic / Advanced / Research sections on custom create screen
- **Evidence policy** — defaults to `screening`; clinical/research require validity + reliability metadata
- **Validation** — name, unit, metric, category, source type, duplicate keys
- **Legacy fallback** — pre-bridge customs marked `scientificStatus: legacy_custom`

### Unchanged (by design)

- No UI redesign, navigation, dashboard, passport, timeline, reports, or AI changes
- Mock mode fully functional when cloud disabled

---

## [Phase 6C.9.2 — Performance Lab Read Screen Bridge] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Dashboard bridge** — scientific session statistics via merged history + catalog protocol count
- **Library bridge** — `useScientificTestLibrary` loads from Assessment Definition Engine with lazy cache
- **Category bridge** — `useScientificCategoryAssessments` dynamic catalog per category
- **Benchmark bridge** — `usePerformanceLabBenchmark` uses merged sessions with SSID-based ratings
- **Compare bridge** — `usePerformanceLabCompare` reads merged scientific sessions
- **Catalog mapper** — `catalogDefinitionMapper` maps scientific definitions to TestDefinition
- **Extended filters** — evidence tier and usability mode filters/badges (existing UI patterns)

### Unchanged (by design)

- No UI redesign, navigation, colors, or layout changes
- Legacy registry and mock store remain as fallback
- Mock mode fully functional when cloud disabled

---

## [Phase 6C.9.1 — Performance Lab Read Path Bridge] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Read path bridge** — `performanceLabReadBridge.ts` loads scientific sessions with legacy fallback
- **Result view model** — `PerformanceLabResultViewModel` maps scientific sessions to existing UI shape
- **Result hook** — `usePerformanceLabResult` for `result/[id].tsx` (scientific first, mock fallback)
- **History hook** — `usePerformanceLabHistory` merges scientific + mock with deduplication
- **Session ID alignment** — save path uses `session_id` as result id for consistent reads
- **Friendly read states** — loading indicator and i18n read-failure messages

### Unchanged (by design)

- No UI redesign, navigation, or layout changes
- Legacy mock results remain accessible
- Mock mode fully functional

---

## [Phase 6C.9 — Performance Lab Bridge] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Performance Lab Bridge** — adapter layer connecting legacy UI to Scientific Core (`performance-lab/bridge/`)
- **Scientific pipeline on save** — Assessment Definition → Calculation → Normative → SSID → Session → Persistence Gateway
- **Async scientific preview** — `useScientificTestPreview` hook with legacy SSID fallback
- **Dual persistence** — scientific session via gateway + mock store for analytics/history continuity
- **Friendly error handling** — i18n bridge messages; no Firebase IDs or stack traces exposed
- **Lazy catalog cache** — `scientificCatalogCache` avoids repeated definition lookups
- **Registry factories** — `createAssessmentDefinitionEngineFromRegistry`, `createNormativeReferenceEngineFromRegistry`

### Unchanged (by design)

- No UI redesign, navigation, dashboard, or tab layout changes
- Legacy TEST_REGISTRY, mock store, and SSID view components preserved
- Mock mode fully functional when cloud disabled

---

## [Phase 6C.8.1 — Atomic Scientific Persistence] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Atomic persistence operation** — `persist_session_bundle` writes all 6 entity types as one logical operation
- **ScientificAtomicPersistenceRepository** — mock + Firestore adapters with identical contract
- **Firestore transaction** — `runTransaction` with read-before-write duplicate guard across session + subcollections
- **Mock atomic commit/rollback** — staging store, failure hooks, partial-write simulation
- **Transaction audit** — `pending`, `writing`, `completed`, `failed`, `rolled_back` statuses with full audit trail
- **Retry policy** — automatic retry for transient Firestore errors; immediate stop on validation errors
- **Structured persistence logger** — in-memory ring buffer, no console output
- **Persistence version bump** — `1.1.0` with transaction metadata embedded in audit records

### Unchanged (by design)

- No UI, dashboard, Performance Lab, navigation, passport, timeline, reports, or AI
- Mock mode fully functional when cloud disabled
- Individual read repositories unchanged

---

## [Phase 6C.8 — Scientific Persistence Layer] — 2026-07-07

**Branch:** `develop/cloud-foundation`

### Added

- **Scientific Persistence Gateway** — sole write path: Scientific Core → Repository → Adapter → Mock/Firestore
- **Four persistence repositories** — `AssessmentSessionRepository`, `ScientificCalculationRepository`, `NormativeSnapshotRepository`, `ScientificInterpretationRepository`
- **Mock + Firestore adapters** — identical APIs for all repositories; feature-gated by `canAccessScientificFirestore()`
- **Append-only semantics** — rejects duplicate sessions; immutable versioned scientific records
- **Six persistence entity types** — session metadata, raw measurements, calculated metrics, normative snapshot, SSID interpretation, audit metadata
- **Pre-write validation** — `validatePersistableAssessmentSession` rejects invalid records
- **Session engine integration** — persists via gateway when injected from registry
- **Security policy metadata** — assessment session + subcollection paths documented

### Design principles documented

- Repository layer as only persistence gateway
- Cloud disabled → mock; cloud enabled → Firestore
- No UI, navigation, or report changes

### Unchanged (by design)

- No UI, dashboard, Performance Lab, AI Coach, passport, or timeline
- Mock mode fully functional when cloud disabled
- Security rules deployment deferred to Phase 6C.10

---

## Upcoming

- **Phase 6C.9** — Organization write paths + Performance Lab bridge
- **Phase 6C.10** — Firestore security rules deployment
- **Phase 6D** — Firebase Storage
- **Phase 6E** — Cloud sync engine

See [ROADMAP.md](../ROADMAP.md) for details.

*Last updated: Phase 7.0*

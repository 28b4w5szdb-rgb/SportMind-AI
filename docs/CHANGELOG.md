# Changelog

All notable changes to SportMind AI are documented here.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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

## Upcoming

- **Phase 6C.2** — Assessment sessions entity + catalog seed
- **Phase 6C.3** — Firestore adapters + security rules
- **Phase 6D** — Firebase Storage
- **Phase 6E** — Cloud sync engine

See [ROADMAP.md](../ROADMAP.md) for details.

*Last updated: Phase 6C.1*

# SportMind AI — Product Roadmap

> High-level delivery plan from v0.9-alpha to v1.0.  
> Phases are sequential unless noted. Mock/offline mode remains available until cloud phases complete.

---

## ✅ Completed Phases

### Foundation & Core Product (Phase 3)

| Phase | Deliverable |
|-------|-------------|
| **3A** | Performance Analytics Engine |
| **3B** | Analytics integration (Dashboard, AI Coach, Lab, Reports) |
| **3C.1–3C.2** | Sports Science Testing Center + Test Library |
| **3D–3D.1** | Athlete Intelligence Workspace + body map |
| **3E** | Daily Check-In + Recovery Center |
| **3F** | Sports Medicine & Injury Prevention |
| **3G–3G.1** | Smart Training Builder + execution/compliance |
| **3H–3H.1** | Nutrition Intelligence + body composition |
| **3I** | Team Intelligence |
| **3J–3J.1–3J.2** | SSID interpretation engine + Arabic localization |
| **3K–3K.1** | Testing Center audit + demographic reference groups |

### Integrations & Polish (Phase 4–5)

| Phase | Deliverable |
|-------|-------------|
| **4A–4A.1** | Wearables architecture + premium device center |
| **5A–5A.1** | Design system tokens + screen migration |
| **5B** | Dashboard command center |
| **5C** | AI Coach consultant redesign |
| **5D** | Athlete Workspace command center |
| **5E.1** | Performance Lab premium laboratory |
| **5E.2–5E.2.1** | Scientific Report Builder + persistence |
| **5F–5F.1** | Production polish + localization |
| **5G** | Brand identity, splash, onboarding, app icon |

### Cloud Foundation (Phase 6)

| Phase | Deliverable | Status |
|-------|-------------|--------|
| **6A** | Firebase config layer, typed models, repository interfaces, feature flag, readiness UI | ✅ Complete |
| **6B** | Firebase Authentication + session persistence + user profiles | ✅ Complete |
| **6C.1** | Scientific Firestore core foundation (catalog + org types, contracts) | ✅ Complete |

---

## 🔜 Upcoming Phases

### Phase 6B — Authentication

**Goal:** Replace mock/Supabase auth with Firebase Authentication.

- Implement `AuthRepository` (Firebase adapter)
- Sign-in, sign-up, password reset, email verification
- Session persistence and auth gate integration
- User profile bootstrap in Firestore (`UserProfile`)
- Maintain `DEV_BYPASS_AUTH` and mock mode for development
- Parallel Supabase deprecation plan

**Exit criteria:** Users can authenticate via Firebase; app routes correctly; mock bypass still works.

**Status:** ✅ Complete (6B + 6B.1)

---

### Phase 6C — Firestore Scientific Platform

**Goal:** Implement approved scientific data model (6C.0.1–6C.0.3) incrementally without breaking mock mode.

| Sub-phase | Deliverable | Status |
|-----------|-------------|--------|
| **6C.0.1** | Scientific assessments audit | ✅ Design approved |
| **6C.0.2** | Scientific data model & Firestore schema design | ✅ Design approved |
| **6C.0.3** | Elite platform extensions (equipment, environment, passport, timeline) | ✅ Design approved |
| **6C.1** | Scientific Firestore core foundation — types, paths, validation, repository contracts | ✅ Complete |
| **6C.2** | Catalog seed data + read-only Firestore/mock repository adapters | ✅ Complete |
| **6C.3** | Assessment Definition Engine — 130 definitions, search API, validation | ✅ Complete |
| **6C.4** | Normative Reference Engine — 34 profiles, classification API, validation | ✅ Complete |
| **6C.5** | Universal Assessment Session Engine — Raw → Derived → Interpretation pipeline | ✅ Complete |
| **6C.6** | Scientific Calculation Engine — 14 versioned formulas, sole calculation layer | ✅ Complete |
| **6C.6.1** | Scientific Calculation Audit — validation hardening, HR zones v1.1, test suite | ✅ Complete |
| **6C.7** | SSID Scientific Sports Intelligence Engine — rule-based bilingual interpretation | ✅ Complete |
| **6C.8** | Scientific Persistence Layer — repository-backed mock/Firestore gateway | ✅ Complete |
| **6C.8.1** | Atomic Scientific Persistence — transactional bundle writes, audit, retry | ✅ Complete |
| **6C.9** | Performance Lab Bridge — Scientific Core integration via adapter layer | ✅ Complete |
| **6C.9.1** | Performance Lab Read Path Bridge — result/history scientific read + dedup | ✅ Complete |
| **6C.9.2** | Performance Lab Read Screen Bridge — dashboard, library, category, benchmark, compare | ✅ Complete |
| **6C.9.3** | Custom Assessments Bridge — org-scoped custom definitions + scientific entry | ✅ Complete |
| **6C.10** | Scientific Security & RBAC — Firestore rules, multi-tenant isolation, permission model | ✅ Complete |
| **6C.10.1** | Firebase Rules Emulator & Security Tests — 36 rules tests | ✅ Complete |
| **6C.11** | Custom claims provisioning + Firestore rules deployment | 🔜 Next |

**6C.10.1 exit criteria (met):** Firebase emulator config, 36 Firestore rules tests covering isolation/RBAC/clinical/research/catalog/reports/audit, `yarn test:rules` script, documentation — no UI or engine changes.

**6C.10 exit criteria (met):** Production-ready `firestore.rules`, RBAC permission model, clinical/research access helpers, custom claims types, audit policy, `docs/SECURITY_MODEL.md` — no UI changes, mock mode unchanged, rules not deployed.

**6C.9.3 exit criteria (met):** Custom create bridged to Assessment Definition model, scientific entry pipeline with legacy fallback, progressive disclosure UI, mock registry persistence, validation + evidence policy — no UI redesign beyond disclosure sections.

**6C.9.2 exit criteria (met):** Dashboard, library, category, benchmark, and compare screens bridged to Scientific Core with catalog cache, legacy fallback, and friendly read errors — no UI redesign.

**6C.9.1 exit criteria (met):** Result and history read bridges, view model mappers, deduplicated history merge, session id alignment on save, friendly read errors — no UI redesign.

**6C.9 exit criteria (met):** Performance Lab bridge adapter, scientific pipeline on test entry save/preview, mock store dual-write, friendly error handling, legacy fallback — no UI/navigation redesign.

**6C.8.1 exit criteria (met):** Atomic session bundle persistence, Firestore transaction + mock rollback, transaction audit metadata, transient retry policy, pre-transaction validation, structured logging — no UI/AI/report changes.

**6C.8 exit criteria (met):** Four persistence repositories, mock + Firestore adapters, append-only gateway, validation before write, session engine integration — no UI/AI/report changes.

**6C.7 exit criteria (met):** SSID engine with five interpretation layers, 36 rules covering 130 definitions, bilingual output, session pipeline integration — no UI/Firestore/AI changes.

**6C.6.1 exit criteria (met):** All 14 formulas audited, HR zones Zone 1–5 (%HRmax + Karvonen), strengthened validation, calculation metadata, 24 passing tests — no UI/SSID/Firestore changes.

**6C.6 exit criteria (met):** Formula registry (14 formulas), `ScientificCalculationEngine` API, input/unit validation, deterministic executors, session engine integration — no UI/Firestore writes/SSID/AI.

**6C.5 exit criteria (met):** Session model + engine API, definition-gated creation, normative comparison snapshot, mock read-only repository, append-only memory store — no UI/Firestore writes/SSID/AI.

**6C overall exit criteria:** Assessment sessions operational in cloud, scientific catalog seeded in Firestore, org-scoped reads/writes when cloud mode enabled.

---

### Phase 6D — Storage

**Goal:** Firebase Storage for files and exports.

- Implement `StorageRepository`
- Report PDF/image export upload
- Avatar and organization logo storage
- Signed URL handling and size limits

**Exit criteria:** Report export and profile avatars persist to Storage in cloud mode.

---

### Phase 6E — Cloud Sync

**Goal:** Offline-first sync between mock store and Firestore.

- Implement `syncEngine` push/pull
- Conflict resolution strategy (last-write-wins → operational transform later)
- Pending changes queue in AsyncStorage
- Sync status UI and error recovery
- Background sync hooks (where platform allows)

**Exit criteria:** Edits offline sync when connectivity returns; data mode indicator reflects sync state.

---

### Phase 7 — Real AI

**Goal:** Connect AI Coach to production LLM with guardrails.

- OpenAI (or alternative) backend integration
- Structured response pipeline (existing SSID/analytics context)
- Rate limiting, cost controls, PII redaction
- Reference library and citation placeholders → real sources
- No change to SSID analytics engine logic

**Exit criteria:** AI Coach returns live responses in production mode; mock mode remains for dev.

---

### Phase 8 — Real Wearables

**Goal:** Device integrations beyond mock sync.

- Apple Health / Health Connect / Garmin SDK evaluation
- OAuth and token storage (SecureStore)
- Live metric ingestion → `WearableRecord` cloud model
- Provider adapter implementations

**Exit criteria:** At least one real provider syncs data into athlete profiles.

---

### Phase 9 — Beta Testing

**Goal:** External pilot with real teams.

- TestFlight / Play Internal Testing distribution
- Crash reporting and analytics (privacy-compliant)
- Beta feedback loop and bug triage
- Performance profiling on mid-range devices
- Security review and penetration test checklist

**Exit criteria:** 2+ pilot teams using cloud mode daily for 4+ weeks.

---

### Phase 10 — v1.0 Release

**Goal:** Public launch.

- Final naming pass (see 5F.1 naming audit)
- App Store / Play Store submission
- Marketing site and documentation
- SLA, support, and onboarding for paying customers
- Remove dev bypass flags from production builds

**Exit criteria:** v1.0 tagged; cloud + auth + core modules production-stable.

---

## Version Milestones

| Version | Tag | Description |
|---------|-----|-------------|
| v0.9-alpha | `v0.9-alpha` | Feature-complete mock product; brand + localization freeze |
| v0.9-beta | TBD | Firebase auth + partial Firestore |
| v1.0-rc | TBD | Beta-tested release candidate |
| v1.0 | TBD | Public launch |

---

## Principles (all phases)

- **Mock mode never breaks.** `USE_CLOUD_DATA=false` must always yield a working app.
- **No secrets in git.** Environment variables only.
- **Incremental migration.** One module per PR where possible.
- **SSID and analytics logic unchanged** unless explicitly scoped.
- **EN + AR** maintained for all user-facing strings.

*Last updated: Phase 6C.5*

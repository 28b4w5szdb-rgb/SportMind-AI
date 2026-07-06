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

---

### Phase 6C — Firestore Data Migration

**Goal:** Wire cloud repositories for core entities.

- Implement Firestore adapters: `Athlete`, `Team`, `Test`, `Report`
- Organization-scoped collections and security rules (design)
- Repository factory: mock vs cloud based on `USE_CLOUD_DATA`
- Migrate high-traffic screens one module at a time (athletes → teams → tests → reports)
- Seed/sync strategy for demo organizations

**Exit criteria:** At least athletes + tests readable/writable from Firestore when cloud mode enabled.

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

*Last updated: Pre Phase 6B documentation pass*

# SportMind AI — Project State

> Living snapshot for project management. Update at phase boundaries.

| Field | Value |
|-------|-------|
| **Current version** | v0.9-alpha |
| **Current branch** | `develop/cloud-foundation` |
| **Stable tag** | `v0.9-alpha` |
| **Current phase** | Phase 6A — Cloud Foundation (complete) |
| **Next phase** | Phase 6B — Authentication |

---

## Completed Phases Summary

| Phase | Focus | Status |
|-------|-------|--------|
| **3A–3K** | Core product modules: analytics, testing center, athlete workspace, check-in, recovery, sports medicine, training builder, nutrition, team intelligence, SSID engine, wearables | ✅ Complete |
| **4A** | Wearables integration architecture (mock sync) | ✅ Complete |
| **5A** | Global design system tokens and shared UI primitives | ✅ Complete |
| **5A.1** | High-traffic screen migration to design system | ✅ Complete |
| **5B** | Dashboard as Sports Science Command Center | ✅ Complete |
| **5C** | AI Coach premium consultant redesign | ✅ Complete |
| **5D** | Athlete Workspace command center | ✅ Complete |
| **5E.1** | Performance Lab premium laboratory | ✅ Complete |
| **5E.2** | Scientific Report Builder (wizard, themes, export) | ✅ Complete |
| **5E.2.1** | Report builder persistence and detail preview | ✅ Complete |
| **5F** | Production polish (RTL, empty/error states, accessibility) | ✅ Complete |
| **5F.1** | Final localization and naming cleanup | ✅ Complete |
| **5G** | Brand identity, splash, onboarding, auth shell, app icon | ✅ Complete |
| **6A** | Firebase cloud foundation (config, models, repositories, feature flag) | ✅ Complete |

---

## Active Architecture Summary

### Frontend (Expo / React Native)

- **Router:** Expo Router with tab navigation, auth gate, onboarding flow
- **State:** Zustand mock store with AsyncStorage persistence (`frontend/src/data/mock/`)
- **i18n:** English + Arabic with RTL via `DirectionProvider`
- **Design system:** Theme tokens, shared components (`EmptyState`, `ErrorState`, `Skeleton`, etc.)
- **Analytics / SSID:** Local mock engines — not connected to cloud
- **AI Coach:** Mock responses — no OpenAI integration

### Data Mode (current runtime)

| Setting | Default | Effect |
|---------|---------|--------|
| `EXPO_PUBLIC_USE_CLOUD_DATA` | `false` | App uses **mock store** for all screens |
| `EXPO_PUBLIC_DEV_BYPASS_AUTH` | `true` (dev) | Skips auth gate in development |

### Cloud Foundation (Phase 6A — not wired to screens)

```
frontend/src/cloud/
├── firebase/     # Lazy-init app, auth, firestore, storage, messaging placeholder
├── auth/         # AuthRepository interface
├── firestore/    # Typed models + repository interfaces
├── storage/      # StorageRepository placeholder
└── sync/         # Sync engine placeholder + cloud readiness diagnostics
```

- Firebase SDK installed; initializes only when env keys are present
- Repository interfaces defined: `Auth`, `Athlete`, `Team`, `Test`, `Report`
- Cloud models: `UserProfile`, `Organization`, `Team`, `Athlete`, `TestResult`, `TrainingPlan`, `InjuryRecord`, `NutritionLog`, `Report`, `WearableRecord`
- Settings → **Cloud & Data** → Firebase Readiness screen shows config status

### Legacy / Parallel

- **Supabase:** Auth service still present (`frontend/src/services/supabase/`) — migration to Firebase planned in Phase 6B
- **Backend:** FastAPI stub exists; not required for v0.9 alpha

---

## Key Commits (recent)

| Commit | Phase | Description |
|--------|-------|-------------|
| `202de29` | 6A | Firebase cloud foundation architecture |
| `1e78879` | 5G | Brand identity and first-run experience |
| `de5cda3` | 5F.1 | Localization and naming cleanup |
| `9492ccb` | 5F | Production polish for v0.9 Alpha |
| `d734303` | 5E.2.1 | Report builder persistence |
| `458a094` | 5E.2 | Scientific Report Builder |

---

## Next Planned Phase: 6B Authentication

- Implement Firebase Auth repository
- Wire sign-in / sign-up / session restore
- Migrate off Supabase auth (or run parallel during transition)
- Keep mock mode available via feature flags

See [ROADMAP.md](./ROADMAP.md) for full plan.

---

## Important Notes

1. **Mock data is active by default.** All screens read from the local Zustand mock store unless `EXPO_PUBLIC_USE_CLOUD_DATA=true` **and** Firebase is fully configured.

2. **Firebase foundation exists but is not wired to runtime screens.** No Firestore reads/writes occur in production UI paths yet.

3. **`USE_CLOUD_DATA=false` by default.** Safe for v0.9-alpha testing and demos without a Firebase project.

4. **Do not commit real secrets.** Use `frontend/.env.example` as template. Copy to `.env` locally. Never commit `.env`, API keys, or service account files.

5. **Stable baseline:** Tag `v0.9-alpha` on `main` marks the pre-Firebase-wiring product freeze. Cloud work continues on `develop/cloud-foundation`.

---

## Documentation Index

| Document | Location |
|----------|----------|
| Roadmap | [ROADMAP.md](./ROADMAP.md) |
| Changelog | [docs/CHANGELOG.md](./docs/CHANGELOG.md) |
| Brand guide | [frontend/docs/BRAND_GUIDE.md](./frontend/docs/BRAND_GUIDE.md) |
| Engineering docs | [frontend/ENG_INDEX.md](./frontend/ENG_INDEX.md) |
| Architecture | [frontend/ARCHITECTURE_OVERVIEW.md](./frontend/ARCHITECTURE_OVERVIEW.md) |

*Last updated: Phase 6A complete — pre Phase 6B documentation pass*

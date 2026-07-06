# SportMind AI — Project State

> Living snapshot for project management. Update at phase boundaries.

| Field | Value |
|-------|-------|
| **Current version** | v0.9-alpha |
| **Current branch** | `develop/cloud-foundation` |
| **Stable tag** | `v0.9-alpha` on `main` |
| **Current phase** | Phase 6C.3 — Assessment Definition Engine (complete) |
| **Next phase** | Phase 6C.4 — Assessment Sessions + Security Rules |

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
├── scientific/     # Phase 6C.1–6C.3 — catalog seed, definition engine, adapters
├── storage/        # Placeholder
└── sync/           # Readiness diagnostics + sync placeholder
```

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

**Not implemented (by design):** assessment sessions, passport, timeline, equipment business logic, environmental records, migrations, Firestore writes, security rules deployment.

### Authentication (Phase 6B / 6B.1)

- Firebase Auth when `USE_CLOUD_DATA=true` + Firebase configured
- Native/web session persistence (AsyncStorage / browser)
- Firestore `users/{uid}` profile on sign-up (cloud mode)
- Supabase + dev bypass preserved

---

## Key Commits (recent)

| Commit | Phase | Description |
|--------|-------|-------------|
| *(pending)* | 6C.3 | Assessment Definition Engine — 130 definitions |
| `326b629` | 6C.2 | Catalog seed + read-only Firestore/mock adapters |
| `e81b8c2` | 6C.1 | Scientific Firestore core foundation |
| `8ee0f4b` | UX | Calculator Hub entry from More screen |
| `f9d693e` | 6B.1 | Auth persistence + user profiles |
| `6973515` | 6B | Firebase Auth production layer |
| `202de29` | 6A | Cloud foundation architecture |

---

## Next Planned Phase: 6C.4

- Assessment session entity models
- Firestore write paths (sessions + org)
- Security rules deployment from `scientific/security/collectionPolicy.ts`
- Optional catalog upload tooling + Performance Lab bridge

See [ROADMAP.md](./ROADMAP.md).

---

## Important Notes

1. **Mock data is active by default.** No Firestore scientific writes occur in UI paths.
2. **Scientific catalog reads use seed data in mock mode.** Firestore adapters fall back to seed when collections are empty.
3. **`USE_CLOUD_DATA=false` by default.** Safe for v0.9-alpha demos.
4. **Do not commit secrets.** Use `frontend/.env.example`.
5. **SSID, analytics, AI Coach, dashboard unchanged** through Phase 6C.3.

---

## Documentation Index

| Document | Location |
|----------|----------|
| Roadmap | [ROADMAP.md](./ROADMAP.md) |
| Changelog | [docs/CHANGELOG.md](./docs/CHANGELOG.md) |
| Brand guide | [frontend/BRAND_GUIDE.md](./frontend/BRAND_GUIDE.md) |
| Env template | [frontend/.env.example](./frontend/.env.example) |

*Last updated: Phase 6C.3*

# SportMind AI — Security Model (Phase 6C.10)

> Multi-tenant isolation, RBAC, clinical protection, and research de-identification for the scientific data model.

---

## Principles

| Principle | Implementation |
|-----------|----------------|
| **Scientific Inside, Simple Outside** | Rich permission model; UI unchanged in this phase |
| **Privacy by Design** | Tenant isolation at every org-scoped path |
| **Least Privilege** | Role bundles grant minimum permissions |
| **Multi-Tenant Isolation** | All org data keyed by `orgId`; no cross-org reads |
| **Clinical Data Protection** | Diagnosis-level data in `medical_records` only |
| **Research De-Identification** | PII stripped; `pseudonym_id` required |
| **Backward Compatibility** | Mock mode unchanged; rules not deployed yet |

---

## Firestore Collections

### Global

| Path | Read | Write | Notes |
|------|------|-------|-------|
| `users/{uid}` | Self only | Self only | Firebase Auth profile |
| `catalog_*` | Authenticated | Denied | Seed catalog — admin tooling only |

### Organization-scoped (`organizations/{orgId}`)

| Path | Permission(s) | Notes |
|------|---------------|-------|
| `/` (org root) | `manage_org` write | Tenant anchor |
| `/users/{userId}` | member read; `manage_users` write | Org membership + roles |
| `/teams/{teamId}` | `read_athletes` / `write_athletes` | Team scope |
| `/athletes/{athleteId}` | `read_athletes` / `write_athletes` | Coaches see `availability_status` only |
| `/assessment_sessions/{sessionId}` | `read_assessments` / `write_assessments` | Append-only |
| `/assessment_sessions/.../raw_measurements` | assessment permissions | Immutable |
| `/assessment_sessions/.../calculated_metrics` | assessment permissions | Immutable |
| `/assessment_sessions/.../normative_snapshot` | assessment permissions | Canonical name¹ |
| `/assessment_sessions/.../interpretations` | assessment permissions | SSID / scientific interpretations¹ |
| `/medical_records/{recordId}` | `read_medical` / `write_medical` | Clinical roles only |
| `/equipment/{equipmentId}` | `manage_equipment` | Org equipment registry |
| `/locations/{locationId}` | `manage_org` | Facilities |
| `/reports/{reportId}` | `read_reports` / `write_reports` | Org reports |
| `/research_datasets/{datasetId}` | `read_research` / `export_research` | De-identified only |
| `/audit_logs/{eventId}` | `manage_org` read; member create | Append-only |

¹ Codebase canonical subcollection names. Alias names (`normative_snapshots`, `scientific_interpretations`) map to these paths in adapters.

### Legacy top-level (org field isolation)

| Path | Notes |
|------|-------|
| `reports/{id}` | `organization_id` must match active org |
| `injuries/{id}` | Clinical access; migrate to `medical_records` in future phase |

---

## Roles

| Role | Clinical | Limited medical status | Research default |
|------|----------|------------------------|------------------|
| `org_admin` | Full | — | Full |
| `head_coach` | — | ✅ | — |
| `coach` | — | ✅ | — |
| `sports_scientist` | — | — | De-identified |
| `physiotherapist` | Full | — | — |
| `team_doctor` | Full | — | — |
| `researcher` | — | — | De-identified + export |
| `analyst` | — | — | De-identified |
| `viewer` | — | — | — |
| `athlete_portal` | — | — | Self assessments only |

---

## Permissions

| Key | Description |
|-----|-------------|
| `read_athletes` | Read athlete profiles |
| `write_athletes` | Create/update athletes |
| `read_assessments` | Read sessions + scientific results |
| `write_assessments` | Create assessment sessions (append-only) |
| `read_medical` | Read full medical records |
| `write_medical` | Write medical records |
| `read_research` | Read de-identified research datasets |
| `export_research` | Create/export research datasets |
| `read_reports` | Read reports |
| `write_reports` | Create/update reports |
| `manage_users` | Invite/manage org members |
| `manage_org` | Org settings, audit log read |
| `manage_equipment` | Equipment registry |

TypeScript definitions: `frontend/src/cloud/scientific/security/permissions.ts`

---

## Custom Claims (Firebase Auth)

Prepared types — **not provisioned in this phase**.

```typescript
interface SportMindCustomClaims {
  organizationIds: string[];
  activeOrganizationId?: string;
  roleIds: string[];
  permissions: string[];
  isOrgAdmin?: boolean;
  teamIds?: string[];
  linkedAthleteId?: string;
  claimsVersion?: string;
}
```

Rules prefer claims; fallback to `organizations/{orgId}/users/{uid}` membership document.

---

## Clinical Data Protection

- **Full records:** `organizations/{orgId}/medical_records/{recordId}` — `team_doctor`, `physiotherapist`, `org_admin`
- **Coach view:** `availability_status` on athlete profile — `available` | `modified` | `unavailable`
- **Blocked fields for coaches:** diagnosis, clinical notes, treatment plans, imaging, lab results

Helpers: `clinicalAccess.ts`

---

## Research Data Access

- Default: de-identified datasets with `pseudonym_id`
- PII fields stripped: name, email, DOB, external IDs, etc.
- Export requires `export_research` permission
- Writes rejected unless `deidentified: true`

Helpers: `researchAccess.ts`

---

## Audit Policy

| Event | Severity |
|-------|----------|
| `user_login` | info |
| `data_export` | warning |
| `medical_record_access` | warning |
| `assessment_created` | info |
| `assessment_amended` | warning |
| `report_generated` | info |
| `permission_change` | critical |

No audit UI in this phase. Definitions: `auditPolicy.ts`

---

## TypeScript Helpers

| Module | Purpose |
|--------|---------|
| `accessControl.ts` | Permission + org membership checks |
| `clinicalAccess.ts` | Medical record access |
| `researchAccess.ts` | De-identification + export |
| `roles.ts` | System role bundles |
| `customClaims.ts` | JWT claim types |
| `auditPolicy.ts` | Audit event definitions |

All helpers mirror `firestore.rules` logic for client-side pre-checks. **Server/rules enforcement is authoritative.**

---

## Deployment Status

| Item | Status |
|------|--------|
| `firestore.rules` | ✅ Authored — not deployed to production |
| Rules emulator tests | ✅ `yarn test:rules` (Phase 6C.10.1) |
| Custom claims provisioning | 🔜 Cloud Functions (future) |
| Audit log writes | 🔜 Gateway integration (future) |
| Mock mode | ✅ Unchanged |

---

## Rules Test Suite (Phase 6C.10.1)

### Run tests

From repository root (requires Yarn + **Java 11+** for Firestore emulator):

```bash
yarn install
java -version   # must succeed
yarn test:rules
```

> **Note:** If running inside VS Code/Cursor, `yarn test:rules` unsets `VSCODE_CWD` automatically so `firebase-tools` resolves template paths correctly.

### Validation status (Phase 6C.10.1)

| Environment | Result | Reason |
|-------------|--------|--------|
| TypeScript (frontend) | ✅ Pass | Effective permissions resolver + claims helpers |
| Rules emulator tests | ⏸ Ready | Requires Java runtime — `java -version` failed in CI/dev sandbox without JRE |

Install Java (macOS): `brew install openjdk@17` then re-run `yarn test:rules`.

Optional — start Firestore emulator UI manually:

```bash
cp .firebaserc.example .firebaserc   # use placeholder project id only
yarn emulators:start
```

### Coverage (45 tests)

| Suite | Tests | Scenarios |
|-------|-------|-----------|
| Multi-tenant isolation | 4 | Cross-org read/write denied |
| User profile | 2 | Self read only |
| Organization membership | 4 | Claims + doc fallback + inactive denied |
| Assessment sessions | 6 | Create, append-only, raw measurements |
| Clinical data | 4 | Coach/viewer denied; physio/doctor allowed |
| Research data | 5 | De-identified read, PII denied, export permission |
| Catalogs | 3 | Auth read; unauth denied; write denied |
| Reports | 4 | Org-scoped + legacy cross-org denied |
| Audit logs | 4 | Append-only; update/delete denied |
| Membership permissions | 9 | role_ids, direct permissions, clinical/research flags |

### Phase 6C.11 — Custom Claims & Membership Permissions

| Source | Resolution |
|--------|------------|
| **Custom claims** | `permissions[]`, `roleIds[]`, `isOrgAdmin`, `organizationIds`, `activeOrganizationId` |
| **Membership doc** | `role_ids[]`, `permissions[]`, `clinical_access`, `research_access`, `export_research` |
| **Effective permissions** | Union of all sources via `resolveEffectivePermissions()` |
| **Firestore rules** | `membershipGrantsPermission(orgId, permission)` mirrors static role map + flags; `/users/{uid}` self-read avoids `get()` recursion |
| **Cloud Functions** | 🔜 `buildCustomClaimsPayload()` ready; not deployed |

### Remaining untested

- Team-scoped ABAC (`teamIds` claim enforcement)
- Custom claims + membership doc conflict edge cases
- All 12 catalog collection variants (only `catalog_sports` sampled)
- Session subcollections: `calculated_metrics`, `normative_snapshot`, `interpretations`
- Legacy `injuries/` top-level collection
- Equipment, locations, seasons write paths
- Unauthenticated org access attempts on every collection

---

## Related Documents

- [ENG_06_SECURITY.md](../frontend/ENG_06_SECURITY.md) — Engineering security standards
- [PROJECT_STATE.md](../PROJECT_STATE.md) — Phase tracking
- [ROADMAP.md](../ROADMAP.md) — Next phases

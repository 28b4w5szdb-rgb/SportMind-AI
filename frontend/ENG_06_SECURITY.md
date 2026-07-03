# 06 · Security Standards

> Security is a first-order concern. Every feature is designed with a threat model in mind.

---

## 6.1 Security Principles

1. **Defense in depth.** Multiple overlapping controls.
2. **Least privilege.** Every user, service, and process has the minimum access it needs.
3. **Secure defaults.** Off by default. Explicit opt-in.
4. **Fail closed.** Deny access when a check fails, not the reverse.
5. **Zero trust between services.** Every internal call authenticates.
6. **Data classification.** Every field carries a sensitivity label (public / internal / confidential / restricted).

---

## 6.2 Authentication

### Options (per PRD)
1. **Emergent-managed Google Auth** — preferred for organizations already on Google Workspace.
2. **JWT-based custom auth** with email/password + magic link fallback.

### Rules
- Passwords hashed with **bcrypt (cost ≥ 12)** or **argon2id**.
- Emails verified before first meaningful action.
- Rate-limit login: 5 attempts / 5 min / user, 20 / min / IP.
- After 10 failed attempts → 30-minute lockout + notification email.
- No security questions. No SMS 2FA (SIM-swap risk) — TOTP only for MFA.
- MFA is **required for admins**, optional for others.

### Session Management
- Access token JWT, 15 min TTL, RS256 signed with rotated keys.
- Refresh token opaque, 7 days TTL, single-use, stored in SecureStore.
- Refresh rotation on every use (detects replay).
- Global sign-out revokes all refresh tokens (server-side blocklist).

### Rule
**Never store passwords or tokens outside SecureStore.** Never in MMKV, AsyncStorage, or SQLite plaintext.

---

## 6.3 Authorization (RBAC + ABAC)

### Roles (from PRD)
- SuperAdmin (SportMind operator)
- OrgAdmin
- SportsScientist
- Coach
- Researcher
- Athlete
- Student
- Guest (view-only)

### Permission Model
- Permissions are strings: `athletes.read`, `athletes.write`, `tests.create`, `reports.export`, `research.query`, `billing.manage`.
- Roles are bundles of permissions.
- Custom roles supported at org level.
- ABAC dimensions layered on top: **team scope**, **cohort scope**, **consent scope**.

### Enforcement Points
- **Backend:** every route checks `require(permission)` decorator.
- **Frontend:** UI hides/disables via `<Guard permission="..." />` component.
- **Repository layer:** row-level filters injected based on user's scope.

### Rule
**Frontend gating is UX, not security.** Backend must independently enforce every rule.

---

## 6.4 Encryption

### In Transit
- TLS 1.2 minimum, TLS 1.3 preferred.
- HSTS with 1-year max-age.
- Certificate pinning enabled on release builds (`react-native-ssl-pinning`).
- Pinned certs rotated with a 60-day overlap window.

### At Rest
- **Backend DB:** MongoDB encryption-at-rest (managed).
- **Backend backups:** encrypted with KMS-managed key, off-site.
- **Client persistent DB (SQLite):** SQLCipher with a key stored in SecureStore.
- **Attachments:** encrypted before upload (client-side) for medical documents.

### Field-Level Encryption
For especially sensitive fields (medical history, injury notes):
- Encrypted at the application layer with per-org keys.
- Search on such fields uses tokenized/hashed indexes, not plaintext.

---

## 6.5 Secure Storage (Mobile)

| Data | Storage | Encryption |
|---|---|---|
| Access + refresh tokens | expo-secure-store | Yes (Keychain / Keystore) |
| User preferences | MMKV | No (non-sensitive) |
| Cached athlete records | SQLite + SQLCipher | Yes |
| Draft form data | MMKV with TTL | No |
| Attachments pre-upload | File system, encrypted | Yes |
| Cached AI conversation | SQLite (limited history) | Yes |

### Rules
- Wipe secure storage on sign-out and on device change detection.
- Wipe secure storage on biometric key invalidation.
- Never log storage contents.

---

## 6.6 API Protection

- Every endpoint authenticates (except `/health`, `/api/v1/auth/*`).
- Every endpoint authorizes.
- Every endpoint validates input.
- Every endpoint rate-limits (Chapter 04 §4.13).
- Every endpoint logs (with PII redacted).
- No endpoint returns stack traces to clients.

### CSRF
- Not applicable (bearer tokens, no cookies).

### SSRF
- Any URL user-input feature (webhook targets, integration URLs) validates against an allow-list and blocks private/loopback ranges.

### Injection
- MongoDB queries use typed drivers with parameterized filters — no string concatenation.
- No dynamic `eval`. No dynamic imports based on user input.

### File Upload
- Content-type validated by magic bytes, not header.
- Virus scan on upload complete.
- Store outside web root; serve via signed URLs.
- Limit sizes (Chapter 04 §4.15).

---

## 6.7 Rate Limiting & Abuse Prevention

- Per-user, per-IP, per-endpoint (Chapter 04).
- Higher-cost endpoints (LLM, exports) have their own budgets.
- Suspicious patterns (e.g., mass athlete export by non-admin) trigger a soft-block requiring MFA re-verify.

---

## 6.8 OWASP Mobile Top 10 Compliance

| Risk | Our Control |
|---|---|
| **M1 Improper Credential Usage** | SecureStore only; no hard-coded creds |
| **M2 Inadequate Supply Chain Security** | Dependency scanning, lockfiles, `yarn audit`, Renovate |
| **M3 Insecure Auth/AuthZ** | JWT + refresh rotation, RBAC on backend |
| **M4 Insufficient Input/Output Validation** | Zod client, Pydantic server, output escaping |
| **M5 Insecure Communication** | TLS 1.2+, cert pinning on release |
| **M6 Inadequate Privacy Controls** | Consent flows, data export/erase (GDPR), audit log |
| **M7 Insufficient Binary Protections** | Obfuscation on release, ProGuard/R8, no debug symbols shipped |
| **M8 Security Misconfiguration** | Secure defaults, no debug endpoints in release |
| **M9 Insecure Data Storage** | SecureStore + SQLCipher; never plaintext PII |
| **M10 Insufficient Cryptography** | Modern algorithms; keys stored in OS keystore |

---

## 6.9 Privacy & Compliance

- **GDPR:** right to access, rectify, erase, restrict, portability, object — all exposed via UI.
- **HIPAA-adjacent** (medical data): access audit log, encryption, minimum necessary access.
- **Ramadan / cultural**: no forced behavior tracking during religious hours if opted out.
- **Consent versioning**: every consent capture records document version + timestamp + IP + device.
- **Retention policies**: per-org configurable, defaults: athlete data 7 years post-departure; audit log 6 years.

---

## 6.10 Secrets & Configuration

- **Never** commit secrets to Git.
- Use environment variables loaded via `.env` (frontend and backend).
- Backend secrets stored in the deployment platform's secret manager.
- Rotate keys quarterly.
- Emergency rotation runbook maintained in `/app/runbooks/`.

### Rule
Protected env vars (never modified by agents):
- `MONGO_URL`
- `EXPO_PACKAGER_PROXY_URL`
- `EXPO_PACKAGER_HOSTNAME`
- `EXPO_BACKEND_URL`
- `EMERGENT_PUSH_KEY` (only edited by deployment pipeline)

---

## 6.11 Audit Logging

Every security-relevant event is written to an immutable audit log:
- Sign-in, sign-out, MFA setup/removal.
- Role/permission changes.
- Data export events.
- Data deletion events (soft & hard).
- AI decisions consumed as actions.
- Failed authorization attempts.

Audit records are append-only, tamper-evident (hash-chained), and retained per policy.

---

## 6.12 Incident Response

### Runbook
1. **Detect** — monitoring alerts, user reports, Sentry spikes.
2. **Triage** — severity (SEV-1 to SEV-4) assigned within 15 min.
3. **Contain** — rotate compromised credentials, revoke tokens, disable feature flags.
4. **Eradicate** — patch and deploy.
5. **Recover** — restore service; verify.
6. **Postmortem** — blameless, 5 business days, published internally.

### Communication
- Users notified within 72 h of a confirmed breach involving their data.
- Regulators notified per applicable law.

---

## 6.13 Threat Model Living Document

- STRIDE analysis maintained per feature area.
- Updated on major architectural changes.
- Reviewed quarterly.

---

_Continue to Chapter 07 — Testing._

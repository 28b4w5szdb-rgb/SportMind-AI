# 08 · CI/CD Pipeline

> How code goes from a developer's laptop to a user's device — safely, quickly, and reversibly.

---

## 8.1 Branching Strategy (Trunk-Based with Short-Lived Branches)

### Branches
- **`main`** — always shippable. Every commit is a release candidate.
- **`feature/xxx`** — short-lived (< 3 days ideally). Merges to `main` via PR.
- **`hotfix/xxx`** — emergency fix branched from `main`, merged back fast.
- **`release/vX.Y.Z`** — optional cut for staged app-store release.

### Rules
- **No long-lived branches.** > 5 days = automatic warning.
- **No direct commits to `main`.** PRs only.
- **Branch names:** `feature/{ticket}-{slug}`, e.g., `feature/SM-142-offline-athlete-sync`.
- **Rebase, don't merge, before opening PR.** Linear history.

---

## 8.2 Pull Request Rules

### PR Structure
- **Title:** conventional-commit style: `feat(athletes): add offline sync`.
- **Description:** filled from template (see 8.3).
- **Size:** ≤ 400 lines diff preferred. Reviewers may request split above 800.
- **Scope:** one concern per PR.

### Required Checks (CI green)
- Lint (ESLint, Ruff, Prettier, Black).
- Type-check (tsc, mypy).
- Unit + integration tests pass.
- Coverage floor met (Chapter 07 §7.2).
- Bundle size delta < +100 KB (or justified).
- SAST clean.
- Dependency scan clean.
- OpenAPI schema check (if backend changed).
- Visual regression review (if UI changed).

### Required Reviews
- At least **1 human review** with explicit approval.
- **2 reviews** for changes to `core/`, `services/auth`, `services/security`, or CI itself.
- Reviewer cannot be the author.

### Auto-checks
- Bots comment: bundle-size delta, coverage delta, Lighthouse delta.
- Preview build attached to every PR (Expo dev-client link).

### Merge Strategy
- **Squash and merge.** Keeps `main` history linear.
- Squash commit message follows conventional commits.
- Delete branch on merge.

---

## 8.3 PR Template

```md
### What
One-sentence description.

### Why
Problem statement or link to ticket.

### How
High-level approach; anything reviewers should scrutinize.

### Screenshots
(For UI changes: Light + Dark, LTR + RTL if applicable)

### Tests
- [ ] Unit tests added / updated
- [ ] Integration test added / updated
- [ ] E2E updated if journey changed
- [ ] Manual test steps in PR description

### Checklist
- [ ] Follows Coding Standards (Ch 01)
- [ ] Follows Architecture Rules (Ch 02)
- [ ] i18n keys added to en.json + ar.json
- [ ] RTL verified
- [ ] Dark mode verified
- [ ] Empty / Loading / Error / Success states shown
- [ ] A11y labels added
- [ ] Coverage floor maintained
- [ ] Changelog updated (user-facing)
- [ ] ADR filed (architectural change)
```

---

## 8.4 CI Pipeline

### Stages (parallel where safe)
1. **Setup** — checkout, cache node_modules & pip, hydrate secrets.
2. **Static checks** — lint, format, type-check.
3. **Unit + Integration tests** — frontend & backend in parallel.
4. **Coverage report** — uploaded; fails on regression.
5. **Build**
   - Backend: Docker image, tagged with SHA.
   - Frontend: Metro bundle + Expo preview build.
6. **Security** — SAST + dependency scan.
7. **Contract tests** — OpenAPI + client-side type generation up-to-date.
8. **Performance budget** — bundle size, cold-start micro-bench.
9. **Visual regression** — Chromatic if UI changed.
10. **Publish preview** — attach Expo link + backend preview URL to PR.

Budget: total pipeline ≤ 10 min from push to green.

---

## 8.5 Environments

| Env | Purpose | Auth | Data | Access |
|---|---|---|---|---|
| **dev (local)** | Developer laptop | Fake providers OK | Seeded fixtures | Any engineer |
| **preview (per-PR)** | Ephemeral | Test tenant | Seeded | Any reviewer |
| **staging** | Pre-prod QA | Real auth, staging tenants | Anonymized | Product + QA |
| **production** | Live | Real | Real (encrypted) | On-call + limited |

---

## 8.6 Deployment Pipeline

### Backend
1. Merge to `main` → build image → push to registry.
2. Deploy to **staging** automatically.
3. Run smoke tests + e2e Sacred Nine against staging.
4. On green → **manual promote** to production (single button in dashboard).
5. Rolling deploy with health checks. Auto-rollback on failure.
6. Traffic ramp: 10% → 50% → 100% over 15 min for major releases.

### Mobile Frontend
- **Over-the-air (OTA) updates** via Expo Updates for JS-only changes.
- **Native build** required for anything touching native modules or permissions.
- **App Store / Play Store** builds via **Emergent Publish** button (per platform guidelines). Never EAS CLI or self-hosted builds.
- Store submission cadence: minor releases weekly, patches on demand.

### Feature Flags
- Every user-facing change is behind a feature flag by default.
- Flags controlled via a config service (or LaunchDarkly-style).
- Flags cleaned up within 60 days of full rollout.

---

## 8.7 Release Strategy

### Cadence
- **Minor releases**: weekly (Thursdays).
- **Patch releases**: as needed.
- **Major releases**: quarterly, coordinated with product + marketing.

### Freeze
- **Wednesday afternoon** = merge freeze before Thursday minor release.
- Only critical fixes merge during freeze.

### Ramp
1. Internal alpha (SportMind team) → 24 h soak.
2. Beta (invited orgs) → 72 h soak.
3. Staged store rollout: 10% → 25% → 50% → 100% over 5 days.
4. Halt on crash-free rate < 99.5% or Sentry error spike > 2× baseline.

---

## 8.8 Semantic Versioning

Version format: **`MAJOR.MINOR.PATCH`** (SemVer).

- **MAJOR** — backward-incompatible API or data-model change.
- **MINOR** — new feature, backward compatible.
- **PATCH** — bug fix, no new features.

### Version Bumping Rules
- Automated via **Conventional Commits** (feat: minor, fix: patch, `BREAKING CHANGE:` footer: major).
- Version tags on `main` immutable.

---

## 8.9 Changelog & Release Notes

- **Changelog** (technical, all changes) auto-generated from conventional commits into `CHANGELOG.md`.
- **Release notes** (user-facing) hand-crafted per release in EN + AR.
- Published in Settings → About → What's New.

---

## 8.10 Rollback

### Instant Rollback
- Backend: previous image tag redeployed with one command.
- OTA JS bundle: revert to previous published bundle in Expo Updates.
- Native app: cannot rollback — must ship a fix (hence staged rollout).

### Rule
**Every release must be forward-safe with a clear rollback plan documented in the release ticket.**

---

## 8.11 On-Call & Alerting

- Rotating on-call schedule.
- Alerts triggered on:
  - Crash-free rate < 99.5%.
  - API p95 > 800 ms sustained > 5 min.
  - Auth error rate > 1% sustained > 5 min.
  - LLM proxy failure rate > 5%.
  - SIE calculation errors > 0 (any).
- Every alert has a runbook link.

---

## 8.12 Post-Deployment Verification

Automated verifications after every prod deploy:
1. Health endpoint 200.
2. Auth round-trip succeeds.
3. Sample dashboard API call returns expected shape.
4. Sample SIE calculation returns known-good.
5. LLM proxy first-token latency within budget.

Failure → auto-rollback + page on-call.

---

## 8.13 Postmortem Culture

- SEV-1/SEV-2 incidents get a blameless postmortem within 5 business days.
- Postmortems posted in `/app/postmortems/YYYY-MM-DD-title.md`.
- Action items tracked and reviewed monthly.

---

_Continue to Chapter 09 — Documentation._

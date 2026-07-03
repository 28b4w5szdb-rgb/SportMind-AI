# 10 · Quality Gates

> The measurable, enforceable criteria that decide whether a release ships.

---

## 10.1 Philosophy

Quality gates are **objective, automated, and blocking**. If a gate fails, the release doesn't ship — no exceptions, no overrides without a filed waiver signed by the eng lead and product owner.

Quality is not a phase. It is a set of always-on checks at three altitudes:

1. **PR gates** — what must pass to merge into `main`.
2. **Release-candidate gates** — what must pass for a build to be promoted to staging.
3. **Production gates** — what must pass for a build to reach real users.

---

## 10.2 PR Gates (Blocks Merge)

### Static
- [ ] ESLint / Ruff clean (zero warnings).
- [ ] Prettier / Black clean.
- [ ] tsc strict / mypy strict pass.
- [ ] No `any` added without written comment.
- [ ] No new `TODO` without owner + ticket.

### Tests
- [ ] Unit + integration suites pass.
- [ ] Coverage floor met per Chapter 07 §7.2.
- [ ] New code has at least one happy-path + one failure-path test.

### UX
- [ ] i18n keys present in en.json + ar.json.
- [ ] RTL screenshot attached for UI changes.
- [ ] Dark-mode screenshot attached for UI changes.
- [ ] All 4 states (empty/loading/error/success) present for new screens.
- [ ] A11y labels present on interactive elements.

### Security
- [ ] SAST clean.
- [ ] `yarn audit` / `pip-audit` clean (or documented waiver).
- [ ] No secrets in diff (Gitleaks scan).
- [ ] Input validation present at any new boundary.

### Performance
- [ ] Bundle delta ≤ +100 KB (or justified).
- [ ] No regression > 10% in benchmark suite.

### Review
- [ ] ≥ 1 human approval (≥ 2 for `core/` or auth).
- [ ] All review comments resolved or replied.
- [ ] ADR filed for architectural changes.

### Docs
- [ ] Changelog entry (if user-facing).
- [ ] Feature README updated if applicable.
- [ ] TSDoc / docstring on new exported symbols.

---

## 10.3 Release-Candidate Gates (Staging Promotion)

After `main` build lands on staging:

### Automated
- [ ] All 9 Sacred E2E journeys pass on iOS + Android.
- [ ] Visual regression baseline updated & reviewed.
- [ ] Performance benchmarks within budget on all reference devices.
- [ ] Backend contract tests green.
- [ ] Health check + smoke tests green.

### Manual
- [ ] Smoke test matrix (3 devices × 2 languages) completed.
- [ ] Exploratory testing session logged (≥ 30 min per major feature).
- [ ] Accessibility spot-check (VoiceOver + TalkBack) on new screens.

### Documentation
- [ ] Release notes drafted (EN + AR).
- [ ] Known-issues list attached.
- [ ] Runbooks updated for any new failure modes.

---

## 10.4 Production Gates (User Promotion)

### Post-Staging Soak (24 h minimum)
- [ ] Zero SEV-1 or SEV-2 incidents.
- [ ] Crash-free sessions ≥ 99.5%.
- [ ] API p95 latency within budget.
- [ ] Sentry error rate ≤ 1.2× previous release baseline.
- [ ] LLM proxy first-token latency within budget.

### Business
- [ ] Product owner sign-off recorded.
- [ ] Legal/compliance sign-off (if data model or consent changes).
- [ ] Support team briefed; canned responses updated.
- [ ] Rollback plan documented in release ticket.

### Ramp
- [ ] Feature flag configuration confirmed for staged rollout.
- [ ] Kill switches for LLM & payment integrations validated.

---

## 10.5 Ongoing Health Metrics (SLOs)

Once in production, SportMind AI must maintain:

### Availability
- **API uptime**: 99.9% monthly.
- **Mobile crash-free sessions**: ≥ 99.5% weekly.
- **AI Coach availability**: ≥ 99.0% weekly.

### Performance
- **API p50 latency**: ≤ 80 ms.
- **API p95 latency**: ≤ 400 ms.
- **App cold-start p95**: ≤ 2.5 s on mainstream devices.
- **AI first-token latency p95**: ≤ 2.5 s.

### Quality
- **User-reported bugs per 1000 sessions**: ≤ 3.
- **Support ticket resolution**: median ≤ 24 h business.

### Data Integrity
- **Sync success rate**: ≥ 99.9%.
- **Zero data loss incidents** per quarter.
- **Backup restore drills**: successful monthly.

### Security
- **Zero SEV-1 security incidents** per quarter.
- **Dependency vulnerabilities** patched within SLA:
  - Critical: 48 h.
  - High: 7 d.
  - Medium: 30 d.
- **Audit log integrity**: 100% (hash chain unbroken).

### Scientific Correctness
- **Zero unreported SIE calculation errors** per quarter.
- **100% SIE formulas** covered by scientific reference tests.
- **SKB citation coverage**: 100% (no orphan formulas).

### Bilingual & Accessibility
- **AR/EN parity**: 100% (no untranslated user-facing strings).
- **WCAG AA compliance**: 100% on critical flows.
- **VoiceOver / TalkBack navigability**: verified quarterly on Sacred Nine.

---

## 10.6 Quality Scoreboard

A live dashboard aggregates all metrics into a single "Quality Score" published weekly to the team:

| Dimension | Weight |
|---|---|
| Availability & performance | 25% |
| Test coverage & pass rate | 20% |
| Security posture | 15% |
| Bilingual & a11y parity | 15% |
| Scientific correctness | 15% |
| Documentation freshness | 5% |
| Developer experience | 5% |

Score floor for a healthy project: **85/100**. Below 85 triggers a quality-focused sprint before new features.

---

## 10.7 Waiver Process

Exceptions exist — rarely. To waive a gate:

1. Author files a waiver in `/app/waivers/YYYY-MM-DD-title.md`:
   - Gate being waived.
   - Reason.
   - Compensating controls.
   - Expiry date (max 30 days).
2. Signed by: eng lead + product owner.
3. Tracked in the sprint retrospective.
4. Automatic reminder before expiry.

**Auth, security, and data-integrity gates are non-waivable.**

---

## 10.8 Continuous Improvement

Quarterly, the team reviews:
- Which gates fired most (are they useful?).
- Which gates never fired (are they too weak? too strong?).
- Which incidents slipped through gates (add a gate).
- Whether SLO targets need tightening.

This document is versioned. Changes go through PR review like any code.

---

## 10.9 The Final Word

**Quality gates are the reason SportMind AI can be trusted with:**
- The training of a national team.
- The rehabilitation of a career-ending injury.
- The scientific integrity of a peer-reviewed study.
- The medical data of an athlete.
- The professional reputation of a sports scientist.

Every gate defends one of those trusts. We defend them all.

---

## 10.10 Sign-Off

By adopting this document as the engineering constitution, the SportMind AI team commits to:

- Building software worthy of the discipline it serves.
- Measuring what matters and improving what we measure.
- Refusing to trade long-term integrity for short-term velocity.
- Treating every athlete's data as if it were our own.

**With this final document approved, Phase 1 implementation begins.**

---

_End of Engineering Standards & Development Guidelines._

## Companion Documents
- [UI/UX Design Specification](./UIUX_DESIGN_SPEC.md)
- [Product Requirements Document](./PRD.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [Master Engineering Standards Index](./ENGINEERING_STANDARDS.md)

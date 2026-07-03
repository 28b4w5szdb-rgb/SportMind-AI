# SportMind AI — Engineering Standards & Development Guidelines
## The Coding Constitution

> **Version:** 1.0 (Pre-Implementation Foundation)  
> **Status:** ✅ Approved — Binding for all contributors  
> **Audience:** Every engineer, contractor, AI agent, and reviewer touching the codebase  
> **Rule:** No pull request is merged unless it complies with this document.

---

## 📚 How This Document Is Organized

The Engineering Standards are split into 10 chapters, each independently versioned and enforceable via CI:

| # | Chapter | Purpose |
|---|---------|---------|
| 01 | [Coding Standards](./ENG_01_CODING_STANDARDS.md) | Clean Code, SOLID, DRY, KISS, naming, organization |
| 02 | [Architecture Rules](./ENG_02_ARCHITECTURE_RULES.md) | Feature-first, DI, Repository, Service layer, boundaries |
| 03 | [State Management](./ENG_03_STATE_MANAGEMENT.md) | Local, global, cache, offline sync, optimistic updates |
| 04 | [API Standards](./ENG_04_API_STANDARDS.md) | Versioning, errors, retries, pagination, security |
| 05 | [Performance Standards](./ENG_05_PERFORMANCE.md) | FPS, startup, memory, lazy loading, images |
| 06 | [Security Standards](./ENG_06_SECURITY.md) | Auth, encryption, secure storage, OWASP Mobile |
| 07 | [Testing Strategy](./ENG_07_TESTING.md) | Unit, integration, E2E, scientific, snapshot, perf |
| 08 | [CI/CD Pipeline](./ENG_08_CICD.md) | Branching, PR rules, automation, releases, semver |
| 09 | [Documentation Standards](./ENG_09_DOCUMENTATION.md) | Code comments, API docs, changelogs, ADRs |
| 10 | [Quality Gates](./ENG_10_QUALITY_GATES.md) | Release readiness criteria and metrics |

---

## 🎯 The Ten Commandments (Non-Negotiables)

1. **No hard-coded strings.** Every user-facing string flows through i18n (`en.json` + `ar.json`).
2. **No hard-coded design values.** Colors, spacings, typography come from tokens (see UIUX Doc 02).
3. **No business logic in UI components.** Screens compose; hooks + services do the work.
4. **No untested code paths in P0 features.** Every P0 feature has unit + integration coverage.
5. **No AI output without an Explain trace.** Every LLM/SIE result carries provenance.
6. **No credentials in code.** Ever. Not even in dev branches.
7. **No breaking changes without an ADR.** Architectural decisions are logged.
8. **No merges without a green CI + at least one human review.**
9. **No feature ships without an Empty/Loading/Error/Success state.**
10. **No feature ships without RTL parity and dark-mode parity.**

Violating any of these blocks the merge. Full stop.

---

## 🔑 Guiding Principles

- **Readable > clever.** Optimize for the developer who reads this in 18 months.
- **Explicit > implicit.** No magic. Every dependency is injected, every side-effect is named.
- **Boring stack > exotic stack.** Choose the boring, well-supported tool every time.
- **Reversibility > perfection.** Small, reversible steps beat big irreversible leaps.
- **Instrument everything.** If it's not measured, it's not owned.
- **Delete relentlessly.** Dead code is technical debt.
- **Types are documentation.** TypeScript strict mode. No `any` without a written reason.
- **Bilingual by default.** Every feature is tested in AR and EN before merge.
- **Offline-first mindset.** Every feature is designed assuming the network fails.
- **Scientific correctness.** Every calculation is unit-tested against known references.

---

## 🧭 How to Use This Guide

- **New engineers** → read chapters 01, 02, 07 in full before your first PR.
- **Feature authors** → use chapter 10 as your merge checklist.
- **Reviewers** → use chapter 01 §1.7 (Code Review Checklist) verbatim.
- **Release managers** → chapter 08 + 10 are your ship-or-block criteria.
- **AI coding agents** → obey every rule. When in doubt, ask.

---

## ✅ Adoption

Upon approval of this document, the project moves from planning to implementation. Every subsequent commit is judged against these standards.

_See Chapter 01 to begin._

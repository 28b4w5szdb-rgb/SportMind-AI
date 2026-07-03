# 01 · Coding Standards

> The atomic layer of quality. Every line of code obeys these rules.

---

## 1.1 Clean Code Principles

### The Boy Scout Rule
> Leave the code cleaner than you found it.

Every PR that touches a file should improve at least one small thing in that file (a rename, a delete, an extraction). Small refactors compound.

### Meaningful Names
- Names reveal intent. `d` is banned. `daysSinceLastTest` is required.
- Booleans read as questions: `isReady`, `hasConsent`, `canExport`.
- Functions are verb phrases: `calculateVO2Max`, `syncAthleteRecord`.
- Domain terms match the PRD glossary (Athlete, Team, Test, Metric, SIE, SKB).

### Functions
- One thing per function. If the function name contains "and", split it.
- Max 30 lines. Max 3 parameters. If more, use an options object.
- No side effects hidden by the name.
- Prefer pure functions where possible.
- Early returns beat nested conditionals.

### Comments
- Code should explain **what**. Comments explain **why**.
- No commented-out code. Delete it — git remembers.
- No decorative banners. No ASCII art.
- TODOs must include an owner and a ticket: `// TODO(@ali) SM-142: handle offline reconnect`.

---

## 1.2 SOLID Principles (Applied to React Native)

### S — Single Responsibility
- A React component renders one thing.
- A hook owns one behavior.
- A service owns one domain.

### O — Open / Closed
- Compose via props and configuration, not by editing shared components.
- Use dependency injection for services (see Chapter 02 §2.2).

### L — Liskov Substitution
- Any implementation of an interface must be swappable with no behavior surprise.
- Example: `AuthProvider` interface → `EmergentGoogleAuthProvider`, `JWTAuthProvider` — both interchangeable.

### I — Interface Segregation
- Small, focused TypeScript interfaces.
- No god-interfaces like `IAthleteEverything`.

### D — Dependency Inversion
- Depend on abstractions (interfaces), not concretions.
- UI components never import Firebase directly. They call hooks that call services that call adapters.

---

## 1.3 DRY — Don't Repeat Yourself

- Three-strike rule: after the third duplication, extract.
- Cross-feature logic goes in `src/core/` or `src/services/`.
- Cross-feature UI goes in `src/components/`.
- **Beware of premature abstraction.** Two similar things aren't always duplicates.

---

## 1.4 KISS — Keep It Simple, Stupid

- Prefer a for-loop over a fancy reduce if it's clearer.
- Prefer a boolean over a state machine, unless there are >3 states.
- Prefer `useState` over Zustand, unless state is shared cross-screen.
- Prefer inline styles via tokens over a new component, unless reused 3+ times.

---

## 1.5 Naming Conventions

### Files & Folders
| Kind | Convention | Example |
|---|---|---|
| React component file | `PascalCase.tsx` | `AthleteCard.tsx` |
| Hook file | `camelCase.ts` starting with `use` | `useAthleteReadiness.ts` |
| Service file | `camelCase.ts` ending with `.service` | `athlete.service.ts` |
| Repository file | `camelCase.ts` ending with `.repository` | `athlete.repository.ts` |
| Type / interface file | `camelCase.ts` ending with `.types` | `athlete.types.ts` |
| Test file | `*.test.ts(x)` | `AthleteCard.test.tsx` |
| Route file (Expo Router) | `kebab-case.tsx` | `add-athlete.tsx` |
| Folder | `kebab-case` | `performance-lab/` |

### Symbols
| Kind | Convention | Example |
|---|---|---|
| Component | PascalCase | `AthleteCard` |
| Hook | camelCase, `use` prefix | `useAthleteReadiness` |
| Constant | UPPER_SNAKE_CASE | `MAX_UPLOAD_MB` |
| Enum | PascalCase + PascalCase values | `AthleteStatus.Injured` |
| Function | camelCase | `computeACWR` |
| Type / Interface | PascalCase, no `I` prefix | `AthleteRecord` |
| Boolean | `is`/`has`/`can`/`should` | `isConsented` |
| Event handler | `handleXxx` inside; `onXxx` prop | `handlePress`, prop `onPress` |
| Async function | verb + `Async` optional | `fetchAthletes`, `saveAsync` |
| i18n key | `dot.case.namespace` | `athlete.detail.title` |

### Forbidden
- `data`, `info`, `manager`, `helper`, `util` alone as identifiers.
- Hungarian notation (`strName`, `bIsReady`).
- Abbreviations except widely known (`id`, `url`, `api`, `vo2`, `hr`, `hrv`).

---

## 1.6 Folder Organization (Feature-First)

The canonical monorepo layout:

```
/app
├─ frontend/
│  ├─ app/                         ← Expo Router routes only (no logic)
│  │  ├─ (tabs)/
│  │  ├─ (auth)/
│  │  └─ _layout.tsx
│  ├─ src/
│  │  ├─ core/                     ← App-wide primitives
│  │  │  ├─ theme/                 ← Tokens (colors, type, spacing)
│  │  │  ├─ i18n/                  ← en.json, ar.json + config
│  │  │  ├─ config/                ← Constants, env access
│  │  │  ├─ utils/                 ← Pure utilities (dates, math, format)
│  │  │  └─ errors/                ← Error types + boundary logic
│  │  ├─ components/               ← Cross-feature reusable UI
│  │  │  ├─ common/                ← Button, Card, Input, Chip, etc.
│  │  │  ├─ layout/                ← Screen, SafeArea, Container
│  │  │  └─ charts/                ← Line, Bar, Radar wrappers
│  │  ├─ features/                 ← Feature modules (the meat)
│  │  │  ├─ athletes/
│  │  │  │  ├─ api/                ← Endpoints (thin)
│  │  │  │  ├─ hooks/              ← useAthletes, useAthleteDetail
│  │  │  │  ├─ components/         ← AthleteCard, AthleteForm
│  │  │  │  ├─ screens/            ← List, Detail, Add
│  │  │  │  ├─ services/           ← athlete.service.ts
│  │  │  │  ├─ repositories/       ← athlete.repository.ts (offline+remote)
│  │  │  │  ├─ store/              ← Zustand slice
│  │  │  │  ├─ types/              ← athlete.types.ts
│  │  │  │  └─ __tests__/          ← Unit + integration tests
│  │  │  ├─ ai-coach/
│  │  │  ├─ performance-lab/
│  │  │  ├─ reports/
│  │  │  ├─ research/
│  │  │  ├─ settings/
│  │  │  └─ team-management/
│  │  ├─ services/                 ← Cross-feature services
│  │  │  ├─ auth/
│  │  │  ├─ network/               ← API client + interceptors
│  │  │  ├─ storage/               ← SecureStore, MMKV, SQLite
│  │  │  ├─ sync/                  ← Offline sync engine
│  │  │  ├─ analytics/
│  │  │  ├─ sie/                   ← SportMind Intelligence Engine
│  │  │  └─ skb/                   ← Scientific Knowledge Base client
│  │  ├─ providers/                ← React context providers (Auth, Direction, Theme)
│  │  ├─ navigation/               ← Deep links, guards, RBAC hooks
│  │  └─ types/                    ← Global types
│  ├─ assets/                      ← Fonts, icons, images
│  └─ __tests__/                   ← Cross-feature integration tests
└─ backend/
   ├─ app/
   │  ├─ routes/                   ← FastAPI routers (one per resource)
   │  ├─ models/                   ← Pydantic + DB models
   │  ├─ services/                 ← Business logic
   │  ├─ repositories/             ← DB access
   │  ├─ sie/                      ← SIE server-side calculations
   │  ├─ middleware/               ← Auth, rate limit, logging
   │  ├─ core/                     ← Config, exceptions, DI
   │  └─ tests/
   ├─ requirements.txt
   └─ server.py                    ← App entrypoint
```

### Rules for Folder Placement
- **A file goes in `features/X/` if it is used only within feature X.**
- **Promote to `components/` or `services/` only after the third feature needs it.**
- **Never import between features** — features communicate via shared services or the store.
- **`app/` (Expo Router) has zero logic** — route files are 5-line composers that mount a feature screen.

---

## 1.7 Code Review Checklist

Reviewers must check every box before approving:

### Correctness
- [ ] Does the code do what the PR description claims?
- [ ] Are edge cases handled (null, empty list, network fail, RTL, dark mode)?
- [ ] Is there a test proving the happy path?
- [ ] Is there a test proving at least one failure path?

### Design
- [ ] Is the change in the right layer (UI vs. hook vs. service vs. repo)?
- [ ] Are dependencies injected, not imported directly?
- [ ] Are new components truly needed, or could an existing one be extended?
- [ ] Are all 4 states designed (empty, loading, error, success)?

### Standards
- [ ] Names follow §1.5.
- [ ] File placement follows §1.6.
- [ ] No hard-coded strings (i18n keys used).
- [ ] No hard-coded design values (tokens used).
- [ ] No `any` type without a written reason.
- [ ] No `console.log` in committed code (`__DEV__` guard OK).

### Bilingual & Accessibility
- [ ] Tested visually in AR and EN.
- [ ] Screen reader labels present on interactive elements.
- [ ] Contrast ratios pass in both light and dark modes.
- [ ] Touch targets ≥ 44 pt.

### Performance
- [ ] No unnecessary re-renders (memo/useCallback used where measured).
- [ ] Large lists use FlashList.
- [ ] Images use proper sizing (never full-res thumbnails).

### Security
- [ ] No secrets in code.
- [ ] Inputs are validated at the boundary.
- [ ] AuthN/AuthZ checks present where required.

### Documentation
- [ ] Public functions have JSDoc/TSDoc comments.
- [ ] Changelog updated if user-facing.
- [ ] ADR filed if architectural.

---

## 1.8 Formatting & Linting

### Tools (fixed choices)
- **TypeScript** strict mode (`strict: true`, `noUncheckedIndexedAccess: true`).
- **ESLint** with `@typescript-eslint`, `react`, `react-hooks`, `react-native`, `import/order` plugins.
- **Prettier** with `printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`, `arrowParens: 'always'`.
- **Ruff** for Python (backend) with line length 100.
- **Black** for Python auto-format.

### Rules
- Line width 100.
- No unused imports (auto-removed).
- Imports ordered: external → aliased (`@/features/...`) → relative.
- No default exports for components (named exports only — easier refactor).
- Route files (Expo Router) use default export (framework requirement).

---

## 1.9 TypeScript Rules

- `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`.
- Prefer `type` for aliases and unions, `interface` for object shapes that may be extended.
- No `any`. If unavoidable, `unknown` + narrowing.
- No `!` non-null assertion without a comment explaining why.
- Discriminated unions for state modeling: `{ status: 'loading' } | { status: 'error'; error } | { status: 'success'; data }`.
- Use `readonly` on props and data models.
- Enums are discouraged — prefer `as const` object literals.

---

## 1.10 Python Backend Rules (mirror of the above)

- Python 3.11+.
- Type hints on every public function.
- Pydantic v2 for all models.
- Ruff + Black + Mypy strict.
- No wildcard imports.
- Docstrings on every public class/function (Google style).

---

_Continue to Chapter 02 — Architecture Rules._

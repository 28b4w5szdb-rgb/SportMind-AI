# 10 · Final UI Blueprint

> The consolidated visual source of truth. If any question about the SportMind AI UI cannot be answered by this document (linking into Docs 01–09), the answer is: **it doesn't exist yet.**

---

## 10.1 What This Blueprint Guarantees

A developer, designer, PM, or QA opening this blueprint should be able to answer:

1. What does SportMind AI feel like? → Doc 01
2. What color/type/space token do I use here? → Doc 02
3. What component do I use for X? → Doc 03
4. What does screen Y look like in state Z? → Doc 04
5. How does this behave on tablet or web? → Doc 05
6. How does this render in Arabic? → Doc 06
7. What animation curve applies here? → Doc 07
8. What does role R see on their dashboard? → Doc 08
9. What does the exported report look like? → Doc 09
10. What is the *big picture* of the entire experience? → **This document.**

---

## 10.2 Product Surface Map

```
                          SportMind AI
                              │
     ┌────────────────────────┼────────────────────────┐
     │                        │                        │
   AUTH                   MAIN APP                 EXPORTS
     │                        │                        │
  Splash                 ┌────┴────┐             PDF Report
  Onboarding             │         │             Excel
  Sign In               MOBILE   TABLET/WEB      CSV / JSON
  Sign Up                │         │             Share Link
  Verify                Tabs     Side Nav
                         │         │
                 ┌───────┴─────────┴──────┐
                 │                        │
              ROLE-BASED               SHARED
              DASHBOARD               SURFACES
              (Doc 08)                    │
                 │            ┌───────────┼───────────┐
                 │         Athletes   Performance   AI Coach
                 │            │            │           │
                 │        List/Det.   Tests/Calc.   Chat/Recs
                 │                                       │
                 └─────────────────────────────┬─────────┘
                                               │
                                          Cross-cutting
                                          Concerns:
                                       ┌──────┼───────┐
                                    RBAC   Offline    i18n
                                    Sync   Explain    Motion
                                           AI (SIE)
```

---

## 10.3 The 10 Signature Moments

If a user were to remember only 10 visual moments from SportMind AI, they'd be these — and each is a canonical design that must survive every future revision:

1. **The Sync Pulse Bar** breathing under the app bar in blue while data lands.
2. **The Data Card** — glass surface, hero metric, delta chip, sparkline.
3. **The Explain Chip** attached to every AI statement — clickable proof.
4. **The Confidence Ring** wrapping every recommendation.
5. **The Language Mirror Flip** — the moment a screen visibly re-mirrors on `AR ⇄ EN`.
6. **The SIE Formula Card** — LaTeX-rendered formula, editable inputs, live output.
7. **The Readiness Traffic Light Grid** on the coach dashboard.
8. **The Radar Chart** on the athlete overview — 6-axis polygon.
9. **The Report Cover Page** — journal-grade typography.
10. **The AI Streaming Text** in the AI Coach chat, dots resolving into words.

---

## 10.4 The Home Screen (Zero-State Reference)

The canonical first thing a Sports Scientist sees on a phone (English, light mode):

```
┌─────────────────────────────────────┐
│ Good morning, Dr. Al-Sayed    🔔 ●  │
│ Al-Nasr Sports Science Center       │
├─────────────────────────────────────┤
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← sync pulse (blue while syncing)
├─────────────────────────────────────┤
│                                     │
│  ┌──────────┐   ┌──────────┐        │
│  │ AT-RISK  │   │ PENDING  │        │
│  │    2     │   │    5     │        │
│  │ Athletes │   │ Reviews  │        │
│  │ ▂▄▂▁▃▅   │   │ ▁▃▅▇▅▃   │        │
│  └──────────┘   └──────────┘        │
│                                     │
│  ┌───────────────────────────┐      │
│  │ 🧠 AI INSIGHT             │      │
│  │                           │      │
│  │ ACWR for Ahmed Al-Fahim   │      │
│  │ crossed 1.5 (moderate     │      │
│  │ overload risk).           │      │
│  │                           │      │
│  │ [ⓘ Why?]  ⚪ 87% conf.   │      │
│  └───────────────────────────┘      │
│                                     │
│  Quick actions                      │
│  [＋Test] [＋Athlete] [🧮] [📤]     │
│                                     │
│  Recent activity                    │
│  • You saved a report · 5m          │
│  • Coach modified Youssef's plan    │
│  • New test result: Fahad (VO₂ 62.1)│
│                                     │
├─────────────────────────────────────┤
│ 🏠   👥   💬   📊   ⋯               │  ← tab bar
└─────────────────────────────────────┘
```

The Arabic mirror of this screen (Doc 06) shows the same information, mirrored logically — the greeting shifts to the visual right, the tab bar tab order mirrors, but numerals stay Latin.

---

## 10.5 Blueprint of Core Flows (End-to-End)

### Flow A — Onboard a New Athlete
1. **Athletes tab → FAB `+ Add`**.
2. Wizard step 1 — Identity form.
3. Wizard step 2 — Biometrics.
4. Wizard step 3 — Sport & Team assignment (RBAC gated).
5. Wizard step 4 — Medical & consent.
6. Review & Save → success animation → athlete detail opens.
7. Sync pulse turns amber if offline → syncs when connection returns.

### Flow B — Ask AI Coach for a Recommendation
1. AI Coach tab.
2. Suggested prompt tap or type.
3. Streaming response with confidence ring forming.
4. Explain Chip → sheet with SIE trace + SKB citations.
5. Save recommendation to athlete's note.

### Flow C — Export a Team Report
1. More → Reports → New.
2. Choose template "Team Weekly".
3. Configure range, language, sections.
4. Preview.
5. Export PDF → success toast with "Open" and "Share".

### Flow D — Toggle Language
1. Long-press avatar (or Settings → Language).
2. Tap `AR`.
3. Mirror-flip animation.
4. Everything renders in Arabic with proper direction, typography, and numerals.
5. Language persists.

### Flow E — Research Mode Deep Dive
1. More → Research Mode (iris chrome).
2. Query builder (cohort A vs. cohort B on VO₂).
3. Run — statistical panel with p, effect size, confidence.
4. Save as study → export scientific brief PDF.

---

## 10.6 The Interaction Surface (One-Page Cheat Sheet)

| Gesture | Result |
|---|---|
| Tap | Primary action |
| Long-press | Context menu / quick actions |
| Swipe row start→end | Reveal archive |
| Swipe row end→start | Reveal delete/edit |
| Pull down on scroll | Refresh |
| Pinch on chart | Zoom x-axis |
| Drag chart | Scrub with crosshair |
| Two-finger drag card (web) | Reorder dashboard |
| Long-press avatar | Quick language switch |
| Edge swipe (iOS) | Back |
| Shake device | Report issue dialog (dev/staging only) |

---

## 10.7 Feature-to-Component Matrix

| Feature | Key Components |
|---|---|
| Athlete List | List Row, Search Field, Segmented Control, FAB |
| Athlete Detail | Data Card, Radar Chart, Timeline, Explain Chip |
| AI Coach | Chat bubble, Explain Chip, Confidence Ring, Input |
| Calculator | SIE Formula Card, Number Field, Chip |
| Reports | Report Section Block, Segmented Control, Preview canvas |
| Team Mgmt | Table, RBAC Guard, Chip, Avatar Group |
| Research | Query Builder, Scatter Chart, Statistical Panel |
| Dashboard | Data Card, Sparkline, Progress Ring, Feed rows |

---

## 10.8 What Must Be True in Every Screen (Universal Rules)

1. Sync Pulse Bar is present under the app bar.
2. Language toggle is reachable within 2 taps.
3. No hard-coded strings (all through i18n).
4. No hard-coded colors/spacings (tokens only).
5. All interactive elements have a defined hover/press/focus/disabled/loading state.
6. RTL renders correctly.
7. Reduced-motion mode renders correctly.
8. Dark mode renders correctly.
9. Screen supports Empty · Loading · Error · Success states.
10. Every AI-generated statement carries an Explain Chip.
11. Every recommendation carries a Confidence Ring.
12. Every screen respects RBAC — invisible or locked for unauthorized roles.
13. Every screen has an accessibility landmark structure (role=main, headings, labels).
14. Every screen is Instrumented (analytics event on entry, on primary action).

---

## 10.9 Design → Engineering Handshake

Each screen ships with an artifact bundle:

1. **Figma frame** — light, dark, LTR, RTL (4 variants).
2. **State grid** — empty, loading, error, success (4 grids).
3. **Component reference list** — from Doc 03.
4. **Motion notes** — which motion tokens apply.
5. **Copy deck** — EN + AR strings for the screen.
6. **A11y notes** — landmarks, labels, focus order.
7. **Test cases** — critical UX assertions.

No screen enters the sprint backlog without all 7.

---

## 10.10 Governance

### Design Reviews
- Weekly design critique against this blueprint.
- Any deviation requires an ADR (Architecture Decision Record) filed in `/frontend/adr/`.

### Token Changes
- Any addition/modification of a token in Doc 02 requires PR review by design lead + engineering lead.

### New Components
- New components must be justified against existing 52. If an existing component can be extended, it is preferred.

### Localization
- All new strings must be added to `i18n/en.json` and `i18n/ar.json` simultaneously in the same PR.

---

## 10.11 Approval Roster (Blueprint Sign-off)

| Role | Responsibility | Sign-off |
|---|---|---|
| Product Owner | Vision alignment | ☐ |
| Design Lead | Visual system | ☐ |
| Engineering Lead | Feasibility | ☐ |
| QA Lead | Testability | ☐ |
| Sports Science Advisor | Domain accuracy | ☐ |
| Localization Lead | AR/EN parity | ☐ |
| Accessibility Lead | WCAG conformance | ☐ |

Once all boxes are checked, **Phase 1 implementation begins**.

---

## 10.12 Final Word

This blueprint is a promise:

> **SportMind AI will feel like the calmest, most credible, most beautifully bilingual sports science tool the industry has ever seen.**

Every line of code we write from this point forward is measured against that promise.

---

_End of UI/UX Design Specification. Ready for review._

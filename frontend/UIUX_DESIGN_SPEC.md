# SportMind AI — UI/UX Design Specification
## Master Index & Design Bible

> **Version:** 1.0 (Pre-Implementation)  
> **Status:** ✅ Complete — Visual Source of Truth  
> **Audience:** Product · Design · Engineering · QA · Stakeholders  
> **Rule:** No line of code is written until this specification is approved.

---

## 📚 Document Structure

This specification is intentionally split into 10 focused documents so each domain can be reviewed, versioned, and updated independently.

| # | Document | Purpose |
|---|----------|---------|
| 01 | [Design Language](./UIUX_01_DESIGN_LANGUAGE.md) | Philosophy, tone, mood, visual DNA |
| 02 | [Design System](./UIUX_02_DESIGN_SYSTEM.md) | Colors, typography, spacing, shadows, glassmorphism |
| 03 | [Component Library](./UIUX_03_COMPONENT_LIBRARY.md) | Every reusable component, spec'd and stated |
| 04 | [Screen Wireframes](./UIUX_04_SCREEN_WIREFRAMES.md) | Every screen — layout, states, flow |
| 05 | [Responsive Design](./UIUX_05_RESPONSIVE_DESIGN.md) | Phone, tablet, foldable, web dashboard |
| 06 | [Bilingual RTL/LTR](./UIUX_06_BILINGUAL_RTL_LTR.md) | Arabic-first & English-first parity |
| 07 | [Animation System](./UIUX_07_ANIMATION_SYSTEM.md) | Transitions, micro-interactions, gestures |
| 08 | [Role-Based Dashboards](./UIUX_08_DASHBOARDS.md) | Scientist, Coach, Athlete, Researcher, Admin |
| 09 | [Reporting Experience](./UIUX_09_REPORTING_EXPERIENCE.md) | Premium PDF & printable reports |
| 10 | [Final UI Blueprint](./UIUX_10_UI_BLUEPRINT.md) | Consolidated visual source of truth |

---

## 🎯 Guiding Principles (The Non-Negotiables)

1. **Scientific Credibility First** — Every visual choice must reinforce trust. This is a tool used by PhDs, clinicians, and Olympic coaches. No gimmicks, no cartoon icons, no arbitrary gradients.
2. **Apple-Grade Restraint** — 90% white/dark space, 10% content. Typography does the heavy lifting. Color is used as *signal*, never as decoration.
3. **Bilingual = Equal** — Arabic is not a translation layer. It is a first-class citizen with its own typographic rhythm, mirrored layout, and locale-aware components.
4. **Data is the Hero** — Numbers, charts, and biometric signals are the true content. UI chrome recedes to let data breathe.
5. **Explainability by Design** — Every AI-generated insight ships with an inline "Why?" affordance. The UI is engineered for transparency.
6. **Offline is a Feature, Not a Fallback** — Sync state is always visible, never intrusive. Users must trust that their work is safe.
7. **Accessibility as a First-Order Concern** — WCAG AAA where possible, AA minimum. Contrast ratios, tap targets, screen readers, dynamic type — all designed, not retrofitted.
8. **Motion with Meaning** — Animation clarifies causality and hierarchy. Never for delight alone.

---

## 🧭 How to Use This Spec

- **Designers** → produce Figma files that match Documents 02, 03, 04 pixel-for-pixel.
- **Engineers** → treat Documents 02, 03, 06, 07 as acceptance criteria for every PR.
- **QA** → validate against state matrices in Document 04 and animation curves in Document 07.
- **Product** → use Document 08 & 10 as the single source of role-based experience truth.

---

## ✅ Approval Gates

Before Phase 1 coding begins, the following must be signed off:

- [ ] Design Language approved (Doc 01)
- [ ] Color, Type, and Spacing tokens frozen (Doc 02)
- [ ] Component inventory complete (Doc 03)
- [ ] All P0 screens wireframed with 4 states each (Doc 04)
- [ ] Responsive breakpoints agreed (Doc 05)
- [ ] RTL parity confirmed on all P0 screens (Doc 06)
- [ ] Motion timing curves standardized (Doc 07)
- [ ] 5 role dashboards designed (Doc 08)
- [ ] 3 report templates approved AR + EN (Doc 09)
- [ ] UI Blueprint signed by Product Owner (Doc 10)

---

_End of Master Index. Proceed to Document 01._

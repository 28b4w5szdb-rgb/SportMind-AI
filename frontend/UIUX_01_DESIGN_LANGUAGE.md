# 01 · Design Language

> The soul of SportMind AI. Every pixel obeys these principles.

---

## 1.1 Core Vocabulary

**SportMind AI is:** _Premium · Modern · Minimal · Scientific · Trustworthy · Bilingual · Data-native · Human_

**SportMind AI is NOT:** _Playful · Gamified · Neon · Cartoonish · Cluttered · Marketing-loud_

---

## 1.2 The Three Pillars

### 🧬 Pillar 1 — Scientific Precision
Inspired by scientific instrumentation, medical dashboards, and academic journals. Think: Bloomberg Terminal meets Apple Health meets Nature.com.

- Numbers are typeset with monospaced tabular figures.
- Data cards use hairline dividers (0.5 px), not heavy borders.
- Every metric shows units, ranges, and confidence intervals inline.
- Charts prefer clarity over aesthetics — no drop shadows on data.

### 🍎 Pillar 2 — Apple-Quality Craft
The fit and finish of iOS system apps. Nothing feels "made cheaply."

- Corner radii are consistent (see Doc 02 tokens).
- Interactions have inertia, damping, and rebound.
- SF-inspired system typography with fallbacks tuned per platform.
- Icons are stroke-based, 1.5 px optical, from a single family.

### 🌍 Pillar 3 — Bilingual Duality
Arabic is co-equal to English. Both languages influence every design decision.

- Typography pairs are chosen to have matching x-heights.
- All layout is composed with logical properties (start/end, not left/right).
- Iconography avoids directional metaphors where possible; where unavoidable, they mirror.
- Numerals default to Latin (Western Arabic) for scientific consistency; Eastern Arabic numerals are user-toggleable.

---

## 1.3 Mood Board Anchors

| Reference | Why |
|-----------|-----|
| Apple Fitness+ | Data-forward, calm, motion sensibility |
| Whoop 4.0 App | Athlete-centric metrics, dark mode mastery |
| Bloomberg Terminal | Information density done right |
| Linear | Motion, keyboard-first, dark mode discipline |
| Nature.com | Scientific typography, restraint |
| Aramco Digital | Arabic-first premium enterprise UX |

---

## 1.4 Emotional Targets

When a Sports Scientist opens SportMind AI, they should feel:

1. **Respected** — "This tool was built for professionals like me."
2. **In Control** — "I can find anything in ≤2 taps."
3. **Confident** — "The data I see is trustworthy and traceable."
4. **Efficient** — "I got 30 minutes of work done in 5 minutes."
5. **Delighted (quietly)** — "That transition felt right."

---

## 1.5 Anti-Patterns (Forbidden)

- ❌ Rainbow gradients
- ❌ Emoji as primary iconography
- ❌ Skeuomorphic textures (wood, leather, felt)
- ❌ Bounce animations on critical UI
- ❌ Marketing-style hero images inside the app
- ❌ Modal dialogs with cartoon illustrations
- ❌ "Congrats!" style celebratory confetti on non-athlete flows
- ❌ Uppercase body text
- ❌ Fake AI "typing" delays > 300 ms

---

## 1.6 Signature Design Moves

Moments that make SportMind AI recognizable at 20 feet:

1. **The Data Card** — A frosted glass surface with a single hero metric, a delta chip, and a micro-sparkline. Used everywhere.
2. **The Explain Chip** — A `ⓘ Why?` chip attached to every AI-generated statement.
3. **The Bilingual Toggle** — Live-preview language switcher accessible from anywhere.
4. **The Confidence Ring** — A thin circular meter around any AI recommendation showing model confidence 0–100%.
5. **The Sync Pulse** — A 3 px status bar under the app bar showing offline/syncing/synced with a breathing animation.

---

## 1.7 Voice & Copy Tone

- **Clinical, not cold.** "VO₂ Max is trending upward" > "Your fitness rocks!"
- **Precise units.** Always `ml/kg/min`, `mmol/L`, `bpm` — never dropped.
- **First-person plural for AI.** "We recommend…" (with visible model attribution).
- **Arabic voice matches:** Formal فصحى (Modern Standard Arabic), not dialect.

---

_See Doc 02 for the token system that operationalizes this language._

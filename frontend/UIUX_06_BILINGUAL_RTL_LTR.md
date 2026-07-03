# 06 · Bilingual RTL/LTR UX

> Arabic is a first-class citizen. This document is longer than most bilingual specs — deliberately.

---

## 6.1 Guiding Principles

1. **Arabic is not a translation** — it is a primary language with equal design investment.
2. **Every screen is designed twice** — once in Arabic, once in English. The Arabic version is not a mirror derived from English; it is a native composition.
3. **RTL layout is automatic**, but critical screens are hand-tuned.
4. **Language switching is instantaneous** — no restart, no reload.
5. **Arabic typography respects its own rhythm** — line-height, weights, and letter-forms differ.

---

## 6.2 Direction Semantics

All layout code uses **logical properties** — never `left`/`right`.

| Logical | LTR | RTL |
|---|---|---|
| `start` | left | right |
| `end` | right | left |
| `paddingStart` | padding-left | padding-right |
| `marginEnd` | margin-right | margin-left |
| `textAlign: 'start'` | left | right |

**Never used:** `flexDirection: row-reverse` as a workaround — proper `I18nManager.isRTL` and logical props only.

---

## 6.3 Element Mirroring Rules

### Mirrors in RTL (auto)
- Back arrow, forward chevron, breadcrumb separators.
- Progress bars, sliders (start = 0 on the right).
- Timeline flows right-to-left.
- Charts' x-axis origin flips to the right (except when data is inherently ordered).
- Modal footer actions (cancel starts, confirm ends).
- Swipe-to-delete gestures reverse.

### Does NOT mirror
- Play/pause/record media controls.
- Scientific symbols (∑, √, integrals, chemistry).
- Logos, brand marks.
- Video timelines (time progresses left→right universally).
- Numerals (see 6.5).
- Icons for non-directional concepts (heart, star, camera).

### Conditional mirror (context-aware)
- Charts: if x-axis is time-based → keep left-origin even in RTL (users read time chronologically). The chart title, legend, and cross-hair callouts do mirror.
- Tables: column order mirrors, but numeric columns remain right-aligned by data-type, not by direction.

---

## 6.4 Typography Pairing

| Latin | Arabic | Pairing Notes |
|---|---|---|
| Inter / SF Pro | IBM Plex Sans Arabic | Modern, matched x-height |
| Newsreader (serif reports) | Amiri (serif reports) | Classic, print-ready |
| JetBrains Mono / SF Mono | (Latin figures) | Numeric consistency |

Arabic requires:
- 1.15× line-height on every scale.
- Slightly reduced font-weight (600 EN ≈ 550 AR).
- No italics (Arabic has no italic; use weight or color for emphasis).
- Justified alignment allowed (Arabic supports Kashida) — but use sparingly, only in long reading contexts.

---

## 6.5 Numerals

**Default (scientific consistency):** Latin (Western Arabic) digits `0–9` in both languages.  
**User-toggleable:** Eastern Arabic digits `٠–٩`.

Rules:
- Digits inside prose follow user preference.
- Chart axes always use Latin digits (data-viz convention).
- Formulas always use Latin digits.
- Currency and phone numbers respect locale.
- Tabular figures (monospace) used in metrics regardless of digit set.

---

## 6.6 Copy & Voice

### Register
- **English:** Neutral professional, second-person direct ("You have 3 new insights").
- **Arabic:** Modern Standard Arabic (MSA / فصحى), avoiding regional dialect. Slightly more formal register — "لديك 3 توصيات جديدة".

### Length
Arabic prose runs ~15% shorter than English in width but slightly taller in height due to diacritics headroom. Design for text-swell up to ±20% either way.

### Numbers in Copy
- English: "3 athletes"
- Arabic: "3 لاعبين" (Latin digit + Arabic word) — chosen for consistency across the app.

### Dates & Times
- Calendar: Gregorian default; **Hijri toggle** available (some users require Hijri for religious observance planning around Ramadan training).
- Time format: 24-hour default. 12-hour toggle exists.

### Units
- Metric only (SI units). No imperial toggle (this is a scientific product).

---

## 6.7 Language Toggle UX

**Where:** 
- Onboarding step 1
- Settings → Preferences → Language
- Long-press on user avatar (quick access from any screen)

**Behavior:**
1. User taps `AR | EN` segmented control.
2. Live preview: current screen animates a mirror flip using `motion/base` — content re-flows in the new direction.
3. Language state persists to secure storage; applied at every app boot before first render.
4. No restart required. `I18nManager.forceRTL` is set on first-run; subsequent runtime toggles use a custom RTL context (below).

**Implementation contract** (for engineers):
- Wrap the app in a `<DirectionProvider>` that reads user preference.
- All layout primitives use logical properties.
- Any component that must know direction reads it from context, not from `I18nManager` directly (allows runtime toggle without restart).

---

## 6.8 RTL-Specific Design Adjustments

Some screens are hand-tuned rather than auto-mirrored:

### Athlete Detail
- Hero avatar remains centered (culturally neutral).
- Metric ordering: Primary metric at visual start (right in RTL) — matches natural reading entry point.

### Chat (AI Coach)
- User bubbles at end (visual right for LTR, left for RTL).
- Assistant bubbles at start.
- Timestamps and reactions mirror.
- Input field send-arrow icon mirrors.

### Timeline
- Time flows top-to-bottom (unchanged). Event connector line sits on the start edge (right in RTL).
- Event icons remain on the start edge; content flows toward the end edge.

### Reports (see also Doc 09)
- Print layout has fully separate templates per language — not just mirrored.
- Page numbers, footers, and citations conform to each language's conventions.

---

## 6.9 Mixed-Direction Content

When Arabic prose contains English terms (common in science):
- Use Unicode bidirectional isolate marks around Latin runs.
- Example: `تم قياس VO₂ Max عند 58.2 ml/kg/min` — the Latin "VO₂ Max" runs LTR inside the RTL sentence flawlessly.
- All prose components use a Bidi-aware text renderer.

---

## 6.10 Iconography in RTL

- Icons flagged as `directional: true` in the icon manifest auto-mirror.
- Icons with numbers baked in (e.g., "1st place") are provided as two SVG files, one per direction.
- Home, settings, and other symmetric icons remain as-is.

---

## 6.11 Cultural Considerations

- **Colors:** Green is universally positive in both cultures. Red is universally negative. No cultural remapping required.
- **Imagery:** Any human imagery must show culturally diverse athletes. When Arabic-language marketing surfaces appear, avoid imagery of individuals in athletic wear that may be culturally sensitive (opt for equipment/action shots).
- **Holidays:** Recognize both Gregorian and Islamic holidays for reminders/scheduling (Ramadan-aware training load recommendations, Eid, etc.).
- **Right-hand bias:** In Arabic RTL, primary CTAs sit at the end (visual left) — matching the natural reading exit point.

---

## 6.12 Content Ops

- All strings live in `i18n/en.json` and `i18n/ar.json` with shared keys.
- No string is hard-coded in the codebase.
- Placeholders use ICU MessageFormat for pluralization, gender, and interpolation.
- Arabic supports 6 plural forms (zero, one, two, few, many, other) — all handled.
- Translations are reviewed by a professional bilingual sports scientist, not machine-translated alone.

---

## 6.13 Bilingual QA Checklist (Per Screen)

- [ ] Layout mirrors correctly (no left/right leaks).
- [ ] All strings translated; no fallback English visible.
- [ ] Line-heights adequate for Arabic diacritics.
- [ ] Numerals render per user preference.
- [ ] Icons mirror where appropriate.
- [ ] Charts render correctly with mirrored labels but chronological data.
- [ ] Mixed-direction text renders without brokenness.
- [ ] Language toggle round-trip works instantly.
- [ ] Reports export correctly in the current language.
- [ ] Voice-over reads correctly in the current language.

---

_See Doc 07 for how the language toggle animates._

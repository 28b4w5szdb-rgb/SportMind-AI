# 03 · Component Library

> Every reusable component in the app — specification, states, tokens, and RTL notes. This is the atomic contract engineers implement against.

Components are grouped: **Foundations · Inputs · Data Display · Navigation · Feedback · Domain-Specific (SportMind).**

Each component defines: `Purpose · Anatomy · Variants · States · Tokens · RTL Behavior · Accessibility · Do/Don't`.

---

## FOUNDATIONS

### 3.1 Button
- **Purpose:** Trigger an action.
- **Variants:** `primary`, `secondary`, `tertiary` (ghost), `destructive`, `success`.
- **Sizes:** `sm` (32), `md` (40), `lg` (48), `xl` (56).
- **States:** default · hover · pressed · focus · disabled · loading.
- **Anatomy:** [icon-leading?] [label] [icon-trailing?] [spinner-on-loading]
- **Tokens:** `radius/sm`, `space/3` (icon gap), `heading/md` label.
- **RTL:** Leading/trailing icons swap sides automatically.
- **A11y:** min tap 44 pt; `aria-busy` when loading; label mandatory (no icon-only without `aria-label`).
- **Do:** one primary per screen. **Don't:** stack 3+ primary buttons vertically.

### 3.2 Icon Button
- Square 40×40 default; radius `md`; identical states to Button.
- Requires visible tooltip on long-press (mobile) or hover (web).

### 3.3 Chip / Tag
- **Variants:** `neutral`, `info`, `success`, `warning`, `danger`, `research`.
- **Sizes:** `sm` (24), `md` (28).
- **Selectable variant:** toggles filled/outlined state.
- Used for: filter facets, metric deltas, athlete tags, biomarker flags.

### 3.4 Badge
- Small circular or pill status marker. Number badge (max `99+`) or dot.
- Positioned top-end of parent (mirrors in RTL).

### 3.5 Avatar
- Sizes: 24, 32, 40, 56, 80.
- Fallback: initials on `brand/primary/500` tint block.
- Group avatar overlap: −8 px per subsequent.

### 3.6 Divider
- 0.5 px hairline in `neutral/200`. Never 1 px. Never colored.

---

## INPUTS

### 3.7 Text Field
- **Anatomy:** [label] [leading-icon?] [input] [trailing-icon/action?] [helper-text | error-text]
- **States:** empty · filled · focused · error · disabled · read-only.
- **Height:** 48 (md), 56 (lg).
- **Label:** floating (Material 3 style) — sits inside at rest, moves to top on focus/value.
- **Error state:** border `danger`, helper-text replaced by error message with icon.
- **RTL:** text alignment flips; leading icon becomes right side.
- **A11y:** label always associated; error read by screen reader; supports voice dictation.

### 3.8 Search Field
- Text field variant with leading `ic-search-20`, trailing clear `ic-close-16`.
- Debounced 220 ms. Shows spinner in trailing slot while loading.

### 3.9 Text Area
- Auto-grows 2→8 lines. Character counter bottom-end (mirrors).

### 3.10 Number Field (Scientific)
- Right-aligned tabular numerals.
- Unit suffix chip (e.g., `kg`, `ml/kg/min`).
- Stepper controls (+/−) on tablet/web.

### 3.11 Select / Dropdown
- Rendered as bottom sheet on mobile, popover on tablet+.
- Supports search, multi-select, and grouped options.

### 3.12 Date / Time Picker
- Native wheel picker on iOS; Material picker on Android.
- Localized calendar: Gregorian default, Hijri toggle available (Doc 06).

### 3.13 Segmented Control
- 2–5 segments. Sliding indicator with `motion/base`.
- RTL: segment order mirrors.

### 3.14 Toggle Switch
- iOS-style. Instant feedback with haptic.

### 3.15 Checkbox / Radio
- 20 px hit box 44. Radio group supports keyboard arrow nav.

### 3.16 Slider
- Range slider variant for age/percentile filters.
- Value label appears on drag (bubble tooltip).

### 3.17 File / Image Uploader
- Drop zone + tap-to-browse. Shows thumbnail grid on multi.
- Progress ring on each item. Failure state with retry.

---

## DATA DISPLAY

### 3.18 Data Card (Signature Component)
- **Anatomy:** [overline caption] [hero metric] [delta chip] [micro-sparkline 60×20] [footer meta]
- **Variants:** `default`, `alert` (warning border), `research` (iris tint), `locked` (subscription gate).
- Tap → detail sheet with full chart & context.
- Long-press → quick actions (share, export, pin to dashboard).

### 3.19 List Row
- 56 px min height. Anatomy: [leading (avatar/icon)] [primary text + secondary text] [trailing (chip/value/chevron)].
- Swipe actions: leading = archive; trailing = delete/edit (RTL mirrors).

### 3.20 Table (Tablet & Web Primary)
- Sticky first column (athlete name).
- Column: sort, resize, hide.
- Row: hover highlight, selectable checkbox.
- Cell types: text, number (tabular), chip, sparkline, avatar, action menu.
- Zebra striping optional (off by default).
- Empty state built into table body.

### 3.21 Chart Library (via Victory Native / Reanimated)
Standard chart primitives with unified theming:
- **Line chart** — time-series metrics (HR, VO₂ over sessions).
- **Area chart** — training load, sleep stages.
- **Bar chart** — comparative metrics, team rankings.
- **Radar chart** — athlete profile (5–8 axes).
- **Scatter plot** — research mode correlations.
- **Heatmap** — training week intensity, HRV recovery.
- **Gauge / Ring** — single KPI (VO₂ percentile, confidence).

All charts:
- Support RTL axis mirroring (English left-origin, Arabic right-origin).
- Have hover/press crosshair with data callout.
- Animate on mount with `motion/slow` stagger.
- Include unit label, legend, and download-as-PNG action.

### 3.22 Sparkline
- 60×20 or 80×24. No axes. Optional endpoint dot.

### 3.23 Progress Ring / Confidence Ring
- 3 px stroke. Value in center (tabular). Color-shifts along a value → color mapping.

### 3.24 Progress Bar
- 4 px height default; 8 px in reports. Determinate / indeterminate.

### 3.25 Stat Group
- 2–4 stats in a row with hairline dividers. Used in header summaries.

### 3.26 Timeline
- Vertical event feed with time marker column.
- Group headers by day / week / month.

---

## NAVIGATION

### 3.27 Tab Bar (Bottom)
- 5 tabs max. 48 px tall + safe area.
- Active state: filled icon, brand color, label bold.
- Center action variant (FAB embedded) for `+ Add`.

### 3.28 App Bar (Top)
- Compact (44) or Large (96) — collapses on scroll.
- Slots: [leading nav] [title] [trailing actions]. Sync-pulse bar sits directly under.

### 3.29 Segmented Tabs (In-screen)
- Horizontal scroll if > 4 tabs. Underline indicator animates.

### 3.30 Breadcrumbs (Tablet/Web only)
- Chevron separators (RTL mirrors).

### 3.31 Side Drawer / Rail
- Rail (72 px) on tablet portrait. Full drawer on tap. Anchors to start edge (mirrors in RTL).

### 3.32 Bottom Sheet
- Snap points: peek (25%), half (50%), full (95%).
- Drag handle (32×4 rounded).
- Backdrop scrim dims to 0.5 opacity.

### 3.33 Modal / Dialog
- Max width 480. Radius `xl`. Two-button footer (start = cancel, end = confirm) — mirrors in RTL.

---

## FEEDBACK

### 3.34 Toast / Snackbar
- 4 s auto-dismiss (except errors — dismiss-only).
- Position: bottom-center mobile, bottom-end web.
- Leading icon indicates type. Optional undo action.

### 3.35 Banner
- Inline dismissible notification at top of screen. Types: info, success, warning, danger, research.

### 3.36 Empty State
- **Anatomy:** [illustration 120] [title] [description] [primary CTA] [secondary link]
- Illustrations: line-art, single accent color, matching current theme.
- Never uses generic "nothing here" — always contextual.

### 3.37 Loading Skeleton
- Shimmer animation `motion/slow` loop.
- Structural match to real content (never a generic spinner in-place of layout).

### 3.38 Spinner
- 3 sizes. Only used in-button, in-search, or as inline data refresh indicator.

### 3.39 Error State
- **Anatomy:** [icon] [title] [message] [retry button] [secondary: contact support]
- Includes error code (small caption) for support triage.

### 3.40 Success State
- Checkmark ring animates on entry. Auto-navigates after 2 s or on tap-continue.

### 3.41 Confirmation Dialog
- Destructive actions require typed confirmation for irreversible ops.

---

## DOMAIN-SPECIFIC (SportMind)

### 3.42 Athlete Card
- Avatar + name + team badge + primary metric (readiness score) + status chip (injury/available/tapering).

### 3.43 Metric Delta Chip
- Shows change vs. baseline with arrow. Colored by direction relative to "better" for that metric.

### 3.44 Explain Chip (`ⓘ Why?`)
- Attached to any AI-generated statement.
- Tap → sheet with: model used, input features, SIE calculation trace, SKB citations, confidence score.

### 3.45 Confidence Ring
- Wraps any AI recommendation. Value 0–100. Color: red<40, amber 40-70, green >70.

### 3.46 SIE Formula Card
- Displays a calculation with: name, formula (LaTeX-rendered), inputs (editable), output, reference citation.

### 3.47 Sync Pulse Bar
- 3 px bar under app bar. States: `offline` (amber solid), `syncing` (blue pulsing), `synced` (transient teal, fades in 1s).

### 3.48 Language Toggle
- Segmented control `AR | EN` with live preview animation (see Doc 07).

### 3.49 RBAC Guard Wrapper
- Non-visual wrapper that hides/disables children based on role. When disabled, shows lock icon + tooltip explaining required permission.

### 3.50 Subscription Gate
- Overlay for locked premium features. Blur backdrop + upgrade CTA + feature preview.

### 3.51 Report Section Block
- Reusable print-safe block used in PDF export & in-app report preview.

### 3.52 Athlete Timeline Event
- Timeline row for test/injury/note events. Icon color-coded by event type.

---

## COMPONENT INVENTORY SUMMARY

| Category | Count |
|---|---|
| Foundations | 6 |
| Inputs | 11 |
| Data Display | 9 |
| Navigation | 7 |
| Feedback | 8 |
| Domain-Specific | 11 |
| **Total** | **52 components** |

Every component must ship with: Figma frame · code implementation · Storybook (or equivalent) entry · a11y test · RTL screenshot · dark mode screenshot.

---

_See Doc 04 for how these components compose into screens._

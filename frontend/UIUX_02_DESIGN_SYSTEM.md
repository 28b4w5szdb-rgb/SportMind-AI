# 02 · Design System (Tokens)

> The atomic layer. Every value here is a token. No hard-coded colors or spacings anywhere in the app.

---

## 2.1 Color Palette

### 2.1.1 Brand Core

| Token | Hex | Usage |
|---|---|---|
| `brand/primary/500` | `#0A6CFF` | Primary actions, links, active tabs (Signal Blue) |
| `brand/primary/600` | `#0056D6` | Pressed state |
| `brand/primary/400` | `#3B8AFF` | Hover / focus ring |
| `brand/accent/500` | `#00C2A8` | Success signal, positive delta (Vital Teal) |
| `brand/accent/warm` | `#FF7A3D` | Attention, moderate risk (Ember) |

### 2.1.2 Neutral Ramp (Light)

| Token | Hex | Usage |
|---|---|---|
| `neutral/0` | `#FFFFFF` | Canvas / surface base |
| `neutral/50` | `#F7F8FA` | Elevated surface |
| `neutral/100` | `#EEF0F4` | Divider, subtle fill |
| `neutral/200` | `#DDE1E8` | Border default |
| `neutral/400` | `#9AA1AE` | Placeholder, disabled text |
| `neutral/600` | `#5A6373` | Secondary text |
| `neutral/800` | `#252932` | Primary text |
| `neutral/900` | `#0E1116` | High-emphasis text |

### 2.1.3 Neutral Ramp (Dark)

| Token | Hex | Usage |
|---|---|---|
| `neutral/0` | `#0A0C10` | Canvas base |
| `neutral/50` | `#12151B` | Elevated surface |
| `neutral/100` | `#1A1E26` | Card surface |
| `neutral/200` | `#242A34` | Divider |
| `neutral/400` | `#5C6472` | Placeholder |
| `neutral/600` | `#A0A7B4` | Secondary text |
| `neutral/800` | `#E4E7EC` | Primary text |
| `neutral/900` | `#F7F8FA` | High-emphasis text |

### 2.1.4 Semantic Colors

| Semantic | Light | Dark | Meaning |
|---|---|---|---|
| `success` | `#12B76A` | `#32D583` | Optimal range, sync complete |
| `warning` | `#F79009` | `#FDB022` | Approaching threshold |
| `danger` | `#F04438` | `#F97066` | Injury risk, red flag |
| `info` | `#0BA5EC` | `#36BFFA` | Neutral information |
| `research` | `#7A5AF8` | `#A48AFB` | Research mode indicator (Iris) |

### 2.1.5 Data Visualization Palette (Colorblind-safe)

Ordered categorical palette, tested for Deuteranopia & Protanopia:

1. `#0A6CFF` Signal Blue
2. `#00C2A8` Vital Teal
3. `#F79009` Amber
4. `#7A5AF8` Iris
5. `#F04438` Coral
6. `#12B76A` Mint
7. `#FF7A3D` Ember
8. `#94A3B8` Neutral

Gradients for continuous scales (VO₂, HRV heatmaps): Viridis-derived, 9 stops.

---

## 2.2 Typography

### 2.2.1 Type Families

| Role | Latin (LTR) | Arabic (RTL) |
|---|---|---|
| Display | `SF Pro Display` / `Inter` | `IBM Plex Sans Arabic` |
| Body | `SF Pro Text` / `Inter` | `IBM Plex Sans Arabic` |
| Numeric | `SF Mono` / `JetBrains Mono` (tabular) | Same (Latin figures) |
| Reading (Reports) | `Newsreader` (serif) | `Amiri` (serif) |

### 2.2.2 Type Scale

| Token | Size / Line | Weight | Use |
|---|---|---|---|
| `display/xl` | 40 / 48 | 700 | Onboarding hero |
| `display/lg` | 32 / 40 | 700 | Screen title (large) |
| `heading/xl` | 24 / 32 | 600 | Section header |
| `heading/lg` | 20 / 28 | 600 | Card title |
| `heading/md` | 17 / 24 | 600 | List header |
| `body/lg` | 17 / 26 | 400 | Reading body |
| `body/md` | 15 / 22 | 400 | Default body |
| `body/sm` | 13 / 18 | 400 | Secondary body |
| `caption` | 12 / 16 | 500 | Labels, meta |
| `overline` | 11 / 14 | 600 (tracked) | Small caps section marks |
| `metric/xl` | 44 / 52 | 700 tabular | Hero metric |
| `metric/lg` | 28 / 36 | 700 tabular | Card metric |
| `metric/md` | 20 / 26 | 600 tabular | Inline metric |

### 2.2.3 Arabic-Specific Adjustments

- Arabic runs 1.15× line-height on every scale (diacritics need headroom).
- Font-weight offset −50 for Arabic (600 EN ≈ 550 AR for optical match).
- No italics in Arabic (there is no true italic in Arabic script).
- Letter-spacing = 0 in Arabic (kerning is handled by the font).

---

## 2.3 Iconography

- **Family:** Custom SportMind Icon Set derived from Phosphor / Lucide, 1.5 px stroke, rounded joins.
- **Sizes:** 16, 20, 24, 32, 48 (all optically aligned to 24 grid).
- **Style:** Outline default, filled for active tab / selected.
- **RTL-aware icons:** Arrows, chevrons, back buttons auto-mirror. Play/pause, science glyphs do NOT mirror.
- **Naming:** `ic-{domain}-{name}-{state}` e.g. `ic-athlete-add-24`.

---

## 2.4 Spacing (8-pt grid)

| Token | Value | Common Use |
|---|---|---|
| `space/0` | 0 | reset |
| `space/1` | 2 | hairline |
| `space/2` | 4 | icon-text gap |
| `space/3` | 8 | inline gap |
| `space/4` | 12 | tight stack |
| `space/5` | 16 | default gap |
| `space/6` | 20 | card padding |
| `space/7` | 24 | section gap |
| `space/8` | 32 | major section |
| `space/9` | 40 | screen padding vertical |
| `space/10` | 48 | hero spacing |
| `space/11` | 64 | oversized |

**Screen edge inset:** 20 px phone, 32 px tablet, 40 px web.

---

## 2.5 Radii

| Token | Value | Use |
|---|---|---|
| `radius/xs` | 4 | Chip, tag |
| `radius/sm` | 8 | Button, input |
| `radius/md` | 12 | Card small |
| `radius/lg` | 16 | Card default |
| `radius/xl` | 20 | Sheet, modal |
| `radius/2xl` | 28 | Feature hero |
| `radius/full` | 999 | Pills, avatars |

---

## 2.6 Elevation & Shadow

| Token | Light Mode | Dark Mode |
|---|---|---|
| `elev/0` | none | none |
| `elev/1` | `0 1 2 rgba(16,24,40,.04)` | `0 1 2 rgba(0,0,0,.4)` |
| `elev/2` | `0 4 8 rgba(16,24,40,.06)` | `0 4 8 rgba(0,0,0,.5)` |
| `elev/3` | `0 12 24 rgba(16,24,40,.08)` | `0 12 24 rgba(0,0,0,.6)` |
| `elev/4` | `0 24 48 rgba(16,24,40,.10)` | `0 24 48 rgba(0,0,0,.7)` |

Dark mode additionally uses subtle **inner border** `1px rgba(255,255,255,.04)` on all elevated surfaces for depth.

---

## 2.7 Glassmorphism System

Used sparingly, only in these contexts:
1. Bottom sheets over content-rich screens
2. Floating action controls above charts
3. Tab bar in immersive mode (video review)
4. Onboarding hero card

**Recipe:**
- Background: `rgba(neutral/0, 0.72)` light / `rgba(neutral/50, 0.68)` dark
- Backdrop blur: 24 px (fallback: solid fill at 0.94 opacity)
- Border: `1px rgba(255,255,255,0.10)` inner
- Shadow: `elev/3`

**Never** use glass on: data tables, forms, or any screen with dense text.

---

## 2.8 Motion Tokens (see Doc 07 for full system)

| Token | Duration | Curve | Use |
|---|---|---|---|
| `motion/instant` | 100 ms | linear | Ripple |
| `motion/fast` | 180 ms | ease-out | Hover, press |
| `motion/base` | 260 ms | `cubic(0.2, 0.8, 0.2, 1)` | Sheet, tab |
| `motion/slow` | 420 ms | `cubic(0.25, 0.1, 0.25, 1)` | Route |
| `motion/spring` | — | `stiffness 220, damping 26` | Physics |

---

## 2.9 Z-Index Ladder

| Layer | Z | Use |
|---|---|---|
| Base | 0 | Content |
| Sticky | 10 | Sticky headers |
| Overlay Dim | 100 | Scrim |
| Sheet | 200 | Bottom sheet |
| Modal | 300 | Dialogs |
| Toast | 400 | Snackbars |
| Tooltip | 500 | Coach marks |
| Debug | 999 | Dev overlays |

---

## 2.10 Accessibility Constraints

- All text/background pairs pass **WCAG AA (4.5:1)** minimum; hero text passes **AAA (7:1)**.
- Minimum tap target: **44×44 pt iOS / 48×48 dp Android**.
- Focus ring: `2px brand/primary/400` outer + `2px offset` on all interactive elements.
- Dynamic Type: all scales support up to `xxxLarge` — layout must not clip.
- Motion respects `prefers-reduced-motion` — full spec in Doc 07.

---

_See Doc 03 for how these tokens compose into components._

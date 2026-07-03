# 05 · Responsive Design

> One design language. Three form factors. Zero compromise.

---

## 5.1 Breakpoints

| Name | Range | Primary Target |
|---|---|---|
| `xs` | 0 – 359 | Small phones (fallback) |
| `sm` | 360 – 599 | Phones (default design target) |
| `md` | 600 – 899 | Small tablets, phone landscape, foldables (folded) |
| `lg` | 900 – 1199 | Tablets, foldables (unfolded), small laptops |
| `xl` | 1200 – 1599 | Web dashboard default |
| `2xl` | ≥ 1600 | Large displays, control rooms |

Design is **mobile-first**; each breakpoint reveals more density and secondary panels.

---

## 5.2 Layout Grid

| Breakpoint | Columns | Gutter | Outer Margin |
|---|---|---|---|
| `sm` | 4 | 16 | 20 |
| `md` | 8 | 20 | 24 |
| `lg` | 12 | 24 | 32 |
| `xl` | 12 | 24 | 40 |
| `2xl` | 12 | 32 | 64 |

Max content width: **1440 px** (centered above `2xl`).

---

## 5.3 Adaptive Patterns

### 5.3.1 Navigation
| Form Factor | Pattern |
|---|---|
| Phone | Bottom Tab Bar (5 items) + Modal More |
| Foldable (folded) | Bottom Tab Bar |
| Foldable (unfolded) / Tablet portrait | Rail (72 px) + top App Bar |
| Tablet landscape / Web | Persistent Side Nav (240 px) + top App Bar + Breadcrumbs |

### 5.3.2 Master–Detail
- **Phone:** Push navigation — list, then detail.
- **Tablet+:** Split view — list on start (35%), detail on end (65%). Detail supports "pop out to new window" on web.

### 5.3.3 Data Density
- **Phone:** Data Cards stack vertically (1 column).
- **Tablet portrait:** 2 columns.
- **Tablet landscape / Web:** 3–4 columns; tables prioritized over cards for scanning.

### 5.3.4 Modals & Sheets
- **Phone:** Bottom Sheet.
- **Tablet:** Centered Modal (max 640 wide).
- **Web:** Side Drawer (end-anchored) for context tasks; Modal for confirmation only.

### 5.3.5 Charts
- **Phone:** Single chart per screen, full width, 260 tall.
- **Tablet:** 2-up small multiples possible; primary chart 360 tall.
- **Web:** Dashboard-style grid — user can rearrange (drag).

### 5.3.6 Forms
- **Phone:** Full-screen, one field per row.
- **Tablet+:** Two-column form layout, labels left of inputs (mirrors in RTL).

### 5.3.7 Tables
- **Phone:** Convert to List Rows (Doc 03 §3.19) — primary metric + chip.
- **Tablet+:** True Table with sticky first column + horizontal scroll if > 8 cols.
- **Web:** Column configurator, saved views per user.

---

## 5.4 Foldable-Specific

- Detect fold state via `react-native-foldable` (or platform APIs where available).
- **Table-top mode** (partially folded, hinge horizontal): controls in upper half, chart in lower half.
- **Book mode** (fully unfolded): true two-pane experience.
- Never let a hinge bisect a data card — respect posture safe-areas.

---

## 5.5 Web Dashboard (Future — architecturally reserved)

A future companion web dashboard renders the same design system with additional patterns:

### 5.5.1 Layout
```
┌────────────────────────────────────────────────────┐
│  [Logo]  Nav Nav Nav        Search  ⚙  🔔  Avatar │  ← Top bar
├──────┬─────────────────────────────────────────────┤
│      │                                             │
│ Side │   Breadcrumbs                               │
│ Nav  │   Page Title            [+ Primary Action]  │
│      │   ─────────────────────────────────────     │
│      │   [KPI grid — 4 across]                     │
│      │                                             │
│      │   [Chart panel | Chart panel]               │
│      │                                             │
│      │   [Data table]                              │
│      │                                             │
└──────┴─────────────────────────────────────────────┘
```

### 5.5.2 Web-only capabilities
- Keyboard shortcuts (⌘K palette, per-screen hotkeys).
- Multi-select drag operations on athletes.
- Print-optimized report views.
- Larger data exports (Excel > 100k rows).
- Multi-window athlete comparison (up to 4 side-by-side).

---

## 5.6 Density Modes (Per-User Preference)

- **Comfortable** (default): 8-pt spacing scale as-is.
- **Compact**: −20% vertical spacing, tighter list rows (48 → 40 px). Preferred by scientists on tablets.
- **Spacious**: +25% spacing. Accessibility-friendly.

---

## 5.7 Orientation Handling

- Phone: portrait-locked for main app; landscape for **video review** and **fullscreen chart** only.
- Tablet: both orientations fully supported — layouts explicitly designed for each.
- Rotation animation: `motion/slow` with mass to avoid jarring re-layout.

---

## 5.8 Dynamic Type & Zoom

- All layouts must survive **200% dynamic type**.
- No horizontal scrolling introduced by dynamic type.
- Tables collapse to list form when a single row's dynamic-typed height > 96.

---

## 5.9 Testing Matrix

| Device | Purpose |
|---|---|
| iPhone SE (375) | Small phone lower bound |
| iPhone 15 Pro (393) | Design target |
| iPhone 15 Pro Max (430) | Large phone |
| Pixel 8 (412) | Android baseline |
| iPad mini (744) | Tablet portrait small |
| iPad Pro 11 (834) | Tablet standard |
| iPad Pro 12.9 (1024) | Tablet large |
| Galaxy Z Fold 5 (344/674) | Foldable dual |
| Web 1440 | Dashboard default |

---

_See Doc 06 for how each layout responds to RTL._

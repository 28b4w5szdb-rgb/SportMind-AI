# 04 · Screen Wireframes

> Every screen. Every state. Every flow.

Each screen entry defines:
1. **Purpose & User Goal**
2. **Layout** (ASCII wireframe)
3. **Components used** (references Doc 03)
4. **Navigation in/out**
5. **The 4 States**: Empty · Loading · Error · Success (+ populated where applicable)

**Legend:**  
`[AppBar]` = top app bar · `[TabBar]` = bottom tab bar · `[FAB]` = floating action · `[SP]` = Sync Pulse bar

---

## 🧭 Screen Map Overview

```
Auth Flow
 ├─ Splash
 ├─ Onboarding (3 steps)
 ├─ Sign In
 ├─ Sign Up (Role + Org)
 ├─ Forgot Password
 └─ Verify Email

Main App (Tabs)
 ├─ Dashboard (role-based, see Doc 08)
 ├─ Athletes
 │   ├─ List
 │   ├─ Detail (Overview · Biometrics · Tests · Timeline · Notes)
 │   └─ Add/Edit Athlete
 ├─ AI Coach
 │   ├─ Chat
 │   ├─ Recommendations
 │   └─ Explanation Sheet
 ├─ Performance Lab
 │   ├─ Tests List
 │   ├─ Test Detail (Chart-heavy)
 │   ├─ New Test Wizard
 │   └─ Calculator (SIE Formulas)
 └─ More
     ├─ Research Mode
     ├─ Reports
     ├─ Team Management
     ├─ Knowledge Center
     ├─ Settings (Profile, Preferences, Language, Subscription)
     └─ Help & Support
```

---

## 🚪 AUTH FLOW

### 4.1 Splash
**Purpose:** Establish brand, wait for boot (max 1.2 s).  
**Layout:**  
```
┌─────────────────────┐
│                     │
│                     │
│      [logo]         │
│     SportMind AI    │
│                     │
│                     │
│    [progress bar]   │
└─────────────────────┘
```
**States:** Only loading. If boot > 3 s → transition to onboarding-error banner.

### 4.2 Onboarding (3 steps)
**Purpose:** Communicate 3 core value props (Data · AI · Bilingual).  
**Layout per step:**  
```
┌─────────────────────┐
│  [Skip →]           │
│                     │
│    [illustration]   │
│                     │
│  Headline           │
│  Supporting copy    │
│                     │
│  ● ○ ○  (dots)      │
│  [Continue]         │
│  [Language: AR|EN]  │
└─────────────────────┘
```
**Interactions:** Swipe or button. Language toggle persists.

### 4.3 Sign In
**Layout:**  
```
[Logo small]
Welcome back
Sign in to continue

[Email field]
[Password field]
[Forgot password?]  <-- end aligned

[Sign In button — primary lg full-width]
──────── or ────────
[Continue with Google]
[Continue with Apple]

New here? [Create account]
```
**States:**
- **Empty:** placeholders shown, button disabled.
- **Loading:** button spinner, inputs disabled.
- **Error:** inline error under fields; banner for network.
- **Success:** button turns teal check → navigate to dashboard.

### 4.4 Sign Up (Role Selector)
**Purpose:** Capture role at signup — drives entire UX.  
**Layout:**  
```
Who are you?
[  Athlete       →]
[  Coach         →]
[  Sports Scientist →]
[  Researcher    →]
[  Organization Admin →]
[  Student       →]

[Continue]
```
Then: personal details → org affiliation → verify email.

### 4.5 Forgot Password / 4.6 Verify Email
Standard flows — reuse Sign In layout with adjusted copy. Verify Email polls every 5 s and shows a resend CTA after 30 s.

---

## 🏠 MAIN APP — TABS

### 4.7 Dashboard
Role-specific — see **Doc 08** for all 5 dashboards.

**Common frame:**
```
[AppBar large — greeting + avatar + notifications]
[SP: sync pulse]

[Hero KPI row — 2–3 Data Cards]
[Quick Actions row — 4 icon buttons]
[Insights feed — AI-generated cards with Explain Chips]
[Recent activity list]

[TabBar]
```

### 4.8 Athletes — List
**Layout:**  
```
[AppBar: "Athletes" · search · filter]
[SP]
[Segmented: All | My Squad | Injured | Tapering]

[Search field — inline]
[FlashList of Athlete Rows]
  Each row: Avatar · Name · Team · Readiness ring · Status chip · chevron

[FAB: + Add Athlete]
[TabBar]
```
**States:**
- **Empty:** "No athletes yet — Add your first athlete" illustration + CTA.
- **Loading:** 8 skeleton rows.
- **Error:** banner "Couldn't load — Retry".
- **Populated:** infinite scroll, pull-to-refresh.

### 4.9 Athlete Detail — Overview
**Layout (scrollable):**  
```
[AppBar collapsible — avatar hero at 96, name, team, edit]
[SP]
[Tabs: Overview · Biometrics · Tests · Timeline · Notes]

── Overview ──
[Stat group: Age · Height · Weight · Position]
[Data Card: Readiness (ring + delta)]
[Data Card: Training Load 7d (area chart)]
[Data Card: Injury Risk (Confidence Ring + Explain Chip)]
[Data Card: Latest VO₂ Max (metric + sparkline)]
[Recent Timeline (5 items) → View all]
```

### 4.10 Athlete Detail — Biometrics
Radar chart + editable body composition table + growth over time chart (for youth athletes).

### 4.11 Athlete Detail — Tests
FlashList of test entries. Filter by test type. Each row → 4.14.

### 4.12 Athlete Detail — Timeline
Vertical Timeline component grouped by month. Event types color-coded: test (blue), injury (red), note (neutral), milestone (teal), assessment (iris).

### 4.13 Add / Edit Athlete (Full-screen form)
Multi-step form: Identity → Biometrics → Sport/Team → Medical → Consent.  
Each step has progress dots at top. Draft auto-saves offline.

### 4.14 Performance Lab — Test Detail
**Layout:** Chart-first.  
```
[AppBar: Test name · date · export]
[SP]
[Hero chart — full width, 320 tall]
[Legend + unit toggle]
[SIE Formula Card explaining metric]
[AI Interpretation card + Explain Chip + Confidence Ring]
[Related tests (horizontal scroll of Data Cards)]
[Export/Share row]
```

### 4.15 Performance Lab — New Test Wizard
5 steps: Select Test → Select Athlete(s) → Configure params → Enter/Import data → Review & Save.  
Supports CSV import + Bluetooth device connect (future).

### 4.16 Calculator (SIE Formulas)
**Layout:**  
```
[AppBar: Calculator · search formulas]
[Category chips: VO₂ · HR Zones · Body Comp · Power · Nutrition]
[Grid/list of SIE Formula Cards]

-- On tap --
[Formula Card expanded]
  Formula (LaTeX)
  Inputs (Number Fields with units)
  → Compute
  Output metric + interpretation
  [ⓘ Reference: Journal citation]
  [Save result to athlete]
```

### 4.17 AI Coach — Chat
**Layout:**  
```
[AppBar: AI Coach · model badge ("Claude 4.5") · new chat]
[SP]
[Chat scroll]
  User bubble (end-aligned, mirrors)
  Assistant bubble (start-aligned):
     Message text
     [Explain Chip]
     [Confidence Ring]
     [Source citations chips]
     [Save to athlete note] [Copy]

[Input row (glass sheet):
   [attach] [text field grows to 4 lines] [voice] [send]
]
```
**States:**
- **Empty:** Welcome card with 4 suggested prompts (role-tailored).
- **Loading:** Assistant bubble shows animated 3-dot with confidence-forming ring.
- **Error:** Bubble with retry.
- **Streaming:** Text renders token-by-token, capped at 60 fps.

### 4.18 AI Coach — Recommendations
List of AI insights with actions: `Accept · Modify · Reject`. Each has Explain Chip.

### 4.19 Explanation Sheet (opens from any Explain Chip)
Bottom sheet, snap 50 → full:  
```
How we got this answer
  Model: Claude Sonnet 4.5
  Confidence: 87%

Inputs used
  · Athlete VO₂ Max: 58.2 ml/kg/min (from Test #442)
  · HR at threshold: 172 bpm
  · Training load 7d: 5,240 AU

SIE calculations
  · Karvonen Formula → HR zones
  · ACWR = 1.32 (moderate load)

Sources (SKB citations)
  · Bourdon et al. (2017) IJSPP
  · Gabbett (2016) BJSM

[Report inaccuracy]  [Copy trace]
```

### 4.20 More Tab (Menu)
```
[Profile card at top]
[Research Mode →]
[Reports →]
[Team Management →]
[Knowledge Center →]
[Settings →]
[Subscription →]
[Help & Support →]
[Sign out]
[App version + build]
```

### 4.21 Research Mode
Special tinted app-bar (iris). Advanced filters + statistical toolkit + export raw data + citation manager. Requires role ≥ Researcher.

### 4.22 Reports
**Layout:**  
```
[AppBar: Reports · new]
[Segmented: My Reports | Templates | Shared]
[Grid of report cards — thumbnail + title + date + language flag]
[FAB: + New Report]
```
Detail = full-screen report preview (Doc 09).

### 4.23 Team Management
List of teams → team detail (member list, roles, permissions). RBAC-gated actions.

### 4.24 Knowledge Center
Searchable library of validated sports science articles, formulas, and protocols. Filter by discipline. Bookmark & offline-save.

### 4.25 Settings
Standard sectioned list:  
Profile · Preferences (language, units, theme) · Notifications · Sync & Storage · Privacy · Subscription · About.

### 4.26 Language Preference (in Settings or from anywhere)
Preview card shows current screen mirrored on toggle press. Live-swaps without restart (Doc 06).

---

## 🎭 UNIVERSAL SCREEN STATES

Every screen implements four visual states. This is a QA acceptance matrix.

| State | Trigger | Visual | Copy | Action |
|---|---|---|---|---|
| **Empty** | No data available | Illustration + title + description + CTA | Contextual: "Add your first athlete" | Primary CTA to create |
| **Loading** | Data fetch in progress | Skeleton matching layout OR spinner in place | Nothing (silent) | None (progress implicit) |
| **Error** | Fetch failed / network | Icon + title + message + error code | "We couldn't load this — check your connection" | Retry primary + Contact support secondary |
| **Success** | Data present | Content rendered | — | — |

Special states:
- **Offline:** Sync Pulse bar amber; banner top: "You're offline — changes will sync automatically."
- **Permission gated:** Lock overlay with role required and "Request Access".
- **Subscription gated:** Blur backdrop + upgrade CTA (Doc 03 §3.50).

---

_Continues in Doc 05 for responsive adaptation and Doc 08 for role dashboards._

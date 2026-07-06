# SportMind AI — Official Brand Guide (v0.9 Alpha)

> Product identity reference for design, engineering, and marketing.  
> **Do not replace the SportMind AI identity** — refine and apply consistently.

---

## 1. Brand Essence

| Attribute | Definition |
|-----------|------------|
| **Name** | SportMind AI |
| **Positioning** | AI-powered sports science platform for professional staff |
| **Audience** | Head coaches, S&C coaches, sport scientists, physios, performance analysts |
| **Tone** | Professional, evidence-based, confident, human-centered |
| **Personality** | Elite performance lab meets intelligent assistant |

### Taglines

| Language | Tagline |
|----------|---------|
| English | AI-Powered Sports Science Platform |
| Arabic | منصة علوم رياضية مدعومة بالذكاء الاصطناعي |

---

## 2. Logo System

### Primary mark (keep)

The current identity is **strong and consistent**:

- **Mark**: Rounded square with blue→teal gradient (`#0066FF` → `#0D9488`)
- **Icon**: Ionicons `fitness` (white) — athletic, universal, already deployed app-wide
- **Wordmark**: `SportMind AI` — `SportMind` semibold + `AI` in primary color

### Recommended refinements (not replacement)

1. Always use the shared `BrandLogo` / `BrandMark` components — never one-off gradients
2. Minimum clear space: 8pt around the mark
3. Minimum mark size: 40×40pt (touch contexts), 72×72pt (auth/splash)
4. Do not rotate, skew, or apply non-brand gradients to the mark

### Logo variants

| Variant | Usage |
|---------|--------|
| `BrandMark` | App icon, splash, favicon, compact headers |
| `BrandLogo` | Auth, onboarding, marketing surfaces |
| `BrandLogo showWordmark={false}` | Splash center mark |

---

## 3. Color Palette

### Primary

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Primary | `#0066FF` | `#3B82F6` | CTAs, links, active nav |
| Secondary | `#0D9488` | `#2DD4BF` | Accents, gradients, success-adjacent |
| Accent | `#F97316` | `#FB923C` | Energy highlights, alerts |

### Semantic

| Token | Light | Usage |
|-------|-------|-------|
| Success | `#10B981` | Completed, ready, positive trends |
| Warning | `#F59E0B` | Caution, moderate risk |
| Danger | `#EF4444` | Errors, high risk, destructive |
| Info | `#0EA5E9` | Informational banners |

### Neutral (Slate scale)

`#F8FAFC` · `#F1F5F9` · `#E2E8F0` · `#94A3B8` · `#475569` · `#0F172A`

Backgrounds: Light `#FFFFFF` / Dark `#0F172A`  
Surfaces: Light `#FFFFFF` / Dark `#1E293B`

---

## 4. Typography

| Role | Style | Size | Weight |
|------|-------|------|--------|
| Display Hero | Splash, onboarding hero | 48–64 | Bold |
| H1 | Screen titles | 28 | Bold |
| H2 | Section titles | 24 | Semibold |
| H3 | Card titles | 20 | Semibold |
| Body | Content | 16 | Regular |
| Body SM | Secondary | 14 | Regular |
| Label | Section headers | 12 | Medium, uppercase |
| Overline | Meta labels | 10 | Semibold, uppercase |
| Stat / Number | KPIs | 24–48 | Bold, tabular nums |

**Fonts**: System stack with Arabic support via `useTypography()` (Noto Sans Arabic for AR).

---

## 5. Spacing (8pt grid)

| Token | Value | Usage |
|-------|-------|-------|
| tight | 4 | Icon gaps |
| inline | 8 | Inline elements |
| stack | 16 | Vertical stacks |
| section | 24 | Section gaps |
| screen | 16 | Horizontal screen padding |

---

## 6. Corner Radius

| Token | Value | Component |
|-------|-------|-----------|
| lg | 12 | Inner chips |
| xl | 16 | Buttons, inputs |
| 2xl | 20 | Cards |
| 3xl | 24 | Hero cards |
| full | 9999 | Badges, avatars |

---

## 7. Components

### Buttons

- **Primary**: Gradient or solid primary, white text, min height 44pt
- **Secondary**: Teal outline or filled secondary
- **Ghost**: Text-only for tertiary actions
- **Disabled**: 48% opacity

### Cards

- Elevated: white/dark surface + shadow `sm`/`md`
- Outlined: 1px border `#E2E8F0` / `#475569`
- Filled: tertiary background for stats

### Icons

- Library: **Ionicons** (outline for nav, filled for active/semantic)
- Size: 20 nav · 24 actions · 44 empty states
- Color: semantic or `textTertiary` for decorative

### Illustration style

- Gradient surfaces + soft geometric shapes
- No clip-art; use icon + data visualization
- Charts use brand series colors (blue, teal, orange, green, purple, red)

---

## 8. Motion & Animation

| Duration | Usage |
|----------|-------|
| 120ms | Micro-interactions |
| 220ms | State transitions |
| 320ms | Screen transitions |
| 480ms | Splash fade-out |
| 1200ms | Skeleton shimmer loop |

**Principles**: Purposeful, not decorative. Respect reduced motion. RTL mirrors horizontal motion.

---

## 9. Feedback States

| State | Component | Visual |
|-------|-----------|--------|
| Loading | `LoadingSpinner`, `Skeleton` | Primary spinner / shimmer |
| Empty | `EmptyState` | Neutral icon circle |
| Error | `ErrorState` | Danger tint circle |
| Success | `SuccessState`, `SuccessBanner` | Success tint |

---

## 10. Platform Assets

| Asset | Path | Spec |
|-------|------|------|
| App icon | `assets/images/icon.png` | 1024×1024 |
| Adaptive icon | `assets/images/adaptive-icon.png` | 1024×1024 |
| Splash (native) | `assets/images/splash-image.png` | Centered mark |
| Favicon | `assets/images/favicon.png` | Web |

Native splash background: `#FFFFFF` (light) / `#0F172A` (dark)

---

## 11. First 30 Seconds (User Journey)

1. **Native splash** — brand mark on brand background  
2. **Branded splash screen** — tagline EN/AR, subtle pulse animation  
3. **Onboarding** (first launch) — 4 slides: what / who / features / start  
4. **Sign in** — professional auth with logo, tagline, language toggle  
5. **Dashboard** — command center greeting

---

*Last updated: Phase 5G — v0.9 Alpha freeze*

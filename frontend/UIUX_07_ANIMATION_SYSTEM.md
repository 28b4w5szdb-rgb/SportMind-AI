# 07 · Animation System

> Motion communicates causality, hierarchy, and continuity. Never delight alone.

---

## 7.1 Motion Philosophy

1. **Motion is meaning.** Every animation answers "where did this come from?" or "where did it go?"
2. **Physical, not decorative.** Prefer spring physics with realistic mass. Avoid arbitrary keyframes.
3. **Fast is felt; slow is seen.** Micro-interactions ≤ 200 ms; transitions ≤ 500 ms; ambient ≤ 1.5 s loops.
4. **Respect Reduced Motion.** If the user enables reduced motion, cross-fade and instant snap replace all translation and scale.
5. **60 fps is the floor, 120 fps is the ceiling.** No animation may drop below 60. All are Reanimated worklets on the UI thread.

---

## 7.2 Motion Tokens (recap from Doc 02)

| Token | Duration | Curve | Purpose |
|---|---|---|---|
| `motion/instant` | 100 ms | linear | Ripple, focus ring |
| `motion/fast` | 180 ms | ease-out | Hover, press, chip select |
| `motion/base` | 260 ms | `cubic(0.2, 0.8, 0.2, 1)` | Sheet, tab, segment |
| `motion/slow` | 420 ms | `cubic(0.25, 0.1, 0.25, 1)` | Screen route, mirror flip |
| `motion/ambient` | 1200 ms | ease-in-out (loop) | Sync pulse, skeleton shimmer |
| `motion/spring/soft` | — | `stiffness 180, damping 22` | Card enter |
| `motion/spring/tight` | — | `stiffness 260, damping 28` | FAB, chip |
| `motion/spring/bouncy` | — | `stiffness 300, damping 18` | Success confirmation |

---

## 7.3 Page Transitions

### Push (default)
- Incoming screen enters from `end` edge with `motion/slow` cubic.
- Outgoing screen translates 30% toward `start` and dims 20%.
- Shared elements (e.g., athlete avatar) animate with `motion/spring/soft`.

### Modal (bottom sheet)
- Enters from bottom, 92% of screen height.
- Backdrop scrim fades 0 → 0.5 in `motion/base`.
- Drag handle draws attention with a subtle 2-tick nudge on first appearance.

### Modal (centered dialog — tablet/web)
- Fades in and scales from 0.96 → 1.0 with `motion/spring/tight`.

### Tab Switch
- Cross-fade + 8 px translate along the axis of travel with `motion/base`.
- The active tab indicator slides continuously (not jumps) between tabs.

### Language Mirror Flip
- Signature animation:
  1. Snapshot current screen.
  2. Snapshot flipped layout.
  3. Animate a 3D card flip (rotationY 0 → 180) with `motion/slow` and slight scale dip 1 → 0.96 → 1.
  4. Content itself doesn't flip — only the container. New content is composed with the new direction.
- On reduced motion → cross-fade only.

---

## 7.4 Micro-Interactions

### Button Press
- Scale 1.0 → 0.97 on press-down (`motion/fast`, spring).
- Scale back to 1.0 on release.
- Haptic: `impactLight` on iOS, equivalent on Android.

### Chip Selection
- Fill color animates in `motion/fast`.
- Border shrinks to 0 as fill grows.

### Input Focus
- Label floats up (translateY −16, scale 0.85) in `motion/fast`.
- Border color transitions to focus tint.
- Focus ring fades in.

### Toggle Switch
- Thumb slides + 20 px in `motion/spring/tight`.
- Track color crossfades.
- Haptic `selection`.

### Segmented Control Slide
- Indicator translates continuously between segments in `motion/base`.

### Pull-to-Refresh
- Custom SportMind indicator: 3 dots that form a ring while pulling, then rotate while loading.
- Haptic `impactMedium` on threshold.

### Swipe Actions
- Follow finger 1:1 during drag.
- Snap open or closed with `motion/spring/soft`.
- Reveal color intensifies as user crosses the confirm threshold.

### Long Press
- Radial highlight expands from touch point.
- Haptic `impactMedium` on trigger (~500 ms hold).
- Context menu appears with scale 0.9 → 1.0 `motion/spring/tight`.

### Toast Entry
- Slides up 32 px + fades in `motion/base`.
- Dismisses by swipe down or auto-timer.

---

## 7.5 Loading Animations

### Skeleton Shimmer
- Gradient sweep left→right (mirrors in RTL) over the skeleton block.
- 1.5 s loop, `motion/ambient`.
- Skeleton blocks preserve exact layout of forthcoming content.

### Spinner
- 3 sizes (16, 24, 32). Continuous rotation `1.2 s linear`.
- Only used in-line (buttons, search, refresh).

### AI Streaming Indicator
- 3 dots pulse in sequence while AI is generating.
- Once tokens start streaming, replaced by streaming text with a soft caret blink.

### Confidence Ring Forming
- When an AI result arrives, the confidence ring animates from 0 → target value.
- Uses `motion/spring/soft`.
- Color interpolates through red→amber→green mapping.

### Sync Pulse Bar
- **Offline (amber):** solid, static.
- **Syncing (blue):** infinite horizontal shimmer `motion/ambient`.
- **Just synced (teal):** brief 800 ms full-bar highlight, then fades to invisible.

### Splash → App
- Logo scales from 0.9 → 1.0 with `motion/spring/soft`.
- Then fades to canvas as dashboard renders.

---

## 7.6 Chart Animations

### Mount
- Line/area: draw-on stroke from start to end, `motion/slow`.
- Bar: bars grow from 0 → value, staggered 40 ms each, `motion/spring/soft`.
- Radar: axes fade in, then polygon fills.
- Ring/Gauge: sweep from 0 → value with color interpolation.

### Interaction
- Crosshair follows touch/cursor with `motion/instant` (near-instantaneous — feels attached).
- Tooltip callout: fades in over `motion/fast`.
- Selection highlight: point scales 1.0 → 1.4 with `motion/spring/tight`.

### Range Change / Zoom
- Axes rescale smoothly, `motion/base`.
- Data points re-position via LERP; no jarring redraws.

### Legend Toggle
- Series fades out (opacity 1 → 0.15) while remaining series scale numerically.
- Y-axis rescales smoothly to new bounds.

---

## 7.7 Gesture Behavior

### Card / Sheet Drag
- Follows finger with spring resistance beyond bounds.
- Snap to nearest snap-point on release.

### Swipe-Back Navigation (iOS)
- Edge swipe pops screen with 1:1 follow.
- Rubber-band if not committed.

### Pinch Zoom (Charts)
- Two-finger pinch scales x-axis extent.
- Debounced rescale to avoid jitter.

### Chart Scrub
- Single-finger horizontal drag on a time-series shows the crosshair and updates the callout live.

### Long-Press Reorder (Dashboard cards, Web)
- Card lifts on long-press (scale 1.02, shadow to `elev/4`).
- Position updates in real time.
- Drop with `motion/spring/soft`.

### Photo/Report Preview
- Pinch-to-zoom, double-tap to fit, drag to dismiss (velocity threshold).

---

## 7.8 Notification & Feedback Motion

### Success (e.g., saved athlete)
- Checkmark stroke animates draw-on (`motion/spring/bouncy`).
- Green pulse ring emanates once.
- Haptic `notificationSuccess`.

### Error
- Field shakes horizontally 4 px × 3 with `motion/spring/bouncy`.
- Border color changes to danger.
- Haptic `notificationError`.

### Warning
- Icon does a subtle 6° wobble twice.

---

## 7.9 Ambient / Idle Motion

Only two ambient motions exist app-wide:
1. **Sync pulse bar shimmer** — 1.2 s loop while syncing.
2. **Confidence ring breathing** — an idle AI insight card has a 3 s soft breath (opacity 0.85 → 1.0) on the confidence ring only.

No other ambient motion is permitted. Idle screens are still.

---

## 7.10 Reduced Motion Mode

When `prefers-reduced-motion` is on OR user setting `Motion: Reduced` is enabled:

- All translations → cross-fades.
- All spring animations → instant.
- All ambient loops → paused.
- Language mirror flip → cross-fade.
- Chart mount → instant render.
- Haptics remain.

The app must feel *equally polished* in reduced-motion mode — just still.

---

## 7.11 Haptic System

| Interaction | Haptic |
|---|---|
| Button press | impactLight |
| Toggle / select | selection |
| Confirm / save | notificationSuccess |
| Delete / destructive confirm | impactHeavy |
| Error | notificationError |
| Pull-to-refresh trigger | impactMedium |
| Long-press context menu | impactMedium |
| Chart data point hit | selection |

Disabled if user turns off system haptics.

---

## 7.12 Performance Budget

- All animations run on the UI thread (Reanimated 3 worklets).
- Frame budget: ≤ 8 ms per frame at 60 fps; ≤ 4 ms at 120 fps.
- No JS-thread animations for anything user-perceivable.
- Chart animations offload to Skia where possible.

---

_See Doc 08 for how motion informs each role's dashboard._

# 05 · Performance Standards

> Measurable targets, enforced in CI. Slowness is a bug.

---

## 5.1 Performance Budget (Non-Negotiable)

| Metric | Target | Ceiling |
|---|---|---|
| Cold start (splash → first paint) | ≤ 1.5 s | 2.5 s |
| Time-to-interactive (dashboard) | ≤ 2.5 s | 4.0 s |
| Warm start | ≤ 500 ms | 1.0 s |
| Route transition | ≤ 300 ms perceived | 500 ms |
| Frame rate (mainstream device) | 60 fps | never < 55 fps |
| Frame rate (flagship device) | 120 fps | never < 110 fps |
| List scroll (1000 rows) | 60 fps steady | 55 fps floor |
| Memory (peak, phone) | ≤ 200 MB | 300 MB |
| Bundle size (release) | ≤ 8 MB | 12 MB |
| API p95 latency | ≤ 400 ms | 800 ms |
| AI Coach first-token latency | ≤ 1.2 s | 2.5 s |

CI performance benchmarks run nightly on reference devices (see §5.8).

---

## 5.2 Frame Rate Rules

1. **All animations run on the UI thread** via Reanimated 3 worklets.
2. **No JS-thread animations** for user-perceptible motion.
3. **Long lists use FlashList**, never `FlatList` or `ScrollView` mapping.
4. **`react-native-screens` enabled** everywhere (fewer JS bridges).
5. **`InteractionManager.runAfterInteractions`** used for post-navigation work.

---

## 5.3 Startup Performance

### Cold Start Budget
- Splash → first meaningful paint ≤ 1.5 s on iPhone 13 / Pixel 6.
- Splash duration ≤ 800 ms unless boot legitimately requires longer.
- Font preload uses `expo-font.useFonts` with a fallback to system fonts if load > 800 ms.

### Techniques
- **Hermes engine** enabled (default in modern Expo).
- **Deferred providers**: Sentry, analytics initialize after first paint via `useEffect`.
- **Route lazy loading**: Expo Router supports lazy route modules by default — use dynamic imports where necessary.
- **Pre-render dashboard** while auth session loads.
- **Skeleton on first tab** so users see structure instantly.

---

## 5.4 Memory Management

### Rules
- Peak memory ≤ 200 MB on mainstream devices.
- Long lists must virtualize (FlashList).
- Images must be sized (never full-res thumbnails).
- Video preview uses `expo-video` with proper release on unmount.
- No memory leaks: subscriptions and timers must be cleaned in `useEffect` returns.

### Detection
- Use React DevTools Profiler + Flipper Memory tools.
- Xcode Instruments (iOS) and Android Studio Profiler for release builds.
- Automated leak checks in E2E: assert steady memory after 10 navigation cycles.

---

## 5.5 Lazy Loading

### What to lazy-load
- Heavy libraries (chart libs, PDF renderer, camera).
- Route modules for rarely-visited screens (Research Mode, Reports).
- Modal-only components (loaded when the modal opens).

### How
```ts
const ReportsScreen = lazy(() => import('@/features/reports/screens/ReportsScreen'));
```
Wrap with `<Suspense fallback={<Skeleton />} />`.

---

## 5.6 Code Splitting / Bundle Hygiene

- Metro bundler tree-shakes unused exports.
- Avoid barrel exports (`export * from`) that import entire subtrees.
- Import icons individually, not whole icon-set bundles.
- Analyze bundle with `expo-atlas` in CI monthly.

### Enforced Bans
- ❌ `moment.js` (use `date-fns` + `date-fns-tz`).
- ❌ `lodash` full — import specific functions (`import isEqual from 'lodash/isEqual'`).
- ❌ Multiple chart libraries — pick one (Victory Native + Skia).

---

## 5.7 Image Optimization

### Rules
- Athlete avatars stored at 3 sizes: 40, 80, 240.
- Server pre-computes sizes via image CDN or on-upload processing.
- Client requests the size it will render (never downloads full-res for a thumbnail).
- Use `expo-image` (built-in caching, better than `Image`).
- Report exports embed images at print DPI (300).

### Formats
- **WebP** preferred where supported.
- **HEIC** decoded server-side to JPEG for compatibility.
- SVG for icons and simple illustrations.

---

## 5.8 Reference Devices for Benchmarks

| Tier | Device |
|---|---|
| Flagship | iPhone 15 Pro (iOS latest), Pixel 8 Pro (Android 14) |
| Mainstream | iPhone 13 (iOS latest−1), Pixel 6a (Android 13) |
| Low-end | iPhone SE 3rd gen, Galaxy A34 |

CI runs nightly on all six via device farms (BrowserStack / Sauce Labs) or Firebase Test Lab.

---

## 5.9 Backend Performance

| Metric | Target |
|---|---|
| Request handler p50 | ≤ 80 ms |
| Request handler p95 | ≤ 400 ms |
| DB query p95 | ≤ 60 ms |
| Cold container start (containerized) | ≤ 3 s |
| SIE calculation avg | ≤ 20 ms |
| LLM proxy first-token | ≤ 1.2 s |

Use async endpoints for I/O bound work. Use connection pooling for MongoDB.

---

## 5.10 Performance Regression Guardrails

- Every PR runs a **micro-benchmark suite**: cold start, dashboard render, athletes-list scroll.
- If any metric regresses > 10%, CI fails.
- Sentry Performance dashboards tracked release-over-release.
- Any regression > 5% in production triggers on-call alert.

---

## 5.11 Common Anti-Patterns

- ❌ Fetching in `useEffect` without cleanup.
- ❌ Inline arrow functions in `renderItem` (breaks memoization).
- ❌ Unmemoized selectors over Zustand stores.
- ❌ Storing derived state (compute on demand).
- ❌ Rendering >100 items without virtualization.
- ❌ Loading full-page images inside a chat bubble.
- ❌ Blocking JS thread with heavy sync operations.

---

_Continue to Chapter 06 — Security._

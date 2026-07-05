/**
 * SportMind AI - Premium Spacing System
 * 8pt grid system with comprehensive layout values
 */

// Core spacing values following 8pt grid
const spacingScale = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '28': 112,
  '32': 128,
  '40': 160,
  '48': 192,
  '56': 224,
  '64': 256,
} as const;

/** Semantic aliases used by components (map to 8pt grid). */
const spacingSemantic = {
  xs: spacingScale['1'],
  sm: spacingScale['2'],
  md: spacingScale['4'],
  lg: spacingScale['6'],
  xl: spacingScale['8'],
  '2xl': spacingScale['10'],
} as const;

export const spacing = {
  ...spacingScale,
  ...spacingSemantic,
} as const;

// Border radius values - soft, modern curves
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  '5xl': 32,
  full: 9999,
} as const;

// Shadow presets for elevation system
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 32,
    elevation: 12,
  },
  inner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
  },
} as const;

// Common layout dimensions
export const layout = {
  // Screen padding
  /** @deprecated Prefer screenPaddingHorizontal — kept for legacy call sites. */
  screenPadding: spacing['4'],
  screenPaddingHorizontal: spacing['4'],
  screenPaddingTop: spacing[6],
  screenPaddingBottom: spacing[8],

  // Container widths
  containerSm: 640,
  containerMd: 768,
  containerLg: 1024,
  containerXl: 1280,
  container2xl: 1536,
  containerMaxWidth: 1280,

  // Touch targets (minimum 44pt for accessibility)
  minTouchTarget: 44,
  touchTargetSmall: 36,
  touchTargetMedium: 48,
  touchTargetLarge: 56,

  // Header heights
  headerHeight: 64,
  headerHeightCompact: 56,
  tabBarHeight: 80,
  tabBarHeightCompact: 64,

  // Card dimensions
  cardMinHeight: 120,
  cardMaxWidth: 400,

  // Avatar sizes
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 48,
  avatarXl: 64,
  avatar2xl: 80,
  avatar3xl: 96,
  avatar4xl: 128,

  // Icon sizes
  iconXs: 14,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 28,
  icon2xl: 32,
  icon3xl: 40,
  icon4xl: 48,

  // Button heights
  buttonHeightSm: 32,
  buttonHeightMd: 40,
  buttonHeightLg: 48,
  buttonHeightXl: 56,

  // Input heights
  inputHeightSm: 36,
  inputHeightMd: 44,
  inputHeightLg: 52,

  // List item heights
  listItemHeightSm: 48,
  listItemHeightMd: 64,
  listItemHeightLg: 80,
  listItemHeightXl: 96,

  // Sidebar width (for web/tablet)
  sidebarWidth: 280,
  sidebarWidthCompact: 80,

  // Modal sizes
  modalWidthSm: 320,
  modalWidthMd: 480,
  modalWidthLg: 640,
  modalMaxHeight: 680,

  // Breakpoints for responsive design
  breakpointSm: 640,
  breakpointMd: 768,
  breakpointLg: 1024,
  breakpointXl: 1280,
  breakpoint2xl: 1536,
} as const;

// Animation/transition timing
export const timing = {
  instant: 0,
  fast: 100,
  normal: 200,
  slow: 300,
  slower: 500,
  slowest: 700,
} as const;

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  overlay: 90,
  max: 9999,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
export type BorderRadius = typeof borderRadius;
export type BorderRadiusKey = keyof typeof borderRadius;
export type Shadows = typeof shadows;
export type ShadowsKey = keyof typeof shadows;
export type Layout = typeof layout;

// Helper to get spacing value
export function getSpacing(key: SpacingKey): number {
  return spacing[key];
}

// Helper to get border radius value
export function getBorderRadius(key: BorderRadiusKey): number {
  return borderRadius[key];
}

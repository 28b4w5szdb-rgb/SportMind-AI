/**
 * SportMind AI - Premium Color System
 * Comprehensive color palette with dark/light mode support
 * Following design requirements for sports/performance applications
 */

export const colors = {
  // Light Mode Colors
  light: {
    // Primary - Electric Blue (energetic, performance-focused)
    primary: '#0066FF',
    primaryLight: '#3385FF',
    primaryDark: '#0052CC',
    primary50: '#E6F0FF',
    primary100: '#CCE0FF',
    primary200: '#99C2FF',
    primary300: '#66A3FF',
    primary400: '#3385FF',
    primary500: '#0066FF',
    primary600: '#0052CC',
    primary700: '#003D99',
    primary800: '#002966',
    primary900: '#001433',

    // Secondary - Athletic Teal (modern, professional)
    secondary: '#0D9488',
    secondaryLight: '#14B8A6',
    secondaryDark: '#0F766E',
    secondary50: '#E6FAF8',
    secondary100: '#CCF5F2',
    secondary200: '#99EBE5',
    secondary300: '#66E1D8',
    secondary400: '#33D7CA',
    secondary500: '#0D9488',
    secondary600: '#0F766E',
    secondary700: '#0D5D5D',
    secondary800: '#0A4747',
    secondary900: '#073030',

    // Accent - Energetic Orange (motivation, energy)
    accent: '#F97316',
    accentLight: '#FB923C',
    accentDark: '#EA580C',
    accent50: '#FFF4ED',
    accent100: '#FFE9D6',
    accent200: '#FFD4AD',
    accent300: '#FFBA85',
    accent400: '#FFA05C',
    accent500: '#F97316',
    accent600: '#EA580C',
    accent700: '#C2410C',
    accent800: '#9A3412',
    accent900: '#7C2D12',

    // Success - Vibrant Green
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    success50: '#ECFDF5',
    success100: '#D1FAE5',

    // Warning - Amber
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    warning50: '#FFFBEB',
    warning100: '#FEF3C7',

    // Error - Coral Red
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',
    error50: '#FEF2F2',
    error100: '#FEE2E2',

    // Info - Sky Blue
    info: '#0EA5E9',
    infoLight: '#38BDF8',
    infoDark: '#0284C7',
    info50: '#F0F9FF',
    info100: '#E0F2FE',

    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',

    // Surface (Cards, Panels)
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceOverlay: 'rgba(255, 255, 255, 0.95)',

    // Text
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textDisabled: '#CBD5E1',
    textInverse: '#FFFFFF',

    // Borders
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',

    // Divider
    divider: '#E2E8F0',

    // Overlay
    overlay: 'rgba(15, 23, 42, 0.5)',
    overlayLight: 'rgba(15, 23, 42, 0.1)',

    // Gradient stops
    gradientStart: '#0066FF',
    gradientEnd: '#0D9488',
  },

  // Dark Mode Colors
  dark: {
    // Primary - Brighter Blue for dark backgrounds
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    primary50: '#1E3A5F',
    primary100: '#1E40AF',
    primary200: '#1D4ED8',
    primary300: '#2563EB',
    primary400: '#3B82F6',
    primary500: '#60A5FA',
    primary600: '#93C5FD',
    primary700: '#BFDBFE',
    primary800: '#DBEAFE',
    primary900: '#EFF6FF',

    // Secondary - Bright Teal
    secondary: '#2DD4BF',
    secondaryLight: '#5EEAd4',
    secondaryDark: '#14B8A6',
    secondary50: '#134E4A',
    secondary100: '#115E59',
    secondary200: '#0F766E',
    secondary300: '#0D9488',
    secondary400: '#2DD4BF',
    secondary500: '#5EEAd4',
    secondary600: '#99F6E4',
    secondary700: '#CCFBF1',
    secondary800: '#E6FAF8',
    secondary900: '#F0FDFA',

    // Accent - Vibrant Orange
    accent: '#FB923C',
    accentLight: '#FDBA74',
    accentDark: '#F97316',
    accent50: '#431407',
    accent100: '#7C2D12',
    accent200: '#9A3412',
    accent300: '#C2410C',
    accent400: '#EA580C',
    accent500: '#F97316',
    accent600: '#FB923C',
    accent700: '#FDBA74',
    accent800: '#FED7AA',
    accent900: '#FFF4ED',

    // Success
    success: '#34D399',
    successLight: '#6EE7B7',
    successDark: '#10B981',
    success50: '#052E16',
    success100: '#14532D',

    // Warning
    warning: '#FBBF24',
    warningLight: '#FCD34D',
    warningDark: '#F59E0B',
    warning50: '#422006',
    warning100: '#713F12',

    // Error
    error: '#F87171',
    errorLight: '#FCA5A5',
    errorDark: '#EF4444',
    error50: '#450A0A',
    error100: '#7F1D1D',

    // Info
    info: '#38BDF8',
    infoLight: '#7DD3FC',
    infoDark: '#0EA5E9',
    info50: '#0C4A6E',
    info100: '#155E75',

    // Backgrounds
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',

    // Surface (Cards, Panels)
    surface: '#1E293B',
    surfaceElevated: '#334155',
    surfaceOverlay: 'rgba(30, 41, 59, 0.95)',

    // Text
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#64748B',
    textDisabled: '#475569',
    textInverse: '#0F172A',

    // Borders
    border: '#334155',
    borderLight: '#1E293B',
    borderDark: '#475569',

    // Divider
    divider: '#334155',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Gradient stops
    gradientStart: '#3B82F6',
    gradientEnd: '#2DD4BF',
  },
};

// Gradient presets
export const gradients = {
  primary: ['#0066FF', '#0D9488'],
  success: ['#10B981', '#059669'],
  energy: ['#F97316', '#EA580C'],
  cool: ['#0EA5E9', '#3B82F6'],
  warm: ['#F97316', '#EF4444'],
} as const;

// Chart colors for data visualization
export const chartColors = {
  light: {
    series1: '#0066FF',
    series2: '#0D9488',
    series3: '#F97316',
    series4: '#10B981',
    series5: '#8B5CF6',
    series6: '#EF4444',
    grid: '#E2E8F0',
    axis: '#94A3B8',
  },
  dark: {
    series1: '#3B82F6',
    series2: '#2DD4BF',
    series3: '#FB923C',
    series4: '#34D399',
    series5: '#A78BFA',
    series6: '#F87171',
    grid: '#334155',
    axis: '#64748B',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type Colors = typeof colors.light;

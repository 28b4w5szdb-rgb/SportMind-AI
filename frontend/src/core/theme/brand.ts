/**
 * SportMind AI — Official Brand Tokens (Phase 5G)
 * Canonical reference for product identity. See docs/BRAND_GUIDE.md for full guide.
 */

export const brandIdentity = {
  name: 'SportMind AI',
  nameArabic: 'سبورت مايند AI',
  taglineEn: 'AI-Powered Sports Science Platform',
  taglineAr: 'منصة علوم رياضية مدعومة بالذكاء الاصطناعي',
} as const;

/** Primary brand gradient — performance blue → athletic teal */
export const brandGradients = {
  primary: ['#0066FF', '#0D9488'] as const,
  primaryDark: ['#3B82F6', '#2DD4BF'] as const,
  splashLight: ['#FFFFFF', '#F8FAFC', '#E6F0FF'] as const,
  splashDark: ['#0F172A', '#1E293B', '#0F172A'] as const,
} as const;

export const brandColors = {
  primary: '#0066FF',
  secondary: '#0D9488',
  accent: '#F97316',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const;

export const brandMotion = {
  splashFadeMs: 480,
  splashHoldMs: 900,
  onboardingSlideMs: 320,
  skeletonShimmerMs: 1200,
  stateEnterMs: 220,
} as const;

export const ONBOARDING_STORAGE_KEY = '@sportmind/onboarding_complete';

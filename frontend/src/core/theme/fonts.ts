/**
 * SportMind AI — Font Family Tokens
 *
 * These map the abstract typographic roles from UIUX Doc 02 §2.2.1 into
 * concrete platform font names. Consumers should use
 * `useTypography()` from `@/src/core/theme` to pick the correct family
 * for the active language automatically.
 *
 * Note: font *names* here MUST match the keys registered in
 * `use-app-fonts.ts`. If a font failed to load (network issue), React
 * Native falls back to the system font. That's intentional and safe.
 */

import { Platform } from 'react-native';

export const FONT_FAMILIES = {
  latin: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    systemFallback: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  },
  arabic: {
    regular: 'IBMPlexSansArabic-Regular',
    medium: 'IBMPlexSansArabic-Medium',
    semibold: 'IBMPlexSansArabic-SemiBold',
    bold: 'IBMPlexSansArabic-Bold',
    systemFallback: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  },
} as const;

export type FontWeightKey = 'regular' | 'medium' | 'semibold' | 'bold';

export function resolveFontFamily(script: 'latin' | 'arabic', weight: FontWeightKey): string {
  return FONT_FAMILIES[script][weight];
}

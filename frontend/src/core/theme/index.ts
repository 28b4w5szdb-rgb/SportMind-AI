/**
 * SportMind AI - Main Theme Export
 * Central theme configuration with light/dark mode support
 */

import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors, gradients, chartColors, ColorScheme, Colors } from './colors';
import { typography, Typography, fontSizes, fontWeights, lineHeights, letterSpacing } from './typography';
import { spacing, borderRadius, shadows, layout, timing, zIndex, getShadows, Spacing, Shadows } from './spacing';
import { designTokens } from './designTokens';

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: typeof borderRadius;
  shadows: Shadows;
  layout: typeof layout;
  timing: typeof timing;
  zIndex: typeof zIndex;
  gradients: typeof gradients;
  chartColors: (typeof chartColors)['light'] | (typeof chartColors)['dark'];
  tokens: typeof designTokens;
  isDark: boolean;
}

/**
 * Hook to get current theme based on system color scheme
 */
export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return useMemo(
    () => ({
      colors: isDark ? colors.dark : colors.light,
      typography,
      spacing,
      borderRadius,
      shadows: getShadows(isDark),
      layout,
      timing,
      zIndex,
      gradients,
      chartColors: isDark ? chartColors.dark : chartColors.light,
      tokens: designTokens,
      isDark,
    }),
    [isDark]
  );
}

// Export individual theme parts
export {
  colors,
  gradients,
  chartColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  timing,
  zIndex,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  designTokens,
  getShadows,
};

// Bilingual typography hook (Latin vs Arabic)
export { useTypography } from './useTypography';
export type { AppTypography } from './useTypography';
export { FONT_FAMILIES, resolveFontFamily } from './fonts';
export type { FontWeightKey } from './fonts';

// Export types
export type { ColorScheme, Colors, Typography, Spacing, Shadows };

/**
 * SportMind AI - Main Theme Export
 * Central theme configuration with light/dark mode support
 */

import { useColorScheme } from 'react-native';
import { colors, ColorScheme, Colors } from './colors';
import { typography, Typography, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, borderRadius, shadows, layout, Spacing, BorderRadius, Shadows } from './spacing';

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  layout: typeof layout;
  isDark: boolean;
}

/**
 * Hook to get current theme based on system color scheme
 */
export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    colors: isDark ? colors.dark : colors.light,
    typography,
    spacing,
    borderRadius,
    shadows,
    layout,
    isDark,
  };
}

// Export individual theme parts
export { colors, typography, spacing, borderRadius, shadows, layout, fontSizes, fontWeights, lineHeights };

// Export types
export type { ColorScheme, Colors, Typography, Spacing, BorderRadius, Shadows };

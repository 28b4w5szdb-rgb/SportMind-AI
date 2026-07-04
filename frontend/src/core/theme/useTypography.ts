/**
 * SportMind AI — Typography Hook
 *
 * Resolves the correct font family (Latin vs Arabic) based on the active
 * language from DirectionProvider, and returns a set of ready-to-use
 * TextStyle objects keyed by the design-system scale.
 *
 * Usage:
 *   const t = useTypography();
 *   <Text style={t.h1}>Hello</Text>
 */

import { useMemo } from 'react';
import type { TextStyle } from 'react-native';

import { useDirection } from '@/src/providers/DirectionProvider';
import { FONT_FAMILIES, type FontWeightKey } from './fonts';
import { fontSizes, lineHeights } from './typography';

type TypoStyle = TextStyle;

export interface AppTypography {
  displayLarge: TypoStyle;
  displayMedium: TypoStyle;
  displaySmall: TypoStyle;
  h1: TypoStyle;
  h2: TypoStyle;
  h3: TypoStyle;
  h4: TypoStyle;
  bodyLarge: TypoStyle;
  body: TypoStyle;
  bodySmall: TypoStyle;
  label: TypoStyle;
  labelLarge: TypoStyle;
  caption: TypoStyle;
  captionBold: TypoStyle;
  button: TypoStyle;
  buttonSmall: TypoStyle;
}

function buildTypography(isRTL: boolean): AppTypography {
  const script = isRTL ? 'arabic' : 'latin';
  const family = FONT_FAMILIES[script];

  const withFamily = (weight: FontWeightKey, size: number, lh: number): TypoStyle => ({
    fontFamily: family[weight],
    fontSize: size,
    lineHeight: Math.round(size * lh),
    // Arabic diacritics need more headroom (UIUX Doc 06 §6.4).
    writingDirection: isRTL ? 'rtl' : 'ltr',
  });

  const arLineBoost = isRTL ? 0.15 : 0; // +15% for AR
  const relaxed = lineHeights.normal + arLineBoost;
  const tight = lineHeights.tight + (isRTL ? 0.1 : 0);

  return {
    displayLarge: {
      ...withFamily('bold', fontSizes['6xl'], tight),
      letterSpacing: isRTL ? 0 : -0.5,
    },
    displayMedium: {
      ...withFamily('bold', fontSizes['5xl'], tight),
      letterSpacing: isRTL ? 0 : -0.5,
    },
    displaySmall: {
      ...withFamily('bold', fontSizes['4xl'], tight),
      letterSpacing: isRTL ? 0 : -0.5,
    },
    h1: {
      ...withFamily('bold', fontSizes['3xl'], tight),
      letterSpacing: isRTL ? 0 : -0.5,
    },
    h2: {
      ...withFamily('semibold', fontSizes['2xl'], tight),
      letterSpacing: isRTL ? 0 : -0.25,
    },
    h3: withFamily('semibold', fontSizes.xl, relaxed),
    h4: withFamily('semibold', fontSizes.lg, relaxed),
    bodyLarge: withFamily('regular', fontSizes.lg, relaxed),
    body: withFamily('regular', fontSizes.base, relaxed),
    bodySmall: withFamily('regular', fontSizes.sm, relaxed),
    label: {
      ...withFamily('medium', fontSizes.sm, relaxed),
      letterSpacing: isRTL ? 0 : 0.4,
    },
    labelLarge: {
      ...withFamily('medium', fontSizes.base, relaxed),
      letterSpacing: isRTL ? 0 : 0.4,
    },
    caption: withFamily('regular', fontSizes.xs, relaxed),
    captionBold: withFamily('semibold', fontSizes.xs, relaxed),
    button: {
      ...withFamily('semibold', fontSizes.base, tight),
      letterSpacing: isRTL ? 0 : 0.3,
    },
    buttonSmall: {
      ...withFamily('semibold', fontSizes.sm, tight),
      letterSpacing: isRTL ? 0 : 0.3,
    },
  };
}

export function useTypography(): AppTypography {
  const { isRTL } = useDirection();
  return useMemo(() => buildTypography(isRTL), [isRTL]);
}

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
import { fontSizes, letterSpacing, lineHeights } from './typography';

type TypoStyle = TextStyle;

export interface AppTypography {
  displayLarge: TypoStyle;
  displayMedium: TypoStyle;
  displaySmall: TypoStyle;
  h1: TypoStyle;
  h2: TypoStyle;
  h3: TypoStyle;
  h4: TypoStyle;
  h5: TypoStyle;
  h6: TypoStyle;
  bodyLarge: TypoStyle;
  body: TypoStyle;
  bodySmall: TypoStyle;
  /** Alias matching static `theme.typography.bodySm`. */
  bodySm: TypoStyle;
  label: TypoStyle;
  labelLarge: TypoStyle;
  caption: TypoStyle;
  captionMd: TypoStyle;
  captionBold: TypoStyle;
  overline: TypoStyle;
  button: TypoStyle;
  buttonSmall: TypoStyle;
  numberDisplay: TypoStyle;
  numberLarge: TypoStyle;
  numberMedium: TypoStyle;
  number: TypoStyle;
  numberSm: TypoStyle;
  statValue: TypoStyle;
  statLabel: TypoStyle;
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

  const withNumbers = (weight: FontWeightKey, size: number, lh: number): TypoStyle => ({
    ...withFamily(weight, size, lh),
    fontVariant: ['tabular-nums'],
  });

  const arLineBoost = isRTL ? 0.15 : 0;
  const relaxed = lineHeights.normal + arLineBoost;
  const tight = lineHeights.tight + (isRTL ? 0.1 : 0);
  const snug = lineHeights.snug + (isRTL ? 0.05 : 0);

  return {
    displayLarge: {
      ...withFamily('bold', fontSizes['6xl'], tight),
      letterSpacing: isRTL ? 0 : letterSpacing.tight,
    },
    displayMedium: {
      ...withFamily('bold', fontSizes['5xl'], tight),
      letterSpacing: isRTL ? 0 : letterSpacing.tight,
    },
    displaySmall: {
      ...withFamily('bold', fontSizes['4xl'], tight),
      letterSpacing: isRTL ? 0 : letterSpacing.tight,
    },
    h1: {
      ...withFamily('bold', fontSizes['3xl'], tight),
      letterSpacing: isRTL ? 0 : letterSpacing.tight,
    },
    h2: {
      ...withFamily('semibold', fontSizes['2xl'], tight),
      letterSpacing: isRTL ? 0 : letterSpacing.tight,
    },
    h3: withFamily('semibold', fontSizes.xl, relaxed),
    h4: withFamily('semibold', fontSizes.lg, relaxed),
    h5: withFamily('semibold', fontSizes.base, relaxed),
    h6: {
      ...withFamily('semibold', fontSizes.sm, relaxed),
      letterSpacing: isRTL ? 0 : letterSpacing.wide,
    },
    bodyLarge: withFamily('regular', fontSizes.lg, relaxed),
    body: withFamily('regular', fontSizes.base, relaxed),
    bodySmall: withFamily('regular', fontSizes.sm, relaxed),
    bodySm: withFamily('regular', fontSizes.sm, relaxed),
    label: {
      ...withFamily('medium', fontSizes.sm, relaxed),
      letterSpacing: isRTL ? 0 : letterSpacing.wide,
      textTransform: 'uppercase',
    },
    labelLarge: {
      ...withFamily('medium', fontSizes.base, relaxed),
      letterSpacing: isRTL ? 0 : letterSpacing.wide,
      textTransform: 'uppercase',
    },
    caption: withFamily('regular', fontSizes.xs, relaxed),
    captionMd: withFamily('regular', fontSizes.sm, relaxed),
    captionBold: withFamily('semibold', fontSizes.xs, relaxed),
    overline: {
      ...withFamily('semibold', fontSizes['2xs'], relaxed),
      letterSpacing: isRTL ? 0 : letterSpacing.widest,
      textTransform: 'uppercase',
    },
    button: {
      ...withFamily('semibold', fontSizes.base, tight),
      letterSpacing: isRTL ? 0 : letterSpacing.wide,
    },
    buttonSmall: {
      ...withFamily('semibold', fontSizes.sm, tight),
      letterSpacing: isRTL ? 0 : letterSpacing.wide,
    },
    numberDisplay: withNumbers('bold', fontSizes['5xl'], tight),
    numberLarge: withNumbers('bold', fontSizes['4xl'], tight),
    numberMedium: withNumbers('semibold', fontSizes['3xl'], snug),
    number: withNumbers('medium', fontSizes['2xl'], snug),
    numberSm: withNumbers('medium', fontSizes.xl, relaxed),
    statValue: {
      ...withNumbers('bold', fontSizes['6xl'], tight),
      letterSpacing: isRTL ? 0 : letterSpacing.tight,
    },
    statLabel: {
      ...withFamily('medium', fontSizes.sm, relaxed),
      letterSpacing: isRTL ? 0 : letterSpacing.wide,
      textTransform: 'uppercase',
    },
  };
}

export function useTypography(): AppTypography {
  const { isRTL } = useDirection();
  return useMemo(() => buildTypography(isRTL), [isRTL]);
}

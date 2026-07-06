/**
 * SportMind AI — Global Design Tokens (Phase 5A)
 * Single source of truth for reusable UI primitives.
 * Screens consume these via theme; do not duplicate magic numbers in features.
 */

import type { BorderRadiusKey } from './spacing';

export const designTokens = {
  /** 8pt grid — vertical rhythm between major sections */
  spacing: {
    section: 24,
    stack: 16,
    inline: 8,
    tight: 4,
    cardPadding: 16,
    cardPaddingLg: 24,
    screenHorizontal: 16,
  },

  /** Consistent corner radii by component type */
  radius: {
    button: 'xl' as BorderRadiusKey,
    buttonSm: 'lg' as BorderRadiusKey,
    card: '2xl' as BorderRadiusKey,
    cardInner: 'xl' as BorderRadiusKey,
    input: 'xl' as BorderRadiusKey,
    chip: 'full' as BorderRadiusKey,
    badge: 'full' as BorderRadiusKey,
    banner: 'xl' as BorderRadiusKey,
    modal: '2xl' as BorderRadiusKey,
  },

  /** Touch & interaction */
  interaction: {
    activeOpacity: 0.72,
    disabledOpacity: 0.48,
    hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
    minTouchTarget: 44,
  },

  /** Motion — align with timing scale in spacing.ts */
  motion: {
    instant: 0,
    fast: 120,
    normal: 220,
    slow: 320,
    slower: 480,
  },

  /** Elevation defaults */
  elevation: {
    card: 'sm' as const,
    cardRaised: 'md' as const,
    dropdown: 'lg' as const,
    modal: 'xl' as const,
  },

  /** Border widths */
  border: {
    hairline: 1,
    focus: 2,
    strong: 2,
  },
} as const;

export type DesignTokens = typeof designTokens;

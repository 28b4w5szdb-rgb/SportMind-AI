/**
 * SportMind AI — App Font Loader
 *
 * Loads the SportMind typographic system from a CDN so the app works out of
 * the box in Expo Go AND development builds without shipping ~10 MB of font
 * assets in the JS bundle.
 *
 * Latin: Inter (400, 500, 600, 700)
 * Arabic: IBM Plex Sans Arabic (400, 500, 600, 700)
 *
 * We use jsdelivr's Fontsource TTF mirrors — these are stable CDN URLs
 * consumed by the standard `expo-font.useFonts` hook. If the CDN is
 * unreachable (offline first launch, restricted network), the hook returns
 * an error and the app boots with system font fallbacks. Nothing crashes.
 *
 * NOTE: We do NOT install `@expo-google-fonts/*` packages — the platform
 * rules forbid them. This CDN approach is the platform-approved pattern
 * (mirrors the existing use-icon-fonts.ts strategy for @expo/vector-icons).
 */

import { useFonts } from 'expo-font';

/**
 * Fontsource TTF file URLs on jsdelivr.
 * Pattern: https://cdn.jsdelivr.net/npm/@fontsource/{family}@{version}/files/{family}-{subset}-{weight}-{style}.ttf
 */
const FONT_URLS = {
  // Inter (Latin)
  'Inter-Regular':
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-400-normal.ttf',
  'Inter-Medium':
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-500-normal.ttf',
  'Inter-SemiBold':
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-600-normal.ttf',
  'Inter-Bold':
    'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-700-normal.ttf',

  // IBM Plex Sans Arabic
  'IBMPlexSansArabic-Regular':
    'https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans-arabic@5.0.20/files/ibm-plex-sans-arabic-arabic-400-normal.ttf',
  'IBMPlexSansArabic-Medium':
    'https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans-arabic@5.0.20/files/ibm-plex-sans-arabic-arabic-500-normal.ttf',
  'IBMPlexSansArabic-SemiBold':
    'https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans-arabic@5.0.20/files/ibm-plex-sans-arabic-arabic-600-normal.ttf',
  'IBMPlexSansArabic-Bold':
    'https://cdn.jsdelivr.net/npm/@fontsource/ibm-plex-sans-arabic@5.0.20/files/ibm-plex-sans-arabic-arabic-700-normal.ttf',
} as const;

export type AppFontFamily = keyof typeof FONT_URLS;

/**
 * Load all SportMind typographic fonts.
 * Returns [loaded, error] — matches expo-font's contract.
 * If `error` is set, the app should still proceed (system fonts fall back).
 */
export const useAppFonts = (): readonly [boolean, Error | null] =>
  useFonts(FONT_URLS as unknown as Record<string, string>);

export const APP_FONT_NAMES = Object.keys(FONT_URLS) as readonly AppFontFamily[];

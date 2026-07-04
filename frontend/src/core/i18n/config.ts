/**
 * SportMind AI — i18n Configuration
 *
 * i18next configuration with:
 *  - Arabic + English resources
 *  - Locale detection via expo-localization
 *  - ICU-style pluralization for Arabic (6 forms)
 *  - Persistence via expo-secure-store (locale is not a secret but keeps it consistent with auth-adjacent user preferences bootstrap flow)
 *
 * See Engineering Standards Ch 09 §9.2 (i18n) and UIUX Doc 06.
 */

import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import ar from './locales/ar.json';

export type SupportedLanguage = 'en' | 'ar';
export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['en', 'ar'] as const;
export const RTL_LANGUAGES: readonly SupportedLanguage[] = ['ar'] as const;
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Detect the device's preferred language, falling back to English.
 */
export function detectDeviceLanguage(): SupportedLanguage {
  try {
    const locales = getLocales();
    for (const locale of locales) {
      const code = (locale.languageCode ?? '').toLowerCase() as SupportedLanguage;
      if (SUPPORTED_LANGUAGES.includes(code)) return code;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_LANGUAGE;
}

export function isRTLLanguage(lang: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(lang);
}

/**
 * Initialize i18next once. Safe to call multiple times.
 */
let initialized = false;
export async function initI18n(initialLanguage?: SupportedLanguage): Promise<typeof i18n> {
  if (initialized) {
    if (initialLanguage && i18n.language !== initialLanguage) {
      await i18n.changeLanguage(initialLanguage);
    }
    return i18n;
  }

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initialLanguage ?? detectDeviceLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
    returnNull: false,
    react: { useSuspense: false },
  });

  initialized = true;
  return i18n;
}

export { i18n };
export default i18n;

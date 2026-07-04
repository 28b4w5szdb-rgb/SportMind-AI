/**
 * SportMind AI — DirectionProvider
 *
 * Owns the app's language + writing direction (LTR/RTL).
 * Provides:
 *   - the current language ('en' | 'ar')
 *   - the current writing direction ('ltr' | 'rtl')
 *   - `isRTL` boolean
 *   - `setLanguage(lang)` to switch at runtime (persisted)
 *   - `flexRow` / `textAlign` logical helpers
 *
 * IMPORTANT: We DO NOT call I18nManager.forceRTL(). Forcing RTL requires an
 * app restart, which breaks the "instant mirror flip" UX defined in
 * UIUX Doc 06 §6.7 and Doc 07 §7.3 (Language Mirror Flip).
 *
 * Instead, every layout that cares about direction uses the `useDirection()`
 * hook (or its `flexRow` helper) to resolve `row` vs `row-reverse` at
 * render time. Text uses `writingDirection: isRTL ? 'rtl' : 'ltr'`.
 *
 * See Engineering Standards Ch 02 §2.7 (Cross-cutting concerns).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';

import {
  DEFAULT_LANGUAGE,
  detectDeviceLanguage,
  i18n,
  initI18n,
  isRTLLanguage,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/src/core/i18n';

const STORAGE_KEY = 'sportmind.pref.language.v1';

export type WritingDirection = 'ltr' | 'rtl';

export interface DirectionContextValue {
  /** Currently active language code. */
  language: SupportedLanguage;
  /** Writing direction implied by the current language. */
  direction: WritingDirection;
  /** Convenience boolean for RTL scripts. */
  isRTL: boolean;
  /** Whether the provider has finished bootstrapping (initial locale loaded). */
  ready: boolean;
  /** Switch the app language at runtime. Persists the preference. */
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  /** Toggle between the two supported languages (AR ⇄ EN). */
  toggleLanguage: () => Promise<void>;
  /**
   * Resolve a flexDirection value with logical semantics.
   * `flexRow('row')` returns `'row'` in LTR and `'row-reverse'` in RTL.
   * Pass `false` to preserve the physical direction (rare).
   */
  flexRow: (mirror?: boolean) => 'row' | 'row-reverse';
  /**
   * Resolve a textAlign value with logical semantics.
   * `textAlign('start')` returns `'left'` in LTR and `'right'` in RTL.
   */
  textAlign: (side: 'start' | 'end' | 'center') => 'left' | 'right' | 'center';
}

const DirectionContext = createContext<DirectionContextValue | null>(null);

async function readPersistedLanguage(): Promise<SupportedLanguage | null> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (raw && (SUPPORTED_LANGUAGES as readonly string[]).includes(raw)) {
      return raw as SupportedLanguage;
    }
  } catch {
    // ignore — SecureStore may be unavailable on web
  }
  return null;
}

async function writePersistedLanguage(lang: SupportedLanguage): Promise<void> {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, lang);
  } catch {
    // ignore — best-effort persistence
  }
}

export interface DirectionProviderProps {
  children: React.ReactNode;
  /** Optional override — mostly for tests / Storybook. */
  initialLanguage?: SupportedLanguage;
}

export function DirectionProvider({ children, initialLanguage }: DirectionProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    initialLanguage ?? DEFAULT_LANGUAGE,
  );
  const [ready, setReady] = useState(false);

  // Bootstrap: pick persisted > initial prop > device locale > default.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const persisted = await readPersistedLanguage();
      const resolved: SupportedLanguage =
        persisted ?? initialLanguage ?? detectDeviceLanguage();
      await initI18n(resolved);
      if (!cancelled) {
        setLanguageState(resolved);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    if (!(SUPPORTED_LANGUAGES as readonly string[]).includes(lang)) return;
    if (i18n.language !== lang) {
      await i18n.changeLanguage(lang);
    }
    setLanguageState(lang);
    await writePersistedLanguage(lang);
  }, []);

  const toggleLanguage = useCallback(async () => {
    const next: SupportedLanguage = language === 'en' ? 'ar' : 'en';
    await setLanguage(next);
  }, [language, setLanguage]);

  const value = useMemo<DirectionContextValue>(() => {
    const isRTL = isRTLLanguage(language);
    return {
      language,
      direction: isRTL ? 'rtl' : 'ltr',
      isRTL,
      ready,
      setLanguage,
      toggleLanguage,
      flexRow: (mirror = true) => {
        if (!mirror) return 'row';
        return isRTL ? 'row-reverse' : 'row';
      },
      textAlign: (side) => {
        if (side === 'center') return 'center';
        if (side === 'start') return isRTL ? 'right' : 'left';
        return isRTL ? 'left' : 'right';
      },
    };
  }, [language, ready, setLanguage, toggleLanguage]);

  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export function useDirection(): DirectionContextValue {
  const ctx = useContext(DirectionContext);
  if (!ctx) {
    throw new Error('useDirection() must be used inside <DirectionProvider>.');
  }
  return ctx;
}

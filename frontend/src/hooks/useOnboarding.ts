/**
 * Onboarding completion persistence (first-launch product experience).
 */

import { useCallback, useEffect, useState } from 'react';

import { ONBOARDING_STORAGE_KEY } from '@/src/core/theme/brand';
import { storage } from '@/src/utils/storage';

export function useOnboarding() {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const value = await storage.getItem(ONBOARDING_STORAGE_KEY, false);
      if (mounted) {
        setComplete(!!value);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const markComplete = useCallback(async () => {
    await storage.setItem(ONBOARDING_STORAGE_KEY, true);
    setComplete(true);
  }, []);

  const reset = useCallback(async () => {
    await storage.removeItem(ONBOARDING_STORAGE_KEY);
    setComplete(false);
  }, []);

  return { ready, complete, markComplete, reset };
}

/**
 * Firebase auth activation gate — mock/Supabase remain default.
 */

import { DEV_BYPASS_AUTH } from '@/src/core/config/dev';
import { USE_CLOUD_DATA } from '@/src/core/config/cloud';
import { isFirebaseConfigured } from '@/src/core/config/firebase';

/** True when Firebase Auth should drive the session (production cloud mode). */
export function shouldUseFirebaseAuth(): boolean {
  return !DEV_BYPASS_AUTH && USE_CLOUD_DATA && isFirebaseConfigured();
}

export type AuthBackend = 'dev-bypass' | 'firebase' | 'supabase' | 'none';

export function resolveAuthBackend(): AuthBackend {
  if (DEV_BYPASS_AUTH) return 'dev-bypass';
  if (shouldUseFirebaseAuth()) return 'firebase';
  if (isFirebaseConfigured() && !USE_CLOUD_DATA) return 'supabase';
  return 'supabase';
}

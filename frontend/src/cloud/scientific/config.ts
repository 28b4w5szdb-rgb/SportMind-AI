/**
 * Scientific Firestore foundation — feature gate.
 * Persistence writes route through ScientificPersistenceGateway when cloud enabled.
 */

import { isCloudDataEnabled } from '@/src/core/config/cloud';
import { isFirebaseConfigured } from '@/src/core/config/firebase';

/** True when scientific cloud repositories may be activated (default: false). */
export function isScientificCloudEnabled(): boolean {
  return isCloudDataEnabled() && isFirebaseConfigured();
}

/** Guard for future repository adapters — returns false without throwing. */
export function canAccessScientificFirestore(): boolean {
  return isScientificCloudEnabled();
}

export const SCIENTIFIC_CLOUD_DEFAULTS = {
  enabled: false,
  requiresFirebase: true,
  requiresUseCloudData: true,
} as const;

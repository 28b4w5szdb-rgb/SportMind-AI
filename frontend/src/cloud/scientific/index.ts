/**
 * SportMind AI — Scientific Firestore Core (Phase 6C.1–6C.7)
 *
 * Catalog, definition, normative, session, calculation, and SSID engines.
 * Activation: USE_CLOUD_DATA=true AND Firebase configured (catalog/org).
 * Sessions: in-memory mock store only in Phase 6C.5+.
 */

export {
  isScientificCloudEnabled,
  canAccessScientificFirestore,
  SCIENTIFIC_CLOUD_DEFAULTS,
} from './config';

export * from './paths';
export * from './models';
export * from './validation';
export * from './security';
export * from './repositories';
export * from './seed';
export * from './cache';
export * from './adapters';
export * from './engine';
export * from './session';

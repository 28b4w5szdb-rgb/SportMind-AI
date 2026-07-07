/**
 * SportMind AI — Scientific Firestore Core (Phase 6C.1–6C.8)
 *
 * Catalog, engines, and repository-backed persistence (mock or Firestore).
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
export * from './persistence';

/**
 * SportMind AI — Scientific Firestore Core Foundation (Phase 6C.1)
 *
 * Infrastructure-only module aligned with Phase 6C.0.1–6C.0.3 architecture.
 * No assessment sessions, passport, timeline, or business logic.
 *
 * Activation: USE_CLOUD_DATA=true AND Firebase configured.
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

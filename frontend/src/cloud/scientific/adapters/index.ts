/**
 * Scientific repository adapter factories — mock or Firestore via feature gate.
 */

import type {
  ScientificCatalogRepository,
  ScientificOrganizationRepository,
} from '../repositories/contracts';
import type { AssessmentSessionRepository } from '../repositories/contracts/AssessmentSessionRepository';
import type { NormativeSnapshotRepository } from '../repositories/contracts/NormativeSnapshotRepository';
import type { ScientificCalculationRepository } from '../repositories/contracts/ScientificCalculationRepository';
import type { ScientificInterpretationRepository } from '../repositories/contracts/ScientificInterpretationRepository';
import { canAccessScientificFirestore } from '../config';
import { createAssessmentSessionFirestoreRepository } from './firestore/assessmentSessionFirestoreAdapter';
import { createCatalogFirestoreRepository } from './firestore/catalogFirestoreAdapter';
import { createNormativeSnapshotFirestoreRepository } from './firestore/normativeSnapshotFirestoreAdapter';
import { createOrganizationFirestoreRepository } from './firestore/organizationFirestoreAdapter';
import { createScientificCalculationFirestoreRepository } from './firestore/scientificCalculationFirestoreAdapter';
import { createScientificInterpretationFirestoreRepository } from './firestore/scientificInterpretationFirestoreAdapter';
import { createAssessmentSessionMockRepository } from './mock/assessmentSessionMockAdapter';
import { createCatalogMockRepository } from './mock/catalogMockAdapter';
import { createNormativeSnapshotMockRepository } from './mock/normativeSnapshotMockAdapter';
import { createOrganizationMockRepository } from './mock/organizationMockAdapter';
import { createScientificCalculationMockRepository } from './mock/scientificCalculationMockAdapter';
import { createScientificInterpretationMockRepository } from './mock/scientificInterpretationMockAdapter';

export { ScientificPersistenceError, ScientificReadOnlyError } from './errors';

export function createCatalogRepository(
  useCloud = canAccessScientificFirestore()
): ScientificCatalogRepository {
  return useCloud ? createCatalogFirestoreRepository() : createCatalogMockRepository();
}

export function createOrganizationRepository(
  useCloud = canAccessScientificFirestore()
): ScientificOrganizationRepository {
  return useCloud ? createOrganizationFirestoreRepository() : createOrganizationMockRepository();
}

export function createAssessmentSessionRepository(
  useCloud = canAccessScientificFirestore()
): AssessmentSessionRepository {
  return useCloud
    ? createAssessmentSessionFirestoreRepository()
    : createAssessmentSessionMockRepository();
}

export function createScientificCalculationRepository(
  useCloud = canAccessScientificFirestore()
): ScientificCalculationRepository {
  return useCloud
    ? createScientificCalculationFirestoreRepository()
    : createScientificCalculationMockRepository();
}

export function createNormativeSnapshotRepository(
  useCloud = canAccessScientificFirestore()
): NormativeSnapshotRepository {
  return useCloud
    ? createNormativeSnapshotFirestoreRepository()
    : createNormativeSnapshotMockRepository();
}

export function createScientificInterpretationRepository(
  useCloud = canAccessScientificFirestore()
): ScientificInterpretationRepository {
  return useCloud
    ? createScientificInterpretationFirestoreRepository()
    : createScientificInterpretationMockRepository();
}

export {
  createCatalogFirestoreRepository,
  createOrganizationFirestoreRepository,
  createAssessmentSessionMockRepository,
  createAssessmentSessionFirestoreRepository,
  createCatalogMockRepository,
  createOrganizationMockRepository,
  createScientificCalculationMockRepository,
  createScientificCalculationFirestoreRepository,
  createNormativeSnapshotMockRepository,
  createNormativeSnapshotFirestoreRepository,
  createScientificInterpretationMockRepository,
  createScientificInterpretationFirestoreRepository,
};

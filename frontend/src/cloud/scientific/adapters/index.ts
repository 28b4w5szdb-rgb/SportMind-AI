/**
 * Scientific repository adapter factories.
 */

import type {
  ScientificCatalogRepository,
  ScientificOrganizationRepository,
} from '../repositories/contracts';
import { canAccessScientificFirestore } from '../config';
import { createCatalogFirestoreRepository } from './firestore/catalogFirestoreAdapter';
import { createOrganizationFirestoreRepository } from './firestore/organizationFirestoreAdapter';
import { createCatalogMockRepository } from './mock/catalogMockAdapter';
import { createOrganizationMockRepository } from './mock/organizationMockAdapter';
import { createAssessmentSessionMockRepository } from './mock/assessmentSessionMockAdapter';

export { ScientificReadOnlyError } from './errors';

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

export {
  createCatalogFirestoreRepository,
  createOrganizationFirestoreRepository,
  createCatalogMockRepository,
  createOrganizationMockRepository,
  createAssessmentSessionMockRepository,
};

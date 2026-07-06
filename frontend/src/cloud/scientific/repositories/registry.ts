/**
 * Scientific repository registry — lazy DI with mock / Firestore adapters.
 */

import {
  createCatalogRepository,
  createOrganizationRepository,
} from '../adapters';
import { createAssessmentSessionMockRepository } from '../adapters/mock/assessmentSessionMockAdapter';
import { canAccessScientificFirestore } from '../config';
import { createAssessmentSessionEngine } from '../engine/assessmentSessionEngine';
import type {
  AssessmentSessionRepository,
  ScientificCatalogRepository,
  ScientificOrganizationRepository,
} from './contracts';

export interface ScientificRepositoryRegistry {
  readonly enabled: boolean;
  readonly catalog: ScientificCatalogRepository;
  readonly organization: ScientificOrganizationRepository;
  readonly sessions: AssessmentSessionRepository;
}

let cachedRegistry: ScientificRepositoryRegistry | undefined;

/** Returns catalog, organization, and session repositories. */
export function getScientificRepositoryRegistry(): ScientificRepositoryRegistry {
  if (cachedRegistry !== undefined) return cachedRegistry;

  const enabled = canAccessScientificFirestore();

  cachedRegistry = {
    enabled,
    catalog: createCatalogRepository(enabled),
    organization: createOrganizationRepository(enabled),
    sessions: createAssessmentSessionMockRepository(),
  };

  return cachedRegistry;
}

/** Resets cached registry — for tests / future DI container refresh. */
export function resetScientificRepositoryRegistry(): void {
  cachedRegistry = undefined;
}

/** Factory for the Universal Assessment Session Engine from registry dependencies. */
export function createAssessmentSessionEngineFromRegistry() {
  const registry = getScientificRepositoryRegistry();
  return createAssessmentSessionEngine({
    catalog: registry.catalog,
    sessions: registry.sessions,
  });
}

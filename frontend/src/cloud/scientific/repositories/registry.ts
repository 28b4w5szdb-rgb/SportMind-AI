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
import { createScientificCalculationEngine } from '../engine/scientificCalculationEngine';
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
  const calculation = createScientificCalculationEngine(registry.catalog);
  return createAssessmentSessionEngine({
    catalog: registry.catalog,
    sessions: registry.sessions,
    calculation,
  });
}

/** Factory for the Scientific Calculation Engine from registry dependencies. */
export function createScientificCalculationEngineFromRegistry() {
  const registry = getScientificRepositoryRegistry();
  return createScientificCalculationEngine(registry.catalog);
}

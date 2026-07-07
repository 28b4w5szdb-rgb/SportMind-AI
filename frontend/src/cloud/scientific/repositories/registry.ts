/**
 * Scientific repository registry — lazy DI with mock / Firestore adapters.
 */

import {
  createAssessmentSessionRepository,
  createCatalogRepository,
  createNormativeSnapshotRepository,
  createOrganizationRepository,
  createScientificCalculationRepository,
  createScientificInterpretationRepository,
} from '../adapters';
import { createFirestoreAtomicPersistenceRepository } from '../adapters/firestore/firestoreAtomicPersistenceAdapter';
import { canAccessScientificFirestore } from '../config';
import { createAssessmentSessionEngine } from '../engine/assessmentSessionEngine';
import { createAssessmentDefinitionEngine } from '../engine/assessmentDefinitionEngine';
import { createScientificCalculationEngine } from '../engine/scientificCalculationEngine';
import { createNormativeReferenceEngine } from '../engine/normativeReferenceEngine';
import { createSsidInterpretationEngine } from '../engine/ssidInterpretationEngine';
import { createMockAtomicPersistenceRepository } from '../persistence/mockAtomicPersistenceAdapter';
import {
  createScientificPersistenceGateway,
  type ScientificPersistenceGateway,
} from '../persistence/scientificPersistenceGateway';
import type {
  AssessmentSessionRepository,
  NormativeSnapshotRepository,
  ScientificCalculationRepository,
  ScientificCatalogRepository,
  ScientificInterpretationRepository,
  ScientificOrganizationRepository,
} from './contracts';

export interface ScientificRepositoryRegistry {
  readonly enabled: boolean;
  readonly catalog: ScientificCatalogRepository;
  readonly organization: ScientificOrganizationRepository;
  readonly sessions: AssessmentSessionRepository;
  readonly calculations: ScientificCalculationRepository;
  readonly normativeSnapshots: NormativeSnapshotRepository;
  readonly interpretations: ScientificInterpretationRepository;
  readonly persistence: ScientificPersistenceGateway;
}

let cachedRegistry: ScientificRepositoryRegistry | undefined;

/** Returns catalog, organization, persistence, and session repositories. */
export function getScientificRepositoryRegistry(): ScientificRepositoryRegistry {
  if (cachedRegistry !== undefined) return cachedRegistry;

  const enabled = canAccessScientificFirestore();
  const adapter = enabled ? 'firestore' : 'mock';

  const sessions = createAssessmentSessionRepository(enabled);
  const calculations = createScientificCalculationRepository(enabled);
  const normativeSnapshots = createNormativeSnapshotRepository(enabled);
  const interpretations = createScientificInterpretationRepository(enabled);
  const atomic = enabled
    ? createFirestoreAtomicPersistenceRepository()
    : createMockAtomicPersistenceRepository();

  cachedRegistry = {
    enabled,
    catalog: createCatalogRepository(enabled),
    organization: createOrganizationRepository(enabled),
    sessions,
    calculations,
    normativeSnapshots,
    interpretations,
    persistence: createScientificPersistenceGateway({
      sessions,
      atomic,
      adapter,
    }),
  };

  return cachedRegistry;
}

/** Resets cached registry — for tests / future DI container refresh. */
export function resetScientificRepositoryRegistry(): void {
  cachedRegistry = undefined;
}

/** Factory for the Universal Assessment Session Engine from registry dependencies. */
export function createAssessmentSessionEngineFromRegistry(options?: { includeSsid?: boolean }) {
  const registry = getScientificRepositoryRegistry();
  const calculation = createScientificCalculationEngine(registry.catalog);
  const ssid = options?.includeSsid ? createSsidInterpretationEngine(registry.catalog) : undefined;
  return createAssessmentSessionEngine({
    catalog: registry.catalog,
    sessions: registry.sessions,
    calculation,
    ssid,
    persistence: registry.persistence,
  });
}

/** Factory for the Assessment Definition Engine from registry dependencies. */
export function createAssessmentDefinitionEngineFromRegistry() {
  const registry = getScientificRepositoryRegistry();
  return createAssessmentDefinitionEngine(registry.catalog);
}

/** Factory for the Normative Reference Engine from registry dependencies. */
export function createNormativeReferenceEngineFromRegistry() {
  const registry = getScientificRepositoryRegistry();
  return createNormativeReferenceEngine(registry.catalog);
}

/** Factory for the Scientific Calculation Engine from registry dependencies. */
export function createScientificCalculationEngineFromRegistry() {
  const registry = getScientificRepositoryRegistry();
  return createScientificCalculationEngine(registry.catalog);
}

/** Factory for the SSID Interpretation Engine from registry dependencies. */
export function createSsidInterpretationEngineFromRegistry() {
  const registry = getScientificRepositoryRegistry();
  return createSsidInterpretationEngine(registry.catalog);
}

/** Factory for the Scientific Persistence Gateway from registry dependencies. */
export function createScientificPersistenceGatewayFromRegistry() {
  return getScientificRepositoryRegistry().persistence;
}

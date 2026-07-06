/**
 * Scientific repository registry — lazy DI with mock / Firestore adapters.
 */

import { createCatalogRepository, createOrganizationRepository } from '../adapters';
import { canAccessScientificFirestore } from '../config';
import type {
  ScientificCatalogRepository,
  ScientificOrganizationRepository,
} from './contracts';

export interface ScientificRepositoryRegistry {
  readonly enabled: boolean;
  readonly catalog: ScientificCatalogRepository;
  readonly organization: ScientificOrganizationRepository;
}

let cachedRegistry: ScientificRepositoryRegistry | undefined;

/** Returns catalog + organization repositories (mock or Firestore based on cloud gate). */
export function getScientificRepositoryRegistry(): ScientificRepositoryRegistry {
  if (cachedRegistry !== undefined) return cachedRegistry;

  const enabled = canAccessScientificFirestore();

  cachedRegistry = {
    enabled,
    catalog: createCatalogRepository(enabled),
    organization: createOrganizationRepository(enabled),
  };

  return cachedRegistry;
}

/** Resets cached registry — for tests / future DI container refresh. */
export function resetScientificRepositoryRegistry(): void {
  cachedRegistry = undefined;
}

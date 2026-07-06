/**
 * Scientific repository registry — lazy, DI-ready stubs.
 * No Firestore implementations in Phase 6C.1.
 */

import { canAccessScientificFirestore } from '../config';
import type {
  ScientificCatalogRepository,
  ScientificOrganizationRepository,
} from './contracts';

export interface ScientificRepositoryRegistry {
  readonly enabled: boolean;
  readonly catalog: ScientificCatalogRepository | null;
  readonly organization: ScientificOrganizationRepository | null;
}

let cachedRegistry: ScientificRepositoryRegistry | undefined;

/** Returns registry shell; adapters null until cloud mode implementation phase. */
export function getScientificRepositoryRegistry(): ScientificRepositoryRegistry {
  if (cachedRegistry !== undefined) return cachedRegistry;

  const enabled = canAccessScientificFirestore();

  cachedRegistry = {
    enabled,
    catalog: null,
    organization: null,
  };

  return cachedRegistry;
}

/** Resets cached registry — for tests / future DI container refresh. */
export function resetScientificRepositoryRegistry(): void {
  cachedRegistry = undefined;
}

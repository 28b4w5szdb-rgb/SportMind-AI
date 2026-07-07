/**
 * Cloud session loader for athlete workspace (Phase 6D.3).
 */

import { canAccessScientificFirestore } from '@/src/cloud/scientific/config';
import type { AssessmentSession } from '@/src/cloud/scientific/models/session';
import { getScientificRepositoryRegistry } from '@/src/cloud/scientific/repositories/registry';

export async function loadCloudSessionsForAthlete(
  organizationId: string,
  athleteId: string
): Promise<AssessmentSession[]> {
  if (!canAccessScientificFirestore()) return [];
  try {
    const registry = getScientificRepositoryRegistry();
    if (!registry.enabled) return [];
    return registry.sessions.listByAthlete(organizationId, athleteId);
  } catch {
    return [];
  }
}

export function isScientificCloudReady(): boolean {
  return canAccessScientificFirestore();
}

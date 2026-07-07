/**
 * In-memory workspace artifact cache (Phase 8.3) — passport + timeline assembly.
 * Not persisted; cleared on athlete/org change.
 */

import type { WorkspaceArtifactInput, WorkspaceArtifacts } from '../context/buildWorkspaceArtifacts';
import { buildWorkspaceArtifacts } from '../context/buildWorkspaceArtifacts';
import { resolveViewerRoleFromContext } from '../security/resolveWorkspaceViewerRole';

const cache = new Map<string, WorkspaceArtifacts>();
const MAX_ENTRIES = 12;

function cacheKey(input: WorkspaceArtifactInput): string {
  const role = resolveViewerRoleFromContext(input.securityContext);
  const testIds = input.tests
    .filter((t) => t.athlete_id === input.athlete.id)
    .map((t) => `${t.id}:${t.date}:${t.value}`)
    .join(',');
  return [
    input.orgId,
    input.athlete.id,
    role,
    testIds,
    input.analytics.overall.score,
    input.cloudSessions?.length ?? 0,
    input.reports?.length ?? 0,
    input.passportSources.checkIn?.date ?? '',
  ].join('|');
}

function trimCache(): void {
  if (cache.size <= MAX_ENTRIES) return;
  const first = cache.keys().next().value;
  if (first) cache.delete(first);
}

/** Build or return cached workspace artifacts. */
export function getOrBuildWorkspaceArtifacts(input: WorkspaceArtifactInput): WorkspaceArtifacts {
  const key = cacheKey(input);
  const hit = cache.get(key);
  if (hit) return hit;

  const built = buildWorkspaceArtifacts(input);
  cache.set(key, built);
  trimCache();
  return built;
}

export function invalidateWorkspaceArtifactCache(athleteId?: string): void {
  if (!athleteId) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(`|${athleteId}|`)) cache.delete(key);
  }
}

export function workspaceArtifactCacheSize(): number {
  return cache.size;
}

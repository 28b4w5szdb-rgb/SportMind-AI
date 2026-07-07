/**
 * Scientific Report Firestore bridge (Phase 7.2 / 8.1).
 */

import { logScientificCloudError } from '@/src/cloud/scientific/adapters/cloudErrorDiagnostics';
import { ScientificCloudError, ScientificPersistenceError } from '@/src/cloud/scientific/adapters/errors';
import { canAccessScientificFirestore } from '@/src/cloud/scientific/config';
import type { ReportViewerRole } from '@/src/cloud/scientific/models/report';
import type { CreateScientificReportInput, PersistedScientificReportRecord } from '@/src/cloud/scientific/models/report';
import { getScientificRepositoryRegistry } from '@/src/cloud/scientific/repositories/registry';

export type FirestorePersistResult =
  | { ok: true; reportId: string; sizeWarning?: boolean; chunkingRecommended?: boolean }
  | { ok: false; reason: 'repository_unavailable' | 'cloud_disabled' | 'write_failed' | 'report_oversized' };

export type FirestoreLoadResult =
  | { ok: true; record: PersistedScientificReportRecord }
  | { ok: false; reason: 'not_found' | 'cloud_disabled' | 'read_failed' };

function getRepository() {
  if (!canAccessScientificFirestore()) return null;
  try {
    return getScientificRepositoryRegistry().reports;
  } catch (e) {
    logScientificCloudError(e, 'getRepository');
    return null;
  }
}

/** Persist scientific report to org-scoped Firestore path. */
export async function tryPersistScientificReportToFirestore(
  input: CreateScientificReportInput
): Promise<FirestorePersistResult> {
  if (!canAccessScientificFirestore()) {
    return { ok: false, reason: 'cloud_disabled' };
  }

  const repo = getRepository();
  if (!repo) {
    return { ok: false, reason: 'repository_unavailable' };
  }

  try {
    const record = await repo.createScientificReport(input);
    return {
      ok: true,
      reportId: record.report_id,
      sizeWarning: Boolean(record.chunking_recommended),
      chunkingRecommended: Boolean(record.chunking_recommended),
    };
  } catch (e) {
    logScientificCloudError(e, 'tryPersistScientificReportToFirestore');
    if (e instanceof ScientificCloudError && e.code === 'report_oversized') {
      return { ok: false, reason: 'report_oversized' };
    }
    if (e instanceof ScientificPersistenceError && e.code === 'firestore_unavailable') {
      return { ok: false, reason: 'repository_unavailable' };
    }
    return { ok: false, reason: 'write_failed' };
  }
}

/** Load scientific report from Firestore with role-aware view resolution. */
export async function tryLoadScientificReportFromFirestore(
  organizationId: string,
  reportId: string,
  viewerRole?: ReportViewerRole
): Promise<FirestoreLoadResult> {
  if (!canAccessScientificFirestore()) {
    return { ok: false, reason: 'cloud_disabled' };
  }

  const repo = getRepository();
  if (!repo) {
    return { ok: false, reason: 'read_failed' };
  }

  try {
    const record = await repo.getScientificReportById(organizationId, reportId, viewerRole);
    if (!record) return { ok: false, reason: 'not_found' };
    return { ok: true, record };
  } catch (e) {
    logScientificCloudError(e, 'tryLoadScientificReportFromFirestore');
    return { ok: false, reason: 'read_failed' };
  }
}

/** List org scientific reports from Firestore — throws on cloud read failure. */
export async function listScientificReportsFromFirestore(
  organizationId: string
): Promise<PersistedScientificReportRecord[]> {
  if (!canAccessScientificFirestore()) {
    throw new ScientificCloudError('firestore_unavailable', 'Cloud data mode is disabled');
  }
  const repo = getRepository();
  if (!repo) {
    throw new ScientificCloudError('firestore_unavailable', 'Scientific report repository unavailable');
  }
  return repo.listScientificReports(organizationId);
}

/** Soft-archive report in Firestore. */
export async function archiveScientificReportInFirestore(
  organizationId: string,
  reportId: string
): Promise<boolean> {
  if (!canAccessScientificFirestore()) return false;
  const repo = getRepository();
  if (!repo) return false;
  try {
    const result = await repo.archiveScientificReport(organizationId, reportId);
    return Boolean(result);
  } catch (e) {
    logScientificCloudError(e, 'archiveScientificReportInFirestore');
    throw e;
  }
}

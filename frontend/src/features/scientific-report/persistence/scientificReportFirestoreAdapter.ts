/**
 * Scientific Report Firestore bridge (Phase 7.2).
 */

import { createScientificReportRepository } from '@/src/cloud/scientific/adapters';
import { canAccessScientificFirestore } from '@/src/cloud/scientific/config';
import type { CreateScientificReportInput, PersistedScientificReportRecord } from '@/src/cloud/scientific/models/report';
import { ScientificPersistenceError } from '@/src/cloud/scientific/adapters/errors';

export type FirestorePersistResult =
  | { ok: true; reportId: string }
  | { ok: false; reason: 'repository_unavailable' | 'cloud_disabled' | 'write_failed' };

export type FirestoreLoadResult =
  | { ok: true; record: PersistedScientificReportRecord }
  | { ok: false; reason: 'not_found' | 'cloud_disabled' | 'read_failed' };

function getRepository() {
  if (!canAccessScientificFirestore()) return null;
  try {
    return createScientificReportRepository(true);
  } catch {
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
    return { ok: true, reportId: record.report_id };
  } catch (e) {
    if (e instanceof ScientificPersistenceError && e.code === 'firestore_unavailable') {
      return { ok: false, reason: 'repository_unavailable' };
    }
    return { ok: false, reason: 'write_failed' };
  }
}

/** Load scientific report from Firestore. */
export async function tryLoadScientificReportFromFirestore(
  organizationId: string,
  reportId: string
): Promise<FirestoreLoadResult> {
  if (!canAccessScientificFirestore()) {
    return { ok: false, reason: 'cloud_disabled' };
  }

  const repo = getRepository();
  if (!repo) {
    return { ok: false, reason: 'read_failed' };
  }

  try {
    const record = await repo.getScientificReportById(organizationId, reportId);
    if (!record) return { ok: false, reason: 'not_found' };
    return { ok: true, record };
  } catch {
    return { ok: false, reason: 'read_failed' };
  }
}

/** List org scientific reports from Firestore. */
export async function listScientificReportsFromFirestore(
  organizationId: string
): Promise<PersistedScientificReportRecord[]> {
  if (!canAccessScientificFirestore()) return [];
  const repo = getRepository();
  if (!repo) return [];
  try {
    return await repo.listScientificReports(organizationId);
  } catch {
    return [];
  }
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
  } catch {
    return false;
  }
}

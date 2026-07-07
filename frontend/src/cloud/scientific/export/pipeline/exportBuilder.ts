/**
 * Export pipeline — builder stage (Phase 7.3).
 */

import type { ExportJob, ExportRequest } from '../models/ExportDomain';

export function validateExportRequest(request: ExportRequest): { valid: boolean; error?: string } {
  if (!request.report_id) return { valid: false, error: 'missing_report_id' };
  if (!request.organization_id) return { valid: false, error: 'missing_organization_id' };
  if (!request.requested_by) return { valid: false, error: 'missing_requested_by' };
  return { valid: true };
}

export function createExportJob(request: ExportRequest): ExportJob {
  const now = new Date().toISOString();
  return {
    job_id: `export_${request.report_id}_${Date.now()}`,
    request,
    status: 'pending',
    created_at: now,
    updated_at: now,
  };
}

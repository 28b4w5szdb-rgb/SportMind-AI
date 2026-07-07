/**
 * Export pipeline — role filter stage (Phase 7.3).
 */

import type { ScientificReport } from '../../models/report';
import { filterReportForViewer } from '../../security/reportAccess';
import type { ExportRequest } from '../models/ExportDomain';

/** Apply role-aware visibility — export never bypasses filtering. */
export function applyExportRoleFilter(
  report: ScientificReport,
  request: ExportRequest
): ScientificReport {
  return filterReportForViewer(report, request.viewer_role);
}

/**
 * Export pipeline — localized content stage (Phase 7.3).
 */

import type { ExportLocaleMode } from '../models/ExportDomain';
import { formatReportForExport, type FormattedExportDocument } from '../formatting/reportFormatter';
import type { ScientificReport } from '../../models/report';
import type { ExportTemplate } from '../models/ExportDomain';

/** Resolve locale mode from template + request override. */
export function resolveLocaleMode(
  templateLocale: ExportLocaleMode,
  requestLocale?: ExportLocaleMode
): ExportLocaleMode {
  return requestLocale ?? templateLocale;
}

/** Build localized formatted document for export adapters. */
export function buildLocalizedExportContent(
  report: ScientificReport,
  template: ExportTemplate,
  localeMode: ExportLocaleMode
): FormattedExportDocument {
  const sectionIds = template.default_sections;
  return formatReportForExport(report, localeMode, sectionIds);
}

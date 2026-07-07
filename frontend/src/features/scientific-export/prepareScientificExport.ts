/**
 * Feature bridge — unified scientific export (Phase 7.3).
 */

import type { ScientificReport } from '@/src/cloud/scientific/models/report';
import {
  buildExportRequest,
  runExportPipeline,
  type ExportFormat,
  type ExportLocaleMode,
  type ExportResult,
  type ExportTemplateId,
} from '@/src/cloud/scientific/export';
import { mapReportThemeToTemplate, type ReportThemeId } from '@/src/cloud/scientific/export/pipeline/templateResolver';

export interface PrepareScientificExportOptions {
  templateId?: ExportTemplateId;
  theme?: ReportThemeId;
  localeMode?: ExportLocaleMode;
  requestedBy?: string;
}

export async function prepareScientificExport(
  report: ScientificReport,
  format: ExportFormat,
  options: PrepareScientificExportOptions = {}
): Promise<ExportResult> {
  const templateId =
    options.templateId ?? (options.theme ? mapReportThemeToTemplate(options.theme) : 'club_standard');

  const request = buildExportRequest(report, {
    format,
    templateId,
    localeMode: options.localeMode ?? 'bilingual',
    requestedBy: options.requestedBy ?? report.generated_by ?? 'system',
  });

  return runExportPipeline({ report, request });
}

export function resolveExportStatusMessage(result: ExportResult, language: string): string {
  const isArabic = language.startsWith('ar');
  if (isArabic) return result.status_message.ar;
  return result.status_message.en;
}

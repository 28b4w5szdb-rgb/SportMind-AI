/**
 * Unified Scientific Export Pipeline (Phase 7.3).
 *
 * Scientific Report → Export Builder → Template → Role → Evidence → Locale → Adapter → Artifact
 */

import type { ScientificReport } from '../../models/report';
import type {
  ExportArtifact,
  ExportRequest,
  ExportResult,
} from '../models/ExportDomain';
import { EXPORT_LAYER_VERSION } from '../models/ExportDomain';
import { createMockExportAdapterRegistry } from '../adapters/mock/mockExportAdapters';
import type { ExportAdapterRegistry } from '../adapters/contracts/ExportAdapter';
import { formatReportForExport } from '../formatting/reportFormatter';
import { applyExportEvidenceFilter } from './evidenceFilter';
import { buildLocalizedExportContent, resolveLocaleMode } from './localizedContent';
import { applyExportRoleFilter } from './roleFilter';
import { createExportJob, validateExportRequest } from './exportBuilder';
import { resolveTemplateForExport } from './templateResolver';

export interface ExportPipelineInput {
  report: ScientificReport;
  request: ExportRequest;
  adapterRegistry?: ExportAdapterRegistry;
}

function bi(en: string, ar: string) {
  return { en, ar };
}

/** Run full export pipeline — returns metadata artifact, no binary file. */
export async function runExportPipeline(input: ExportPipelineInput): Promise<ExportResult> {
  const registry = input.adapterRegistry ?? createMockExportAdapterRegistry();
  let job = createExportJob(input.request);

  const validation = validateExportRequest(input.request);
  if (!validation.valid) {
    job = { ...job, status: 'failed', error_message: validation.error, updated_at: new Date().toISOString() };
    return {
      job,
      artifact: null,
      status_message: bi('Invalid export request.', 'طلب تصدير غير صالح.'),
      format_coming_soon: true,
    };
  }

  try {
    job = { ...job, status: 'preparing', updated_at: new Date().toISOString() };

    const template = resolveTemplateForExport(input.request.template_id);
    const localeMode = resolveLocaleMode(template.locale_mode, input.request.locale_mode);

    // Stage 1: Role filter
    let filtered = applyExportRoleFilter(input.report, input.request);

    // Stage 2: Evidence filter
    filtered = applyExportEvidenceFilter(filtered, input.request.format);

    // Stage 3: Localized content
    const document = buildLocalizedExportContent(filtered, template, localeMode);

    // Stage 4: Format adapter
    const adapter = registry.getAdapter(input.request.format);
    if (!adapter) {
      job = { ...job, status: 'failed', error_message: 'adapter_not_found', updated_at: new Date().toISOString() };
      return {
        job,
        artifact: null,
        status_message: bi('Export format not supported.', 'صيغة التصدير غير مدعومة.'),
        format_coming_soon: true,
      };
    }

    const artifact: ExportArtifact = await adapter.prepare({ request: input.request, job, document });

    job = { ...job, status: 'prepared', updated_at: new Date().toISOString() };

    const formatLabel = input.request.format.toUpperCase();
    return {
      job,
      artifact,
      status_message: bi(
        `Export prepared (${formatLabel}). Format rendering coming soon — v${EXPORT_LAYER_VERSION}.`,
        `تم تجهيز التصدير (${formatLabel}). عرض الصيغة قريباً — v${EXPORT_LAYER_VERSION}.`
      ),
      format_coming_soon: true,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'export_failed';
    job = { ...job, status: 'failed', error_message: message, updated_at: new Date().toISOString() };
    return {
      job,
      artifact: null,
      status_message: bi('Export preparation failed.', 'فشل تجهيز التصدير.'),
      format_coming_soon: true,
    };
  }
}

/** Map legacy UI format ids to export pipeline formats. */
export function mapLegacyExportFormat(format: 'pdf' | 'word' | 'excel'): import('../models/ExportDomain').ExportFormat {
  return format;
}

/** Build export request from scientific report + UI options. */
export function buildExportRequest(
  report: ScientificReport,
  options: {
    format: import('../models/ExportDomain').ExportFormat;
    templateId?: import('../models/ExportDomain').ExportTemplateId;
    localeMode?: import('../models/ExportDomain').ExportLocaleMode;
    requestedBy: string;
  }
): ExportRequest {
  return {
    report_id: report.report_id,
    organization_id: report.organization_id,
    format: options.format,
    template_id: options.templateId ?? 'club_standard',
    locale_mode: options.localeMode ?? 'bilingual',
    requested_by: options.requestedBy,
    viewer_role: report.viewer_role,
  };
}

/** Preview formatted document without running adapter — for diagnostics. */
export function previewExportDocument(
  report: ScientificReport,
  request: ExportRequest
): ReturnType<typeof formatReportForExport> {
  const template = resolveTemplateForExport(request.template_id);
  const localeMode = resolveLocaleMode(template.locale_mode, request.locale_mode);
  let filtered = applyExportRoleFilter(report, request);
  filtered = applyExportEvidenceFilter(filtered, request.format);
  return buildLocalizedExportContent(filtered, template, localeMode);
}

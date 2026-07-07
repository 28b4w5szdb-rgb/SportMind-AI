/**
 * Export pipeline — template resolver stage (Phase 7.3).
 */

import type { ExportTemplate, ExportTemplateId } from '../models/ExportDomain';
import { resolveExportTemplate } from '../templates/exportTemplates';

export type ReportThemeId = 'professional' | 'university' | 'medical' | 'club' | 'research';

const THEME_TO_TEMPLATE: Record<ReportThemeId, ExportTemplateId> = {
  professional: 'club_standard',
  club: 'club_standard',
  university: 'university',
  medical: 'sports_medicine',
  research: 'research',
};

export function mapReportThemeToTemplate(theme: ReportThemeId): ExportTemplateId {
  return THEME_TO_TEMPLATE[theme] ?? 'club_standard';
}

export function resolveTemplateForExport(templateId: ExportTemplateId): ExportTemplate {
  return resolveExportTemplate(templateId);
}

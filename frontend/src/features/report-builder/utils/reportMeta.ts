import type { MockReport, MockReportBuilderMeta, MockReportSections } from '@/src/data/mock/types';
import type { ReportBuilderConfig, ReportBuilderTypeId, ReportSectionId, ReportScope, ReportThemeId } from '../types';
import { DEFAULT_SECTIONS_BY_TYPE, REPORT_SECTION_OPTIONS } from '../constants';
import { buildPreviewBlocks } from './reportContent';

export function configToBuilderMeta(config: ReportBuilderConfig): MockReportBuilderMeta {
  return {
    reportType: config.reportType,
    theme: config.theme,
    sectionOrder: [...config.sectionOrder],
    dateFrom: config.dateFrom,
    dateTo: config.dateTo,
    scope: config.scope,
    teamId: config.teamId,
  };
}

export function builderMetaToConfig(report: MockReport): ReportBuilderConfig {
  const meta = report.builder_meta;
  const reportType = (meta?.reportType ?? inferLegacyReportType(report)) as ReportBuilderTypeId;
  const scope = (meta?.scope ?? (report.type === 'team' ? 'team' : 'athlete')) as ReportScope;
  const isTeam = scope === 'team' || report.type === 'team';

  return {
    title: report.title,
    reportType,
    scope,
    athleteId: report.athlete_id ?? null,
    teamId: meta?.teamId ?? null,
    dateFrom: meta?.dateFrom ?? defaultDateFrom(),
    dateTo: meta?.dateTo ?? defaultDateTo(),
    sectionOrder: meta?.sectionOrder?.length
      ? (meta.sectionOrder as ReportSectionId[])
      : inferLegacySectionOrder(report.sections, isTeam, reportType),
    theme: (meta?.theme ?? 'professional') as ReportThemeId,
  };
}

function inferLegacyReportType(report: MockReport): ReportBuilderTypeId {
  if (report.type === 'athlete') return 'athlete';
  if (report.type === 'team') return 'team';
  return 'performance';
}

function inferLegacySectionOrder(
  sections: MockReportSections,
  isTeam: boolean,
  reportType: ReportBuilderTypeId
): ReportSectionId[] {
  const preferred = DEFAULT_SECTIONS_BY_TYPE[reportType] ?? DEFAULT_SECTIONS_BY_TYPE.athlete;
  const ordered = preferred.filter((id) => sectionHasContent(id, sections, isTeam));
  if (ordered.length > 0) return ordered;

  return REPORT_SECTION_OPTIONS.map((o) => o.id).filter((id) => sectionHasContent(id, sections, isTeam));
}

function sectionHasContent(id: ReportSectionId, sections: MockReportSections, isTeam: boolean): boolean {
  const blocks = buildPreviewBlocks([id], sections, isTeam, '');
  return blocks.length > 0;
}

function defaultDateTo(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultDateFrom(): string {
  return new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
}

export function buildReportSubtitle(
  config: ReportBuilderConfig,
  athleteName: string | undefined,
  t: (key: string, opts?: Record<string, unknown>) => string
): string {
  const isTeam = config.scope === 'team';
  if (isTeam) {
    return t('reportBuilder.preview.teamScope', { from: config.dateFrom, to: config.dateTo });
  }
  if (athleteName) {
    return t('reportBuilder.preview.athleteScope', {
      name: athleteName,
      from: config.dateFrom,
      to: config.dateTo,
    });
  }
  return t('reportBuilder.preview.dateScope', { from: config.dateFrom, to: config.dateTo });
}

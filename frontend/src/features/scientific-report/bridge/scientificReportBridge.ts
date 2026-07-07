/**
 * Build scientific report from workspace / mock sources (Phase 7.0).
 */

import { buildScientificReport, mapBuilderTypeToScientificType } from '@/src/cloud/scientific/engine/scientificReportBuilder';
import { filterReportForContext } from '@/src/cloud/scientific/security/reportAccess';
import type { SecurityContext } from '@/src/cloud/scientific/security/accessControl';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import type { AthleteScientificTimeline } from '@/src/cloud/scientific/models/timeline';
import type { AssessmentSession } from '@/src/cloud/scientific/models/session';
import type { ScientificReport, ScientificReportType } from '@/src/cloud/scientific/models/report';
import type { ReportBuilderConfig } from '@/src/features/report-builder/types';
import { resolveViewerRoleFromContext } from '@/src/features/athlete-workspace/security/resolveWorkspaceViewerRole';

export interface ScientificReportBuildParams {
  config: ReportBuilderConfig;
  orgId: string;
  passport?: AthletePassport | null;
  timeline?: AthleteScientificTimeline | null;
  sessions?: AssessmentSession[];
  athleteDisplayName?: string | null;
  securityContext: SecurityContext;
  generatedBy?: string;
}

function mapReportViewerRole(context: SecurityContext): import('@/src/cloud/scientific/models/report').ReportViewerRole {
  const role = resolveViewerRoleFromContext(context);
  const map: Record<string, import('@/src/cloud/scientific/models/report').ReportViewerRole> = {
    coach: 'coach',
    sports_scientist: 'sports_scientist',
    team_doctor: 'clinical',
    physiotherapist: 'clinical',
    researcher: 'research',
    athlete: 'coach',
    org_admin: 'clinical',
  };
  return map[role] ?? 'coach';
}

export function buildScientificReportFromWorkspace(params: ScientificReportBuildParams): ScientificReport | null {
  const scientificType = mapBuilderTypeToScientificType(params.config.reportType);
  if (!scientificType) return null;
  if (params.config.scope === 'team' && scientificType !== 'team') {
    // Team scope uses legacy team builder for non-team types
    if (scientificType !== 'research') return null;
  }

  const viewerRole = mapReportViewerRole(params.securityContext);
  const title = {
    en: params.config.title,
    ar: params.config.title,
  };

  const raw = buildScientificReport({
    context: {
      orgId: params.orgId,
      reportType: scientificType as ScientificReportType,
      athleteId: params.config.athleteId,
      teamId: params.config.teamId,
      dateRange: { from: params.config.dateFrom, to: params.config.dateTo },
      viewerRole,
      generatedBy: params.generatedBy ?? 'SportMind AI',
      title,
    },
    sources: {
      passport: params.passport,
      timeline: params.timeline,
      sessions: params.sessions,
      athleteDisplayName: params.athleteDisplayName,
    },
  });

  return filterReportForContext(raw, params.securityContext);
}

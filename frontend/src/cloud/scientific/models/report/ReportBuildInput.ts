/**
 * Scientific Report builder input (Phase 7.0).
 */

import type { AthletePassport } from '../passport';
import type { AthleteScientificTimeline } from '../timeline';
import type { AssessmentSession } from '../session';
import type {
  ReportDateRange,
  ReportViewerRole,
  ScientificReportSectionId,
  ScientificReportType,
} from './ScientificReport';

export interface ReportBuildContext {
  orgId: string;
  reportType: ScientificReportType;
  athleteId?: string | null;
  teamId?: string | null;
  teamName?: string | null;
  dateRange: ReportDateRange;
  sectionOrder?: ScientificReportSectionId[];
  viewerRole: ReportViewerRole;
  generatedBy: string;
  title?: { en: string; ar: string };
}

export interface ReportBuildSources {
  passport?: AthletePassport | null;
  timeline?: AthleteScientificTimeline | null;
  sessions?: AssessmentSession[];
  /** Optional athlete display name for cover/profile sections. */
  athleteDisplayName?: string | null;
  /** Optional team athlete count for team reports. */
  teamAthleteCount?: number | null;
}

export interface ReportBuildInput {
  context: ReportBuildContext;
  sources: ReportBuildSources;
}

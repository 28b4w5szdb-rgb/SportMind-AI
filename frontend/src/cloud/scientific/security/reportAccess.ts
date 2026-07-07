/**
 * Scientific Report visibility and role-based filtering (Phase 7.0).
 */

import type {
  ReportViewerRole,
  ScientificReport,
  ScientificReportSection,
  ScientificReportSectionId,
} from '../models/report';
import { canReadFullMedicalRecord, canReadLimitedMedicalStatus } from './clinicalAccess';
import { canReadResearchData } from './researchAccess';
import { hasPermission, type SecurityContext } from './accessControl';
import { PERMISSIONS } from './permissions';

const CLINICAL_SECTIONS: ScientificReportSectionId[] = ['injury_medical_summary'];
const RESEARCH_ONLY_SECTIONS: ScientificReportSectionId[] = ['references'];

/** Map security context to report viewer role. */
export function resolveReportViewerRole(context: SecurityContext): ReportViewerRole {
  if (context.claims.isOrgAdmin) return 'clinical';
  if (canReadFullMedicalRecord(context)) return 'clinical';
  if (canReadResearchData(context) && !hasPermission(context, PERMISSIONS.READ_ATHLETES)) return 'research';
  if (hasPermission(context, PERMISSIONS.READ_ASSESSMENTS) && hasPermission(context, PERMISSIONS.READ_ATHLETES)) {
    const roleIds = [
      ...((context.claims.roleIds as string[]) ?? []),
      ...(context.membership?.role_ids ?? []),
    ];
    if (roleIds.includes('sports_scientist') || roleIds.includes('analyst')) return 'sports_scientist';
  }
  return 'coach';
}

/** Default mock-mode viewer role. */
export function defaultMockReportViewerRole(): ReportViewerRole {
  return 'coach';
}

function canViewReportSection(sectionId: ScientificReportSectionId, role: ReportViewerRole): boolean {
  if (CLINICAL_SECTIONS.includes(sectionId)) {
    return role === 'clinical' || role === 'sports_scientist' || role === 'coach';
  }
  if (RESEARCH_ONLY_SECTIONS.includes(sectionId) && role === 'coach') {
    return false;
  }
  return true;
}

function redactSectionForCoach(section: ScientificReportSection): ScientificReportSection {
  if (section.section_id !== 'injury_medical_summary') return section;
  return {
    ...section,
    body: {
      en: section.body.en.split('\n').slice(0, 4).join('\n'),
      ar: section.body.ar.split('\n').slice(0, 4).join('\n'),
    },
    visibility: 'coach',
  };
}

function redactSectionForResearch(section: ScientificReportSection): ScientificReportSection {
  if (section.section_id === 'athlete_profile') {
    return {
      ...section,
      body: {
        en: 'De-identified participant profile.',
        ar: 'ملف مشارك مجهول الهوية.',
      },
      visibility: 'research',
    };
  }
  if (CLINICAL_SECTIONS.includes(section.section_id)) {
    return { ...section, body: { en: 'Restricted.', ar: 'مقيد.' }, is_empty: true };
  }
  return section;
}

/** Filter report sections for viewer role. */
export function filterReportForViewer(report: ScientificReport, viewerRole: ReportViewerRole): ScientificReport {
  const filtered = report.sections
    .filter((s) => canViewReportSection(s.section_id, viewerRole))
    .map((s) => {
      if (viewerRole === 'coach') return redactSectionForCoach(s);
      if (viewerRole === 'research') return redactSectionForResearch(s);
      return s;
    });

  return {
    ...report,
    viewer_role: viewerRole,
    visibility_profile: viewerRole,
    sections: filtered,
  };
}

/** Filter report using full security context (org_admin bypass). */
export function filterReportForContext(report: ScientificReport, context: SecurityContext): ScientificReport {
  if (context.claims.isOrgAdmin) {
    return filterReportForViewer(report, 'clinical');
  }
  const role = resolveReportViewerRole(context);
  return filterReportForViewer(report, role);
}

/** Check if user can generate reports for an athlete. */
export function canGenerateScientificReport(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.READ_ATHLETES);
}

/** Check if user can view clinical report sections. */
export function canViewClinicalReportSections(context: SecurityContext): boolean {
  return canReadFullMedicalRecord(context) || canReadLimitedMedicalStatus(context);
}

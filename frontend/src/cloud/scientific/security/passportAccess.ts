/**
 * Passport visibility and role-based filtering (Phase 6D.1).
 */

import type { AthletePassport, PassportSectionId, PassportSectionSummary, PassportViewerRole } from '../models/passport/AthletePassport';
import { canReadFullMedicalRecord, canReadLimitedMedicalStatus } from './clinicalAccess';
import { canReadResearchData } from './researchAccess';
import { hasPermission, type SecurityContext } from './accessControl';
import { PERMISSIONS } from './permissions';

const CLINICAL_SECTIONS: PassportSectionId[] = ['medical', 'laboratory', 'injury'];
const RESEARCH_SECTIONS: PassportSectionId[] = ['research'];
const SCIENTIST_SECTIONS: PassportSectionId[] = ['body_composition', 'equipment', 'ssid_insights'];

/** Map security context to passport viewer role. */
export function resolvePassportViewerRole(context: SecurityContext): PassportViewerRole {
  if (context.claims.isOrgAdmin) return 'clinical';
  if (canReadFullMedicalRecord(context)) return 'clinical';
  if (canReadResearchData(context) && !hasPermission(context, PERMISSIONS.READ_ATHLETES)) return 'research';
  if (hasPermission(context, PERMISSIONS.READ_ASSESSMENTS) && hasPermission(context, PERMISSIONS.READ_ATHLETES)) {
    const roleIds = [
      ...((context.claims.roleIds as string[]) ?? []),
      ...(context.membership?.role_ids ?? []),
    ];
    if (roleIds.includes('sports_scientist') || roleIds.includes('analyst')) return 'sports_scientist';
    if (roleIds.includes('athlete_portal')) return 'athlete';
  }
  return 'coach';
}

/** Default mock-mode viewer role when no auth context is available. */
export function defaultMockPassportViewerRole(): PassportViewerRole {
  return 'coach';
}

function canViewSection(sectionId: PassportSectionId, viewerRole: PassportViewerRole): boolean {
  if (CLINICAL_SECTIONS.includes(sectionId)) {
    return viewerRole === 'clinical' || (viewerRole === 'coach' && sectionId === 'injury');
  }
  if (RESEARCH_SECTIONS.includes(sectionId)) {
    return viewerRole === 'research' || viewerRole === 'sports_scientist';
  }
  if (SCIENTIST_SECTIONS.includes(sectionId) && sectionId !== 'ssid_insights') {
    return viewerRole !== 'research';
  }
  if (sectionId === 'laboratory') return viewerRole === 'clinical';
  return true;
}

/** Redact clinical fields from injury section for coach view. */
function redactSectionForCoach(section: PassportSectionSummary): PassportSectionSummary {
  if (section.section_id !== 'injury' && section.section_id !== 'medical') return section;
  const safeKeys = new Set(['injury_risk_score', 'injury_status', 'availability', 'rtp_phase', 'availability_status', 'active_injuries']);
  return {
    ...section,
    summary_fields: section.summary_fields.filter((f) => safeKeys.has(f.key)),
    visibility: 'coach',
  };
}

/** Strip PII from identity section for research view. */
function redactSectionForResearch(section: PassportSectionSummary): PassportSectionSummary {
  if (section.section_id === 'identity') {
    return {
      ...section,
      summary_fields: section.summary_fields.filter((f) => !['full_name', 'date_of_birth', 'nationality'].includes(f.key)),
      visibility: 'research',
    };
  }
  if (CLINICAL_SECTIONS.includes(section.section_id) || section.section_id === 'medical') {
    return { ...section, summary_fields: [], is_missing: true, missing_reason: 'Restricted in research view' };
  }
  return section;
}

/** Filter passport sections for the resolved viewer role. */
export function filterPassportForViewer(
  passport: AthletePassport,
  viewerRole: PassportViewerRole
): AthletePassport {
  const filteredSections = { ...passport.sections };

  for (const sectionId of Object.keys(filteredSections) as PassportSectionId[]) {
    if (!canViewSection(sectionId, viewerRole)) {
      filteredSections[sectionId] = {
        ...filteredSections[sectionId],
        summary_fields: [],
        is_missing: true,
        missing_reason: 'Not visible for your role',
        collapsed_by_default: true,
      };
      continue;
    }
    if (viewerRole === 'coach') {
      filteredSections[sectionId] = redactSectionForCoach(filteredSections[sectionId]);
    }
    if (viewerRole === 'research') {
      filteredSections[sectionId] = redactSectionForResearch(filteredSections[sectionId]);
    }
  }

  const visibleIds = (Object.keys(filteredSections) as PassportSectionId[]).filter(
    (id) => !filteredSections[id].is_missing
  );

  return {
    ...passport,
    viewer_role: viewerRole,
    sections: filteredSections,
    privacy_metadata: {
      ...passport.privacy_metadata,
      pii_redacted: viewerRole === 'research',
      clinical_restricted: viewerRole !== 'clinical',
      research_deidentified: viewerRole === 'research',
      visible_section_ids: visibleIds,
    },
  };
}

/** Build + filter passport for a security context. */
export function filterPassportForContext(
  passport: AthletePassport,
  context: SecurityContext
): AthletePassport {
  if (context.claims.isOrgAdmin) {
    const visibleIds = (Object.keys(passport.sections) as PassportSectionId[]).filter(
      (id) => !passport.sections[id].is_missing || passport.sections[id].summary_fields.length > 0
    );
    return {
      ...passport,
      viewer_role: 'clinical',
      privacy_metadata: {
        ...passport.privacy_metadata,
        pii_redacted: false,
        clinical_restricted: false,
        research_deidentified: false,
        visible_section_ids: visibleIds,
      },
    };
  }

  const role = resolvePassportViewerRole(context);
  let filtered = filterPassportForViewer(passport, role);

  if (!canReadLimitedMedicalStatus(context) && !canReadFullMedicalRecord(context)) {
    for (const id of CLINICAL_SECTIONS) {
      filtered.sections[id] = {
        ...filtered.sections[id],
        summary_fields: [],
        is_missing: true,
        missing_reason: 'Clinical access required',
      };
    }
  }

  return filtered;
}

/** Whether viewer can see passport at all. */
export function canViewAthletePassport(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.READ_ATHLETES);
}

/**
 * Compute workspace visibility diagnostics (Phase 6D.3).
 */

import { ALL_PASSPORT_SECTION_IDS } from '@/src/cloud/scientific/models/passport';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import type { AthleteScientificTimeline } from '@/src/cloud/scientific/models/timeline';
import { resolveContextPermissions } from '@/src/cloud/scientific/security/accessControl';
import type { SecurityContext } from '@/src/cloud/scientific/security/accessControl';

import type { WorkspaceRole } from '../security/workspaceRolePresets';
import { resolveViewerRoleFromContext } from '../security/resolveWorkspaceViewerRole';
import type { WorkspaceVisibilityProfile } from './types';

export function buildVisibilityProfile(params: {
  securityContext: SecurityContext;
  workspaceRole: WorkspaceRole;
  passport: AthletePassport | null;
  timeline: AthleteScientificTimeline | null;
  rawPassportSectionCount?: number;
  rawTimelineEventCount?: number;
}): WorkspaceVisibilityProfile {
  const viewerRole = resolveViewerRoleFromContext(params.securityContext);
  const passportVisible = params.passport
    ? params.passport.privacy_metadata.visible_section_ids.length
    : 0;
  const timelineVisible = params.timeline?.events.length ?? 0;
  const rawPassportSections = params.rawPassportSectionCount ?? ALL_PASSPORT_SECTION_IDS.length;
  const rawTimelineEvents = params.rawTimelineEventCount ?? timelineVisible;

  return {
    workspaceRole: params.workspaceRole,
    viewerRole,
    effectivePermissions: resolveContextPermissions(params.securityContext),
    hiddenPassportSections: Math.max(0, rawPassportSections - passportVisible),
    hiddenTimelineEvents: Math.max(0, rawTimelineEvents - timelineVisible),
    passportVisibleSections: passportVisible,
    timelineVisibleEvents: timelineVisible,
  };
}

/**
 * Map workspace / security context to passport & timeline viewer roles (Phase 6D.3).
 */

import type { PassportViewerRole } from '@/src/cloud/scientific/models/passport';
import type { TimelineViewerRole } from '@/src/cloud/scientific/models/timeline';
import {
  resolvePassportViewerRole,
} from '@/src/cloud/scientific/security/passportAccess';
import { resolveTimelineViewerRole } from '@/src/cloud/scientific/security/timelineAccess';
import type { SecurityContext } from '@/src/cloud/scientific/security/accessControl';

import type { WorkspaceRole } from './workspaceRolePresets';

export function workspaceRoleToViewerRole(role: WorkspaceRole): PassportViewerRole {
  switch (role) {
    case 'team_doctor':
    case 'physiotherapist':
      return 'clinical';
    case 'org_admin':
      return 'clinical';
    case 'sports_scientist':
      return 'sports_scientist';
    case 'researcher':
      return 'research';
    case 'athlete':
      return 'athlete';
    default:
      return 'coach';
  }
}

export function resolveViewerRoleFromContext(context: SecurityContext): PassportViewerRole {
  if (context.claims.isOrgAdmin) return 'clinical';
  return resolvePassportViewerRole(context);
}

export function resolveTimelineRoleFromContext(context: SecurityContext): TimelineViewerRole {
  return resolveTimelineViewerRole(context);
}

export function workspaceRoleLabel(role: WorkspaceRole): string {
  return role;
}

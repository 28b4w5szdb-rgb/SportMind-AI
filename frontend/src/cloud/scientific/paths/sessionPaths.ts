/**
 * Organization-scoped assessment session paths.
 */

import { organizationPath } from './organizationPaths';

export const ASSESSMENT_SESSIONS_SUBCOLLECTION = 'assessment_sessions' as const;

export function orgAssessmentSessionsPath(orgId: string): string {
  return `${organizationPath(orgId)}/${ASSESSMENT_SESSIONS_SUBCOLLECTION}`;
}

export function orgAssessmentSessionPath(orgId: string, sessionId: string): string {
  return `${orgAssessmentSessionsPath(orgId)}/${sessionId}`;
}

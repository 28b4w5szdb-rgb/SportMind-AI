/**
 * Organization-scoped assessment session paths.
 */

import { organizationPath } from './organizationPaths';

export const ASSESSMENT_SESSIONS_SUBCOLLECTION = 'assessment_sessions' as const;
export const RAW_MEASUREMENTS_SUBCOLLECTION = 'raw_measurements' as const;
export const CALCULATED_METRICS_SUBCOLLECTION = 'calculated_metrics' as const;
export const NORMATIVE_SNAPSHOT_SUBCOLLECTION = 'normative_snapshot' as const;
export const INTERPRETATIONS_SUBCOLLECTION = 'interpretations' as const;

export const NORMATIVE_SNAPSHOT_DOC_ID = 'snapshot_v1' as const;
export const INTERPRETATION_DOC_ID = 'interpretation_v1' as const;

export function orgAssessmentSessionsPath(orgId: string): string {
  return `${organizationPath(orgId)}/${ASSESSMENT_SESSIONS_SUBCOLLECTION}`;
}

export function orgAssessmentSessionPath(orgId: string, sessionId: string): string {
  return `${orgAssessmentSessionsPath(orgId)}/${sessionId}`;
}

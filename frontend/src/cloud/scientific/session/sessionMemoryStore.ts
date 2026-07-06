/**
 * Append-only in-memory assessment session store — mock mode only.
 * No Firestore persistence in Phase 6C.5.
 */

import type { AssessmentSession } from '../models/session';

let sessions: AssessmentSession[] = [];

export function appendAssessmentSession(session: AssessmentSession): AssessmentSession {
  sessions = [...sessions, session];
  return session;
}

export function listAssessmentSessions(): AssessmentSession[] {
  return [...sessions];
}

export function getAssessmentSessionById(
  organizationId: string,
  sessionId: string
): AssessmentSession | null {
  return (
    sessions.find(
      (session) =>
        session.organization_id === organizationId && session.session_id === sessionId
    ) ?? null
  );
}

export function listAssessmentSessionsByOrganization(organizationId: string): AssessmentSession[] {
  return sessions.filter((session) => session.organization_id === organizationId);
}

export function listAssessmentSessionsByAthlete(
  organizationId: string,
  athleteId: string
): AssessmentSession[] {
  return sessions.filter(
    (session) =>
      session.organization_id === organizationId && session.athlete_id === athleteId
  );
}

export function listAssessmentSessionsByDefinition(
  organizationId: string,
  assessmentDefinitionKey: string
): AssessmentSession[] {
  return sessions.filter(
    (session) =>
      session.organization_id === organizationId &&
      session.assessment_definition_key === assessmentDefinitionKey
  );
}

export function resetAssessmentSessionMemoryStore(): void {
  sessions = [];
}

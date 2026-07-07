/**
 * Audit event policy — definitions only, no UI (Phase 6C.10).
 *
 * Events append to `organizations/{orgId}/audit_logs/{eventId}` when cloud writes are enabled.
 */

export const AUDIT_EVENT_TYPES = [
  'user_login',
  'data_export',
  'medical_record_access',
  'assessment_created',
  'assessment_amended',
  'report_generated',
  'permission_change',
] as const;

export type AuditEventType = (typeof AUDIT_EVENT_TYPES)[number];

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditEventPayload {
  event_type: AuditEventType;
  organization_id: string;
  actor_uid: string;
  actor_email?: string | null;
  target_type?: string | null;
  target_id?: string | null;
  severity: AuditSeverity;
  metadata?: Record<string, unknown>;
  ip_address?: string | null;
  user_agent?: string | null;
  occurred_at: string;
}

export const AUDIT_EVENT_SEVERITY: Record<AuditEventType, AuditSeverity> = {
  user_login: 'info',
  data_export: 'warning',
  medical_record_access: 'warning',
  assessment_created: 'info',
  assessment_amended: 'warning',
  report_generated: 'info',
  permission_change: 'critical',
};

export const AUDIT_RETENTION_DAYS = 2555; // ~7 years for clinical/research traceability

export function buildAuditEvent(
  type: AuditEventType,
  input: Omit<AuditEventPayload, 'event_type' | 'severity' | 'occurred_at'> & {
    occurred_at?: string;
  }
): AuditEventPayload {
  return {
    ...input,
    event_type: type,
    severity: AUDIT_EVENT_SEVERITY[type],
    occurred_at: input.occurred_at ?? new Date().toISOString(),
  };
}

export function requiresAuditOnRead(eventType: AuditEventType): boolean {
  return eventType === 'medical_record_access' || eventType === 'data_export';
}

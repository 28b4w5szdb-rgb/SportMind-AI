/**
 * Scientific Timeline visibility and role-based filtering (Phase 6D.2).
 */

import type {
  AthleteScientificTimeline,
  ScientificTimelineEvent,
  ScientificTimelineEventType,
  TimelineViewerRole,
} from '../models/timeline/ScientificTimeline';
import { canReadFullMedicalRecord, canReadLimitedMedicalStatus } from './clinicalAccess';
import { resolvePassportViewerRole } from './passportAccess';
import { hasPermission, type SecurityContext } from './accessControl';
import { PERMISSIONS } from './permissions';

const CLINICAL_EVENT_TYPES: ScientificTimelineEventType[] = ['injury', 'laboratory'];
const RESEARCH_ONLY_TYPES: ScientificTimelineEventType[] = ['research'];
const COACH_REDACTED_SUMMARY_PATTERNS = [/pain \d+\/10/i, /diagnosis/i];

export function resolveTimelineViewerRole(context: SecurityContext): TimelineViewerRole {
  return resolvePassportViewerRole(context);
}

export function defaultMockTimelineViewerRole(): TimelineViewerRole {
  return 'coach';
}

function canViewEventType(type: ScientificTimelineEventType, role: TimelineViewerRole): boolean {
  if (CLINICAL_EVENT_TYPES.includes(type)) {
    return role === 'clinical' || (role === 'coach' && type === 'injury');
  }
  if (RESEARCH_ONLY_TYPES.includes(type)) {
    return role === 'research' || role === 'sports_scientist';
  }
  if (type === 'laboratory') return role === 'clinical';
  return true;
}

function redactEventForCoach(evt: ScientificTimelineEvent): ScientificTimelineEvent {
  if (evt.event_type !== 'injury') return evt;
  const safeSummary = evt.summary.replace(/pain \d+\/10 · /i, '').replace(/pain \d+\/10/i, 'monitor load');
  return {
    ...evt,
    summary: safeSummary,
    visibility: 'coach',
    key_metrics: evt.key_metrics.filter((m) => m.key !== 'pain'),
  };
}

function redactEventForResearch(evt: ScientificTimelineEvent): ScientificTimelineEvent {
  if (CLINICAL_EVENT_TYPES.includes(evt.event_type)) {
    return {
      ...evt,
      title: 'Clinical event (restricted)',
      summary: 'Restricted in research view',
      key_metrics: [],
      visibility: 'research',
    };
  }
  if (evt.event_type === 'assessment') {
    return {
      ...evt,
      title: 'Performance index event',
      summary: evt.key_metrics.find((m) => m.key === 'value')?.value?.toString() ?? evt.summary,
      visibility: 'research',
    };
  }
  return evt;
}

/** Filter timeline events for viewer role. */
export function filterTimelineForViewer(
  timeline: AthleteScientificTimeline,
  viewerRole: TimelineViewerRole
): AthleteScientificTimeline {
  const events = timeline.events
    .filter((evt) => canViewEventType(evt.event_type, viewerRole))
    .map((evt) => {
      if (viewerRole === 'coach') return redactEventForCoach(evt);
      if (viewerRole === 'research') return redactEventForResearch(evt);
      return evt;
    });

  return { ...timeline, viewer_role: viewerRole, events };
}

/** Filter timeline using security context. */
export function filterTimelineForContext(
  timeline: AthleteScientificTimeline,
  context: SecurityContext
): AthleteScientificTimeline {
  const role = resolveTimelineViewerRole(context);
  let filtered = filterTimelineForViewer(timeline, role);

  if (!canReadLimitedMedicalStatus(context) && !canReadFullMedicalRecord(context)) {
    filtered = {
      ...filtered,
      events: filtered.events.filter((e) => !CLINICAL_EVENT_TYPES.includes(e.event_type)),
    };
  }

  return filtered;
}

export function canViewAthleteTimeline(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.READ_ATHLETES);
}

/** Filter events by category for UI. */
export function filterTimelineByCategory(
  events: ScientificTimelineEvent[],
  category: string | 'all'
): ScientificTimelineEvent[] {
  if (category === 'all') return events;
  return events.filter((e) => e.category === category || e.event_type === category);
}

/** Detect if summary still contains sensitive clinical text (for tests). */
export function summaryContainsClinicalDetail(summary: string): boolean {
  return COACH_REDACTED_SUMMARY_PATTERNS.some((p) => p.test(summary));
}

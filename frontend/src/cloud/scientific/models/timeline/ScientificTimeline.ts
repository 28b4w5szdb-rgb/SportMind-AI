/**
 * Scientific Timeline — chronological index layer (Phase 6D.2).
 *
 * Timeline summarizes important events without duplicating raw scientific data.
 * Source collections remain the truth; timeline holds references + summaries.
 */

import type { EvidenceTier } from '../common';

export type ScientificTimelineEventType =
  | 'assessment'
  | 'training'
  | 'match'
  | 'injury'
  | 'recovery'
  | 'nutrition'
  | 'wearable'
  | 'gps'
  | 'laboratory'
  | 'report'
  | 'research'
  | 'ai_recommendation'
  | 'passport_version';

export type TimelineViewerRole =
  | 'coach'
  | 'sports_scientist'
  | 'clinical'
  | 'research'
  | 'athlete';

export type TimelineVisibilityLevel =
  | 'public'
  | 'coach'
  | 'sports_scientist'
  | 'clinical'
  | 'research'
  | 'athlete_self';

export type TimelineEventSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export type TimelineEventCategory =
  | 'performance'
  | 'training'
  | 'medical'
  | 'recovery'
  | 'nutrition'
  | 'technology'
  | 'reporting'
  | 'research'
  | 'system';

export interface TimelineSourceReference {
  collection: string;
  document_id?: string | null;
  subcollection?: string | null;
  label?: string | null;
}

export interface TimelineKeyMetric {
  key: string;
  label: string;
  value: string | number | null;
  unit?: string | null;
}

export interface TimelineVersionMetadata {
  timeline_schema_version: string;
  builder_version: string;
  source_event_count: number;
}

/** One timeline index event — summary only, no raw payload. */
export interface ScientificTimelineEvent {
  event_id: string;
  athlete_id: string;
  organization_id: string;
  occurred_at: string;
  event_type: ScientificTimelineEventType;
  category: TimelineEventCategory;
  title: string;
  summary: string;
  source_reference: TimelineSourceReference;
  evidence_tier: EvidenceTier;
  visibility: TimelineVisibilityLevel;
  severity: TimelineEventSeverity;
  tags: string[];
  key_metrics: TimelineKeyMetric[];
  version_metadata?: TimelineVersionMetadata | null;
}

/** Assembled athlete scientific timeline. */
export interface AthleteScientificTimeline {
  timeline_id: string;
  athlete_id: string;
  organization_id: string;
  viewer_role: TimelineViewerRole;
  built_at: string;
  events: ScientificTimelineEvent[];
  version_metadata: TimelineVersionMetadata;
}

export const TIMELINE_SCHEMA_VERSION = '1.0.0';
export const TIMELINE_BUILDER_VERSION = '6D.2';

export const ALL_TIMELINE_EVENT_TYPES: ScientificTimelineEventType[] = [
  'assessment',
  'training',
  'match',
  'injury',
  'recovery',
  'nutrition',
  'wearable',
  'gps',
  'laboratory',
  'report',
  'research',
  'ai_recommendation',
  'passport_version',
];

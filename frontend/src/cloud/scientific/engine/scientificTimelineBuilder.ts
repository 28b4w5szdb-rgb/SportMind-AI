/**
 * Scientific Timeline builder (Phase 6D.2).
 *
 * Assembles chronological index events from available source data.
 */

import type { RecommendationItem } from '@/src/analytics/types';
import type { MockPerformanceTest, MockReport, DailyCheckIn } from '@/src/data/mock/types';
import type { InjuryRecord } from '@/src/features/sports-medicine/types';
import type { TrainingPlan } from '@/src/features/training-builder/types';
import type { DailyNutritionLog } from '@/src/features/nutrition/types';
import type { WearableDataRecord } from '@/src/features/wearables/types';

import {
  TIMELINE_BUILDER_VERSION,
  TIMELINE_SCHEMA_VERSION,
  type AthleteScientificTimeline,
  type ScientificTimelineEvent,
  type ScientificTimelineEventType,
  type TimelineEventCategory,
  type TimelineEventSeverity,
  type TimelineKeyMetric,
  type TimelineSourceReference,
  type TimelineViewerRole,
  type TimelineVisibilityLevel,
} from '../models/timeline/ScientificTimeline';
import type { TimelineBuildContext } from '../models/timeline/TimelineBuildInput';
import type { EvidenceTier } from '../models/common';

function ref(
  collection: string,
  documentId?: string | null,
  subcollection?: string | null,
  label?: string | null
): TimelineSourceReference {
  return { collection, document_id: documentId ?? null, subcollection: subcollection ?? null, label: label ?? null };
}

function metric(key: string, label: string, value: string | number | null, unit?: string): TimelineKeyMetric {
  return { key, label, value, unit: unit ?? null };
}

function event(
  partial: Omit<ScientificTimelineEvent, 'organization_id' | 'version_metadata'> & { organization_id?: string }
): ScientificTimelineEvent {
  return {
    ...partial,
    organization_id: partial.organization_id ?? '',
    version_metadata: null,
    tags: partial.tags ?? [],
    key_metrics: partial.key_metrics ?? [],
  };
}

function sortEvents(events: ScientificTimelineEvent[]): ScientificTimelineEvent[] {
  return [...events].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}

function categoryForType(type: ScientificTimelineEventType): TimelineEventCategory {
  switch (type) {
    case 'assessment':
    case 'match':
      return 'performance';
    case 'training':
      return 'training';
    case 'injury':
    case 'laboratory':
      return 'medical';
    case 'recovery':
      return 'recovery';
    case 'nutrition':
      return 'nutrition';
    case 'wearable':
    case 'gps':
      return 'technology';
    case 'report':
      return 'reporting';
    case 'research':
      return 'research';
    case 'ai_recommendation':
    case 'passport_version':
      return 'system';
    default:
      return 'performance';
  }
}

function buildAssessmentEvents(
  orgId: string,
  athleteId: string,
  tests: MockPerformanceTest[],
  visibility: TimelineVisibilityLevel
): ScientificTimelineEvent[] {
  return tests.map((test) => {
    const ssid = test.ssid;
    const metrics: TimelineKeyMetric[] = [
      metric('value', 'Result', test.value, test.unit),
    ];
    if (ssid) {
      metrics.push(metric('classification', 'SSID', ssid.classificationId));
      metrics.push(metric('decision', 'Decision', ssid.coachingDecision));
    }
    return event({
      event_id: `assessment_${test.id}`,
      athlete_id: athleteId,
      organization_id: orgId,
      occurred_at: `${test.date}T12:00:00.000Z`,
      event_type: 'assessment',
      category: categoryForType('assessment'),
      title: test.test_type,
      summary: `${test.value} ${test.unit}${ssid ? ` · ${ssid.classificationId}` : ''}`,
      source_reference: ref(
        test.scientificSessionId ? 'assessment_sessions' : 'performance_tests',
        test.scientificSessionId ?? test.id,
        test.scientificSessionId ? 'interpretations' : null,
        'Assessment session'
      ),
      evidence_tier: test.scientificSessionId ? 'professional' : 'field',
      visibility,
      severity: 'info',
      tags: ['assessment', test.test_type_key],
      key_metrics: metrics,
    });
  });
}

function buildTrainingEvents(orgId: string, athleteId: string, plans: TrainingPlan[]): ScientificTimelineEvent[] {
  return plans.flatMap((plan) =>
    plan.sessions
      .filter((s) => s.status !== 'planned')
      .map((s) => {
        const occurred = s.execution?.logged_at ?? `${s.date}T18:00:00.000Z`;
        const load = s.execution?.actual_session_load ?? s.session_load;
        return event({
          event_id: `training_${s.id}`,
          athlete_id: athleteId,
          organization_id: orgId,
          occurred_at: occurred.includes('T') ? occurred : `${occurred}T18:00:00.000Z`,
          event_type: 'training',
          category: categoryForType('training'),
          title: s.titleKey,
          summary: `${s.status} · load ${load}`,
          source_reference: ref('training_plans', plan.id, 'sessions', 'Training session'),
          evidence_tier: 'field',
          visibility: 'coach',
          severity: s.execution?.post_session_pain && s.execution.post_session_pain >= 6 ? 'medium' : 'info',
          tags: ['training', s.templateId, s.status],
          key_metrics: [
            metric('load', 'Session load', load),
            metric('rpe', 'RPE', s.execution?.actual_rpe ?? null),
          ],
        });
      })
  );
}

function buildInjuryEvents(
  orgId: string,
  athleteId: string,
  injuries: InjuryRecord[],
  viewerRole: TimelineViewerRole
): ScientificTimelineEvent[] {
  const isClinical = viewerRole === 'clinical';
  return injuries.map((inj) =>
    event({
      event_id: `injury_${inj.id}`,
      athlete_id: athleteId,
      organization_id: orgId,
      occurred_at: `${inj.injury_date}T08:00:00.000Z`,
      event_type: 'injury',
      category: categoryForType('injury'),
      title: isClinical ? `${inj.body_region} injury` : `${inj.body_region} — availability update`,
      summary: isClinical
        ? `${inj.status} · pain ${inj.pain_level}/10 · RTP ${inj.rtp_phase}`
        : `${inj.status} · RTP ${inj.rtp_phase}`,
      source_reference: ref('injury_records', inj.id, null, 'Injury record'),
      evidence_tier: 'clinical' as EvidenceTier,
      visibility: isClinical ? 'clinical' : 'coach',
      severity: inj.status === 'active' ? 'high' : inj.status === 'rehab' ? 'medium' : 'low',
      tags: ['injury', inj.body_region, inj.status],
      key_metrics: isClinical
        ? [
            metric('pain', 'Pain', inj.pain_level, '/10'),
            metric('rtp_phase', 'RTP phase', inj.rtp_phase),
          ]
        : [metric('rtp_phase', 'RTP phase', inj.rtp_phase)],
    })
  );
}

function buildRecoveryEvents(orgId: string, athleteId: string, checkIns: DailyCheckIn[]): ScientificTimelineEvent[] {
  return checkIns.map((c) =>
    event({
      event_id: `recovery_${c.id}`,
      athlete_id: athleteId,
      organization_id: orgId,
      occurred_at: `${c.date}T07:00:00.000Z`,
      event_type: 'recovery',
      category: categoryForType('recovery'),
      title: 'Daily wellness check-in',
      summary: `Sleep ${c.sleep_duration_hours}h · fatigue ${c.fatigue}/10 · mood ${c.mood}/10`,
      source_reference: ref('daily_check_ins', c.id, null, 'Wellness check-in'),
      evidence_tier: 'screening',
      visibility: 'coach',
      severity: c.fatigue >= 7 || c.pain_level >= 6 ? 'medium' : 'info',
      tags: ['recovery', 'check-in'],
      key_metrics: [
        metric('sleep', 'Sleep', c.sleep_duration_hours, 'h'),
        metric('fatigue', 'Fatigue', c.fatigue, '/10'),
        metric('mood', 'Mood', c.mood, '/10'),
      ],
    })
  );
}

function buildNutritionEvents(orgId: string, athleteId: string, logs: DailyNutritionLog[]): ScientificTimelineEvent[] {
  return logs.map((log) => {
    const cals = log.meals.reduce((s, m) => s + m.calories, 0);
    const protein = log.meals.reduce((s, m) => s + m.protein_g, 0);
    return event({
      event_id: `nutrition_${log.id}`,
      athlete_id: athleteId,
      organization_id: orgId,
      occurred_at: `${log.date}T20:00:00.000Z`,
      event_type: 'nutrition',
      category: categoryForType('nutrition'),
      title: 'Daily nutrition log',
      summary: `${cals} kcal · ${protein}g protein · ${log.water_liters}L water`,
      source_reference: ref('nutrition_logs', log.id, null, 'Nutrition log'),
      evidence_tier: 'screening',
      visibility: 'coach',
      severity: 'info',
      tags: ['nutrition'],
      key_metrics: [
        metric('calories', 'Calories', cals, 'kcal'),
        metric('protein', 'Protein', protein, 'g'),
        metric('hydration', 'Water', log.water_liters, 'L'),
      ],
    });
  });
}

function buildWearableEvents(orgId: string, athleteId: string, records: WearableDataRecord[]): ScientificTimelineEvent[] {
  return records.map((r) => {
    const m = r.metrics;
    const hrv = typeof m.hrv === 'number' ? m.hrv : null;
    const sleep = typeof m.sleep_duration === 'number' ? m.sleep_duration : null;
    return event({
      event_id: `wearable_${r.id}`,
      athlete_id: athleteId,
      organization_id: orgId,
      occurred_at: r.recorded_at,
      event_type: 'wearable',
      category: categoryForType('wearable'),
      title: `${r.provider_id} sync`,
      summary: [hrv != null ? `HRV ${hrv} ms` : null, sleep != null ? `Sleep ${sleep} h` : null]
        .filter(Boolean)
        .join(' · ') || 'Device data synced',
      source_reference: ref('wearable_records', r.id, null, 'Wearable snapshot'),
      evidence_tier: 'field',
      visibility: 'coach',
      severity: 'info',
      tags: ['wearable', r.provider_id],
      key_metrics: [
        metric('hrv', 'HRV', hrv, 'ms'),
        metric('sleep', 'Sleep', sleep, 'h'),
      ],
    });
  });
}

function buildReportEvents(orgId: string, athleteId: string, reports: MockReport[]): ScientificTimelineEvent[] {
  return reports
    .filter((r) => r.athlete_id === athleteId)
    .map((r) =>
      event({
        event_id: `report_${r.id}`,
        athlete_id: athleteId,
        organization_id: orgId,
        occurred_at: r.created_at,
        event_type: 'report',
        category: categoryForType('report'),
        title: r.title,
        summary: `Report ${r.status}`,
        source_reference: ref('reports', r.id, null, 'Athlete report'),
        evidence_tier: 'professional',
        visibility: 'coach',
        severity: 'info',
        tags: ['report', r.status],
        key_metrics: [metric('status', 'Status', r.status)],
      })
    );
}

function buildAiPlaceholderEvents(
  orgId: string,
  athleteId: string,
  recommendations: RecommendationItem[]
): ScientificTimelineEvent[] {
  return recommendations.slice(0, 3).map((rec, index) =>
    event({
      event_id: `ai_placeholder_${rec.id}_${index}`,
      athlete_id: athleteId,
      organization_id: orgId,
      occurred_at: new Date().toISOString(),
      event_type: 'ai_recommendation',
      category: categoryForType('ai_recommendation'),
      title: rec.titleKey,
      summary: rec.bodyKey,
      source_reference: ref('analytics', athleteId, null, 'Analytics recommendation placeholder'),
      evidence_tier: 'screening',
      visibility: 'coach',
      severity: rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low',
      tags: ['ai', 'placeholder', rec.moduleId],
      key_metrics: [metric('priority', 'Priority', rec.priority)],
    })
  );
}

function buildPassportVersionEvent(
  orgId: string,
  athleteId: string,
  passport: NonNullable<TimelineBuildContext['sources']['passport']>
): ScientificTimelineEvent {
  return event({
    event_id: `passport_${passport.passport_id}`,
    athlete_id: athleteId,
    organization_id: orgId,
    occurred_at: passport.built_at,
    event_type: 'passport_version',
    category: categoryForType('passport_version'),
    title: 'Digital passport updated',
    summary: `${passport.version_metadata.sections_available} sections available · ${passport.version_metadata.sections_missing} missing`,
    source_reference: ref('athlete_passport', passport.passport_id, null, 'Passport summary'),
    evidence_tier: 'professional',
    visibility: 'coach',
    severity: 'info',
    tags: ['passport', 'summary'],
    key_metrics: [
      metric('schema', 'Schema', passport.version_metadata.passport_schema_version),
      metric('sections', 'Sections', passport.version_metadata.sections_available),
    ],
  });
}

function buildResearchEvents(
  orgId: string,
  athleteId: string,
  tests: MockPerformanceTest[]
): ScientificTimelineEvent[] {
  return tests.slice(0, 2).map((test) =>
    event({
      event_id: `research_${test.id}`,
      athlete_id: athleteId,
      organization_id: orgId,
      occurred_at: `${test.date}T12:00:00.000Z`,
      event_type: 'research',
      category: categoryForType('research'),
      title: 'De-identified assessment index',
      summary: `${test.test_type_key} performance index recorded`,
      source_reference: ref('research_datasets', test.scientificSessionId ?? test.id, null, 'Research index'),
      evidence_tier: 'research',
      visibility: 'research',
      severity: 'info',
      tags: ['research', 'de-identified'],
      key_metrics: [metric('index', 'Performance index', test.value, test.unit)],
    })
  );
}

/** Build all timeline events from available sources. */
export function buildTimelineEvents(context: TimelineBuildContext): ScientificTimelineEvent[] {
  const { orgId, athleteId, viewerRole = 'coach', sources } = context;
  const visibility: TimelineVisibilityLevel =
    viewerRole === 'clinical' ? 'clinical' : viewerRole === 'research' ? 'research' : 'coach';

  const athleteTests = (sources.tests ?? []).filter((t) => t.athlete_id === athleteId);
  const events: ScientificTimelineEvent[] = [
    ...buildAssessmentEvents(orgId, athleteId, athleteTests, visibility),
    ...buildTrainingEvents(orgId, athleteId, (sources.trainingPlans ?? []).filter((p) => p.athlete_id === athleteId)),
    ...buildInjuryEvents(orgId, athleteId, (sources.injuries ?? []).filter((i) => i.athlete_id === athleteId), viewerRole),
    ...buildRecoveryEvents(orgId, athleteId, (sources.checkIns ?? []).filter((c) => c.athlete_id === athleteId)),
    ...buildNutritionEvents(orgId, athleteId, (sources.nutritionLogs ?? []).filter((l) => l.athlete_id === athleteId)),
    ...buildWearableEvents(orgId, athleteId, (sources.wearableRecords ?? []).filter((r) => r.athlete_id === athleteId)),
    ...buildReportEvents(orgId, athleteId, sources.reports ?? []),
    ...buildAiPlaceholderEvents(orgId, athleteId, sources.recommendations ?? sources.analytics?.recommendations ?? []),
  ];

  if (sources.passport) {
    events.push(buildPassportVersionEvent(orgId, athleteId, sources.passport));
  }

  if (viewerRole === 'research') {
    events.push(...buildResearchEvents(orgId, athleteId, athleteTests));
  }

  return sortEvents(events);
}

/** Assemble full athlete scientific timeline. */
export function buildAthleteScientificTimeline(context: TimelineBuildContext): AthleteScientificTimeline {
  const events = buildTimelineEvents(context);
  return {
    timeline_id: `timeline_${context.athleteId}_${context.asOf ?? new Date().toISOString().slice(0, 10)}`,
    athlete_id: context.athleteId,
    organization_id: context.orgId,
    viewer_role: context.viewerRole ?? 'coach',
    built_at: new Date().toISOString(),
    events,
    version_metadata: {
      timeline_schema_version: TIMELINE_SCHEMA_VERSION,
      builder_version: TIMELINE_BUILDER_VERSION,
      source_event_count: events.length,
    },
  };
}

/**
 * Decision context builder — assembles role-filtered AI context from Scientific Core (Phase 9.0).
 */

import type { AthletePassport } from '../../models/passport/AthletePassport';
import type { AthleteScientificTimeline } from '../../models/timeline/ScientificTimeline';
import type { AssessmentSession } from '../../models/session/AssessmentSession';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockPerformanceTest } from '@/src/data/mock/types';

import { collectEvidenceSummary } from './evidenceCollector';
import type {
  BuildDecisionContextInput,
  DecisionContextAssessment,
  DecisionContextPassportSection,
  DecisionContextSsidInsight,
  DecisionContextTimelineEvent,
  DecisionContextTrend,
  SdssDecisionContext,
} from '../models/DecisionContext';

function mapPassportSections(passport: AthletePassport | null | undefined): DecisionContextPassportSection[] {
  if (!passport) return [];
  return Object.values(passport.sections).map((s) => ({
    section_id: s.section_id,
    title: s.title,
    field_count: s.summary_fields.length,
    confidence: s.confidence,
    is_missing: s.is_missing,
  }));
}

function mapTimelineEvents(timeline: AthleteScientificTimeline | null | undefined): DecisionContextTimelineEvent[] {
  if (!timeline) return [];
  return timeline.events.slice(0, 15).map((e) => ({
    event_id: e.event_id,
    event_type: e.event_type,
    title: e.title,
    summary: e.summary,
    occurred_at: e.occurred_at,
    severity: e.severity,
  }));
}

function mapSessions(sessions: AssessmentSession[] = []): DecisionContextAssessment[] {
  return sessions.slice(0, 8).map((s) => {
    const metric = s.calculated_metrics[0] ?? s.raw_measurements[0];
    return {
      session_id: s.session_id,
      assessment_key: s.assessment_definition_key,
      metric_key: metric?.metric_key ?? 'primary',
      value: metric?.value ?? 0,
      unit: metric?.unit ?? '',
      normative_band: s.normative_comparison.performance_band ?? null,
      ssid_classification: s.interpretation?.payload?.classification_id ?? null,
      conducted_at: s.conducted_at,
    };
  });
}

function mapTestsAsAssessments(tests: MockPerformanceTest[] = []): DecisionContextAssessment[] {
  return [...tests]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map((t) => ({
      session_id: t.scientificSessionId ?? t.id,
      assessment_key: t.test_type_key,
      metric_key: t.test_type_key,
      value: t.value,
      unit: t.unit,
      normative_band: t.ssid?.performanceLevel ?? null,
      ssid_classification: t.ssid?.classificationId ?? null,
      conducted_at: `${t.date}T12:00:00.000Z`,
    }));
}

function mapSsidInsights(analytics: AthleteAnalyticsSnapshot | null | undefined): DecisionContextSsidInsight[] {
  const bundle = analytics?.ssid;
  if (!bundle) return [];
  const insights: DecisionContextSsidInsight[] = [];
  for (const interp of Object.values(bundle)) {
    if (!interp || typeof interp !== 'object' || !('metricId' in interp)) continue;
    insights.push({
      metric_key: interp.metricId,
      classification_id: interp.classificationId,
      risk_level: 'unknown',
      coaching_decision: interp.coachingDecision,
    });
  }
  return insights.slice(0, 6);
}

function mapTrends(analytics: AthleteAnalyticsSnapshot | null | undefined): DecisionContextTrend[] {
  if (!analytics?.trends?.length) return [];
  return analytics.trends.slice(0, 5).map((t) => ({
    metric: t.labelKey,
    direction: t.direction,
    label: t.labelKey,
  }));
}

function labNotesFromTests(tests: MockPerformanceTest[] = []): string[] {
  return tests
    .filter((t) => t.test_type_key.includes('lab') || t.test_type.includes('Lab'))
    .slice(0, 3)
    .map((t) => `${t.test_type}: ${t.value} ${t.unit} (${t.date})`);
}

/** Build canonical SSDI decision context — never exposes hidden RBAC fields. */
export function buildDecisionContext(input: BuildDecisionContextInput): SdssDecisionContext {
  const assessments =
    input.sessions && input.sessions.length > 0
      ? mapSessions(input.sessions)
      : mapTestsAsAssessments(input.tests);

  const partial: SdssDecisionContext = {
    context_id: `ctx_${input.athleteId ?? 'team'}_${Date.now()}`,
    organization_id: input.organizationId,
    athlete_id: input.athleteId,
    athlete_display_name: input.athleteDisplayName,
    viewer_role: input.viewerRole,
    locale: input.locale,
    passport_sections: mapPassportSections(input.passport),
    timeline_events: mapTimelineEvents(input.timeline),
    latest_assessments: assessments,
    ssid_insights: mapSsidInsights(input.analytics),
    training_load: input.trainingLoad ?? null,
    recovery: input.recovery ?? null,
    nutrition: input.nutrition ?? null,
    wearables: input.wearables ?? null,
    laboratory_notes: labNotesFromTests(input.tests),
    recent_trends: mapTrends(input.analytics),
    analytics_decision_level: input.analytics?.decision.level ?? null,
    analytics_overall_score: input.analytics?.overall.score ?? null,
    evidence_summary: {
      tier_counts: {},
      available_sources: [],
      missing_sources: [],
      overall_completeness_pct: 0,
    },
    built_at: new Date().toISOString(),
  };

  partial.evidence_summary = collectEvidenceSummary(partial);
  return partial;
}

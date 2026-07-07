/**
 * SSDI decision context — canonical AI input assembled from Scientific Core (Phase 9.0).
 * Never includes hidden RBAC fields.
 */

import type { EvidenceTier } from '../../models/common';
import type { SdssViewerRole } from './SdssRecommendation';

export interface DecisionContextPassportSection {
  section_id: string;
  title: string;
  field_count: number;
  confidence: string;
  is_missing: boolean;
}

export interface DecisionContextTimelineEvent {
  event_id: string;
  event_type: string;
  title: string;
  summary: string;
  occurred_at: string;
  severity: string;
}

export interface DecisionContextAssessment {
  session_id: string;
  assessment_key: string;
  metric_key: string;
  value: number;
  unit: string;
  normative_band: string | null;
  ssid_classification: string | null;
  conducted_at: string;
}

export interface DecisionContextSsidInsight {
  metric_key: string;
  classification_id: string;
  risk_level: string;
  coaching_decision: string;
}

export interface DecisionContextTrainingLoad {
  acwr: number | null;
  compliance_percent: number | null;
  completed_sessions: number | null;
}

export interface DecisionContextRecovery {
  recovery_score: number | null;
  fatigue: number | null;
  sleep_hours: number | null;
  hrv: number | null;
}

export interface DecisionContextNutrition {
  calories: number | null;
  protein_g: number | null;
  hydration_liters: number | null;
}

export interface DecisionContextWearable {
  provider: string | null;
  resting_hr: number | null;
  recovery_score: number | null;
  last_sync: string | null;
}

export interface DecisionContextTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  label: string;
}

export interface DecisionContextEvidenceSummary {
  tier_counts: Partial<Record<EvidenceTier, number>>;
  available_sources: string[];
  missing_sources: string[];
  overall_completeness_pct: number;
}

/** Canonical decision context for SSDI — role-filtered, no hidden fields. */
export interface SdssDecisionContext {
  context_id: string;
  organization_id: string;
  athlete_id: string | null;
  athlete_display_name: string | null;
  viewer_role: SdssViewerRole;
  locale: 'en' | 'ar' | 'bilingual';
  passport_sections: DecisionContextPassportSection[];
  timeline_events: DecisionContextTimelineEvent[];
  latest_assessments: DecisionContextAssessment[];
  ssid_insights: DecisionContextSsidInsight[];
  training_load: DecisionContextTrainingLoad | null;
  recovery: DecisionContextRecovery | null;
  nutrition: DecisionContextNutrition | null;
  wearables: DecisionContextWearable | null;
  laboratory_notes: string[];
  recent_trends: DecisionContextTrend[];
  analytics_decision_level: string | null;
  analytics_overall_score: number | null;
  evidence_summary: DecisionContextEvidenceSummary;
  built_at: string;
}

export interface BuildDecisionContextInput {
  organizationId: string;
  athleteId: string | null;
  athleteDisplayName: string | null;
  viewerRole: SdssViewerRole;
  locale: 'en' | 'ar' | 'bilingual';
  passport?: import('../../models/passport/AthletePassport').AthletePassport | null;
  timeline?: import('../../models/timeline/ScientificTimeline').AthleteScientificTimeline | null;
  analytics?: import('@/src/analytics/types').AthleteAnalyticsSnapshot | null;
  sessions?: import('../../models/session/AssessmentSession').AssessmentSession[];
  trainingLoad?: DecisionContextTrainingLoad | null;
  recovery?: DecisionContextRecovery | null;
  nutrition?: DecisionContextNutrition | null;
  wearables?: DecisionContextWearable | null;
  tests?: import('@/src/data/mock/types').MockPerformanceTest[];
}

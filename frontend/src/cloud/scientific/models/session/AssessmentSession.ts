/**
 * Universal Assessment Session — append-only scientific event model.
 * Path: `organizations/{orgId}/assessment_sessions/{sessionId}`.
 */

import type {
  BilingualText,
  CloudDocumentMeta,
  DataSourceType,
  EvidenceTier,
} from '../common';
import type { NormativeSourceQuality } from '../catalog/NormativeReference';
import type { ScientificInterpretation } from '../interpretation/ScientificInterpretation';

export type AssessmentSessionStatus = 'draft' | 'validated' | 'completed' | 'archived';

export type RawMeasurementQualityFlag = 'ok' | 'estimated' | 'invalid';

export type CalculatedMetricSource = 'formula' | 'manual' | 'aggregate';

export interface AssessmentSessionContext {
  location_id?: string | null;
  environment_notes?: string | null;
  warmup_completed?: boolean | null;
  notes?: string | null;
}

export interface RawMeasurement {
  measurement_id: string;
  trial: number;
  metric_key: string;
  value: number;
  unit: string;
  device_reference?: string | null;
  quality_flag?: RawMeasurementQualityFlag | null;
  captured_at: string;
}

export interface CalculatedMetric {
  metric_key: string;
  value: number;
  unit: string;
  formula_version?: string | null;
  calculation_source: CalculatedMetricSource;
}

export interface NormativeComparisonSnapshot {
  profile_key?: string | null;
  performance_band?: string | null;
  percentile?: number | null;
  z_score?: number | null;
  confidence?: number | null;
  source_quality?: NormativeSourceQuality | null;
  classification?: string | null;
  reason?: string | null;
  recommendation?: string | null;
}

export interface SessionInterpretationState {
  status: 'pending' | 'ready' | 'reviewed';
  interpretation_version?: string | null;
  generated: boolean;
  reviewed: boolean;
  payload?: ScientificInterpretation | null;
}

/** @deprecated alias — use SessionInterpretationState */
export type SessionInterpretationPlaceholder = SessionInterpretationState;

export interface ProtocolSnapshot {
  protocol_version: string;
  equipment_requirements: BilingualText;
  evidence_tier: EvidenceTier;
  contraindications: BilingualText;
}

/** Full assessment session document — Raw → Derived → Interpretation pipeline. */
export interface AssessmentSession extends CloudDocumentMeta {
  session_id: string;
  athlete_id: string;
  organization_id: string;
  team_id?: string | null;
  season_id?: string | null;
  assessment_definition_id: string;
  assessment_definition_key: string;
  protocol_version: string;
  evidence_tier_snapshot: EvidenceTier;
  conducted_at: string;
  conducted_by: string;
  source_type: DataSourceType;
  session_context: AssessmentSessionContext;
  status: AssessmentSessionStatus;
  raw_measurements: RawMeasurement[];
  calculated_metrics: CalculatedMetric[];
  normative_comparison: NormativeComparisonSnapshot;
  interpretation: SessionInterpretationState;
  protocol_snapshot: ProtocolSnapshot;
}

export type RawMeasurementInput = Omit<RawMeasurement, 'measurement_id'> & {
  measurement_id?: string;
};

export interface CreateAssessmentSessionInput {
  athlete_id: string;
  organization_id: string;
  team_id?: string | null;
  season_id?: string | null;
  assessment_definition_key: string;
  conducted_by: string;
  source_type: DataSourceType;
  session_context?: AssessmentSessionContext;
  raw_measurements?: RawMeasurementInput[];
  conducted_at?: string;
  normative_context?: SessionNormativeContext;
}

export interface SessionNormativeContext {
  sport?: string | null;
  age?: number | null;
  sex?: 'male' | 'female' | 'mixed' | 'other' | null;
  position?: string | null;
  competition_level?: string | null;
}

export interface AssessmentSessionSnapshot {
  session_id: string;
  athlete_id: string;
  organization_id: string;
  assessment_definition_key: string;
  conducted_at: string;
  status: AssessmentSessionStatus;
  primary_metric?: CalculatedMetric | null;
  normative_comparison: NormativeComparisonSnapshot;
  protocol_version: string;
}

export interface AssessmentSessionSummary {
  session_id: string;
  assessment_name: string;
  assessment_key: string;
  athlete_id: string;
  conducted_at: string;
  status: AssessmentSessionStatus;
  primary_value?: number | null;
  primary_unit?: string | null;
  performance_band?: string | null;
  classification?: string | null;
  trial_count: number;
  calculated_metric_count: number;
}

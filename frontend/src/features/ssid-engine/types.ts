/** Sports Science Interpretation & Decision (SSID) domain model. */

export type SsidMetricId =
  | 'bmi'
  | 'body_fat'
  | 'body_water'
  | 'muscle_mass'
  | 'lean_mass'
  | 'vo2_max'
  | 'hr_zones'
  | 'session_load'
  | 'acwr'
  | 'recovery_score'
  | 'readiness_score';

export type SsidCoachingDecisionId =
  | 'train_normally'
  | 'reduce_load'
  | 'recovery_session'
  | 'mobility_session'
  | 'medical_evaluation'
  | 'increase_calories'
  | 'increase_protein'
  | 'increase_hydration'
  | 'retest'
  | 'maintain';

export interface SsidRecommendationSet {
  immediateKey: string;
  weeklyKey: string;
  longTermKey: string;
}

/** Standard 12-field sports science interpretation output. */
export interface SsidInterpretation {
  metricId: SsidMetricId;
  /** When interpretation originates from a performance test. */
  sourceType?: 'calculator' | 'performance_test';
  testKey?: string;
  categoryId?: string;
  performanceLevel?: 'elite' | 'good' | 'average' | 'below';
  result: number | string;
  unit: string;
  classificationId: string;
  classificationKey: string;
  scientificMeaningKey: string;
  physiologicalInterpretationKey: string;
  performanceImpactKey: string;
  riskAnalysisKey: string;
  referenceComparisonKey: string;
  coachingDecision: SsidCoachingDecisionId;
  coachingDecisionKey: string;
  aiRecommendationKey: string;
  recommendations: SsidRecommendationSet;
  scientificReferenceKey: string;
  confidence: number;
  referenceValue?: number;
  referenceLabelKey?: string;
}

export interface SsidMetricContext {
  ageYears?: number;
  gender?: 'male' | 'female';
  sport?: string;
  weightKg?: number;
  heightCm?: number;
  referenceValue?: number;
  extras?: Record<string, number | string>;
}

export interface SsidMetricBundle {
  bmi?: SsidInterpretation;
  bodyFat?: SsidInterpretation;
  bodyWater?: SsidInterpretation;
  muscleMass?: SsidInterpretation;
  leanMass?: SsidInterpretation;
  vo2Max?: SsidInterpretation;
  hrZones?: SsidInterpretation;
  sessionLoad?: SsidInterpretation;
  acwr?: SsidInterpretation;
  recoveryScore?: SsidInterpretation;
  readinessScore?: SsidInterpretation;
}

export type SsidMetricInterpreter = (
  value: number,
  unit: string,
  context?: SsidMetricContext
) => SsidInterpretation;

export interface SsidMetricRegistration {
  id: SsidMetricId;
  labelKey: string;
  defaultUnit: string;
  interpret: SsidMetricInterpreter;
}

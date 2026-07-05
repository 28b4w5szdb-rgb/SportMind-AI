/** Core analytics domain types — mock-backed, structured for future real data wiring. */

export type AnalyticsModuleId =
  | 'physical_fitness'
  | 'strength'
  | 'speed'
  | 'endurance'
  | 'agility'
  | 'flexibility'
  | 'recovery'
  | 'training_load'
  | 'fatigue'
  | 'injury_risk'
  | 'readiness'
  | 'training_compliance';

export type ModuleStatus = 'excellent' | 'good' | 'moderate' | 'low' | 'critical';

export type TrendDirection = 'up' | 'down' | 'stable';

export type DecisionLevel =
  | 'ready_to_train'
  | 'train_reduced_load'
  | 'recovery_day'
  | 'medical_evaluation';

export type BenchmarkScope = 'previous' | 'team_average' | 'age_group' | 'position';

export type TrendPeriod = 'daily' | 'weekly' | 'monthly' | 'season';

export interface AnalyticsModuleResult {
  id: AnalyticsModuleId;
  labelKey: string;
  score: number;
  maxScore: number;
  status: ModuleStatus;
  trend: TrendDirection;
  trendDelta: number;
  color: string;
  recommendationKey?: string;
  weight: number;
}

export interface OverallAthleteScore {
  score: number;
  maxScore: number;
  percentileLabel: ModuleStatus;
  color: string;
  trend: TrendDirection;
  trendDelta: number;
  modules: AnalyticsModuleResult[];
}

export interface KpiCardData {
  id: string;
  labelKey: string;
  value: number;
  unit?: string;
  displayValue: string;
  status: ModuleStatus;
  trend: TrendDirection;
  trendDelta: number;
  color: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

export interface RecommendationItem {
  id: string;
  moduleId: AnalyticsModuleId;
  priority: 'high' | 'medium' | 'low';
  titleKey: string;
  bodyKey: string;
  actionKey?: string;
}

export interface DecisionSupportResult {
  level: DecisionLevel;
  titleKey: string;
  bodyKey: string;
  color: string;
  confidence: number;
}

export interface BenchmarkComparison {
  scope: BenchmarkScope;
  labelKey: string;
  athleteValue: number;
  referenceValue: number;
  delta: number;
  deltaPercent: number;
  status: 'above' | 'at' | 'below';
}

export interface TrendPoint {
  label: string;
  value: number;
  date?: string;
}

export interface TrendSeries {
  period: TrendPeriod;
  labelKey: string;
  points: TrendPoint[];
  direction: TrendDirection;
  changePercent: number;
}

export interface AthleteAnalyticsSnapshot {
  overall: OverallAthleteScore;
  kpis: KpiCardData[];
  recommendations: RecommendationItem[];
  decision: DecisionSupportResult;
  benchmarks: BenchmarkComparison[];
  trends: TrendSeries[];
  strengths: AnalyticsModuleResult[];
  weaknesses: AnalyticsModuleResult[];
  radarAxes: { labelKey: string; value: number; max: number }[];
}

export interface AnalyticsEngineContext {
  athleteId: string;
  position?: string;
  ageYears?: number;
  teamAvgOverall?: number;
  teamAvgReadiness?: number;
  previousOverallScore?: number;
}

export interface AnalyticsRawSignals {
  status: 'active' | 'injured' | 'rest';
  testsCount: number;
  trendPercent: number;
  heightCm?: number;
  weightKg?: number;
  testSignals: Partial<Record<'yoyo' | 'sprint30' | 'cmj' | 'beep', number>>;
}

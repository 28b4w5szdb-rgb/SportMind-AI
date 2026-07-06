import type { AthleteStatus } from '@/src/data/mock/types';

export type RankingCategory =
  | 'overall'
  | 'readiness'
  | 'injury_risk'
  | 'fatigue'
  | 'recovery'
  | 'training_compliance'
  | 'nutrition_compliance';

export type PositionGroupId = 'defender' | 'midfielder' | 'forward' | 'goalkeeper';

export type TeamAlertId =
  | 'high_injury_risk'
  | 'low_recovery'
  | 'high_fatigue'
  | 'low_compliance'
  | 'poor_nutrition'
  | 'overload_risk';

export interface TeamMetrics {
  overallScore: number;
  readiness: number;
  recovery: number;
  fatigue: number;
  trainingLoad: number;
  injuryRisk: number;
  nutritionCompliance: number;
  trainingCompliance: number;
  activeCount: number;
  injuredCount: number;
  restCount: number;
  rosterSize: number;
}

export interface PlayerTeamMetrics {
  athleteId: string;
  athleteName: string;
  position: string;
  positionGroup: PositionGroupId;
  status: AthleteStatus;
  overallScore: number;
  readiness: number;
  recovery: number;
  fatigue: number;
  trainingLoad: number;
  injuryRisk: number;
  nutritionCompliance: number;
  trainingCompliance: number;
  trendDelta: number;
}

export interface PlayerRankingEntry {
  rank: number;
  athleteId: string;
  athleteName?: string;
  value: number;
  displayValue: string;
}

export interface PlayerRanking {
  category: RankingCategory;
  entries: PlayerRankingEntry[];
}

export interface PositionGroupAnalysis {
  id: PositionGroupId;
  labelKey: string;
  playerCount: number;
  avgOverallScore: number;
  avgReadiness: number;
  avgFatigue: number;
  avgInjuryRisk: number;
  keyWeaknessModuleId?: string;
  keyWeaknessLabelKey?: string;
}

export interface TeamAlert {
  id: TeamAlertId;
  severity: 'high' | 'medium' | 'low';
  titleKey: string;
  bodyKey: string;
  athleteId?: string;
  athleteName?: string;
}

export interface ReadinessBucket {
  id: string;
  labelKey: string;
  count: number;
}

export interface TeamTrendPoint {
  labelKey: string;
  overallScore: number;
  readiness: number;
}

export interface StaffRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  titleKey: string;
  bodyKey: string;
}

export interface TeamIntelligenceSnapshot {
  teamId?: string;
  teamName?: string;
  metrics: TeamMetrics;
  players: PlayerTeamMetrics[];
  rankings: PlayerRanking[];
  topPerformers: PlayerTeamMetrics[];
  playersAtRisk: PlayerTeamMetrics[];
  fatigueWatchlist: PlayerTeamMetrics[];
  recoveryWatchlist: PlayerTeamMetrics[];
  readinessDistribution: ReadinessBucket[];
  positionAnalysis: PositionGroupAnalysis[];
  alerts: TeamAlert[];
  trends: TeamTrendPoint[];
  aiSummary: string;
  staffRecommendations: StaffRecommendation[];
}

export interface TeamIntelligenceInput {
  athletes: import('@/src/data/mock/types').MockAthlete[];
  tests: import('@/src/data/mock/types').MockPerformanceTest[];
  dailyCheckIns: import('@/src/data/mock/types').DailyCheckIn[];
  injuries: import('@/src/data/mock/types').InjuryRecord[];
  trainingPlans: import('@/src/data/mock/types').TrainingPlan[];
  nutritionLogs: import('@/src/data/mock/types').DailyNutritionLog[];
  bodyCompositionRecords: import('@/src/data/mock/types').BodyCompositionRecord[];
  nutritionGoalSettings: import('@/src/data/mock/types').NutritionGoalSetting[];
  teamId?: string;
  teamName?: string;
}

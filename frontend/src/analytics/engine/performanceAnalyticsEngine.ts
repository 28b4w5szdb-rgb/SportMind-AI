import type { MockAthlete, MockPerformanceTest, DailyCheckIn, InjuryRecord, TrainingPlan, DailyNutritionLog, BodyCompositionRecord, NutritionGoalSetting } from '@/src/data/mock/types';
import { buildRawSignals, ageFromDob } from '../input/buildSignals';
import { computeInjuryPreventionProfile } from '@/src/features/sports-medicine/engine/injuryPreventionEngine';
import { scoreAllModules, computeOverallScore } from '../scoring/moduleScorer';
import { buildKpiCards } from '../kpi/kpiEngine';
import { generateRecommendations } from '../recommendations/recommendationEngine';
import { generateDecision } from '../decisions/decisionEngine';
import { generateBenchmarks } from '../benchmarks/benchmarkEngine';
import { generateTrends } from '../trends/trendEngine';
import { ANALYTICS_MODULES } from '../registry/modules';
import { buildAnalyticsSsidBundle } from '@/src/features/ssid-engine';
import type { AnalyticsEngineContext, AthleteAnalyticsSnapshot } from '../types';

export interface PerformanceAnalyticsInput {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  checkIn?: DailyCheckIn;
  injuries?: InjuryRecord[];
  trainingPlans?: TrainingPlan[];
  nutritionLogs?: DailyNutritionLog[];
  bodyCompositionRecords?: BodyCompositionRecord[];
  nutritionGoalSettings?: NutritionGoalSetting[];
  wearableConnections?: import('@/src/features/wearables').WearableProviderConnection[];
  wearableRecords?: import('@/src/features/wearables').WearableDataRecord[];
  context?: Partial<AnalyticsEngineContext>;
}

export function computeAthleteAnalytics(input: PerformanceAnalyticsInput): AthleteAnalyticsSnapshot {
  const signals = buildRawSignals(input.athlete, input.tests, input.checkIn, input.trainingPlans, {
    nutritionLogs: input.nutritionLogs,
    bodyCompositionRecords: input.bodyCompositionRecords,
    nutritionGoalSettings: input.nutritionGoalSettings,
    wearableConnections: input.wearableConnections,
    wearableRecords: input.wearableRecords,
  });
  const injuries = input.injuries ?? [];
  const injuryProfile = computeInjuryPreventionProfile({
    athlete: input.athlete,
    injuries,
    checkIn: input.checkIn,
    signals,
  });
  const modules = scoreAllModules(signals, injuryProfile);
  const context: AnalyticsEngineContext = {
    athleteId: input.athlete.id,
    position: input.athlete.position,
    ageYears: ageFromDob(input.athlete.date_of_birth),
    teamAvgOverall: input.context?.teamAvgOverall,
    teamAvgReadiness: input.context?.teamAvgReadiness,
    previousOverallScore: input.context?.previousOverallScore,
  };

  const overall = computeOverallScore(modules, context.previousOverallScore);
  const sorted = [...modules].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3);
  const weaknesses = [...modules].sort((a, b) => a.score - b.score).slice(0, 3);

  const radarModuleIds = ['strength', 'speed', 'endurance', 'agility', 'flexibility', 'recovery'] as const;
  const radarAxes = radarModuleIds.map((id) => {
    const mod = modules.find((m) => m.id === id)!;
    const def = ANALYTICS_MODULES.find((d) => d.id === id)!;
    return { labelKey: def.labelKey, value: mod.score, max: 100 };
  });

  return {
    overall,
    kpis: buildKpiCards(modules),
    recommendations: generateRecommendations(modules),
    decision: generateDecision(modules),
    benchmarks: generateBenchmarks(overall, context),
    trends: generateTrends(overall, input.athlete.id),
    strengths,
    weaknesses,
    radarAxes,
    ssid: buildAnalyticsSsidBundle(modules, signals.training),
  };
}

/** Public facade — import from `@/src/analytics` across app modules. */
export const PerformanceAnalyticsEngine = {
  computeAthleteAnalytics,
};

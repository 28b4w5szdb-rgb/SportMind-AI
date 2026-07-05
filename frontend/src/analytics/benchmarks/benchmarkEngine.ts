import type { AnalyticsEngineContext, BenchmarkComparison, OverallAthleteScore } from '../types';

/** Benchmark architecture — mock reference values until real cohort data connects. */
export function generateBenchmarks(
  overall: OverallAthleteScore,
  context: AnalyticsEngineContext
): BenchmarkComparison[] {
  const athleteValue = overall.score;
  const previous = context.previousOverallScore ?? athleteValue - overall.trendDelta;
  const teamAvg = context.teamAvgOverall ?? athleteValue - 45;
  const ageGroup = athleteValue - 30 + (context.ageYears ? (context.ageYears - 22) * 2 : 0);
  const positionBase: Record<string, number> = {
    Forward: athleteValue - 20,
    Midfielder: athleteValue - 10,
    Defender: athleteValue - 15,
    Goalkeeper: athleteValue - 25,
  };
  const positionRef = positionBase[context.position ?? ''] ?? athleteValue - 18;

  const scopes: Array<{ scope: BenchmarkComparison['scope']; labelKey: string; ref: number }> = [
    { scope: 'previous', labelKey: 'analytics.benchmark.previous', ref: previous },
    { scope: 'team_average', labelKey: 'analytics.benchmark.team', ref: teamAvg },
    { scope: 'age_group', labelKey: 'analytics.benchmark.ageGroup', ref: ageGroup },
    { scope: 'position', labelKey: 'analytics.benchmark.position', ref: positionRef },
  ];

  return scopes.map(({ scope, labelKey, ref }) => {
    const delta = athleteValue - ref;
    const deltaPercent = ref === 0 ? 0 : Math.round((delta / ref) * 100);
    return {
      scope,
      labelKey,
      athleteValue,
      referenceValue: Math.round(ref),
      delta: Math.round(delta),
      deltaPercent,
      status: delta > 5 ? 'above' : delta < -5 ? 'below' : 'at',
    };
  });
}

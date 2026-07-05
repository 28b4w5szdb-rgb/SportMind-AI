import type { OverallAthleteScore, TrendPeriod, TrendSeries } from '../types';
import { trendFromDelta } from '../scoring/statusColors';

function seededNoise(seed: string, index: number): number {
  let h = 0;
  const s = `${seed}_${index}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return (h % 11) - 5;
}

function buildSeries(period: TrendPeriod, baseScore: number, seed: string, count: number, labelFn: (i: number) => string): TrendSeries {
  const points = Array.from({ length: count }, (_, i) => {
    const drift = (i - count + 1) * 1.2;
    const value = Math.max(0, Math.min(1000, Math.round(baseScore + drift + seededNoise(seed, i) * 8)));
    return { label: labelFn(i), value };
  });
  const first = points[0]?.value ?? baseScore;
  const last = points[points.length - 1]?.value ?? baseScore;
  const changePercent = first === 0 ? 0 : Math.round(((last - first) / first) * 100);
  return {
    period,
    labelKey: `analytics.trends.${period}`,
    points,
    direction: trendFromDelta(last - first),
    changePercent,
  };
}

export function generateTrends(overall: OverallAthleteScore, athleteId: string): TrendSeries[] {
  const base = overall.score;
  return [
    buildSeries('daily', base, athleteId, 7, (i) => `D${i + 1}`),
    buildSeries('weekly', base, `${athleteId}_w`, 8, (i) => `W${i + 1}`),
    buildSeries('monthly', base, `${athleteId}_m`, 6, (i) => `M${i + 1}`),
    buildSeries('season', base, `${athleteId}_s`, 4, (i) => `S${i + 1}`),
  ];
}

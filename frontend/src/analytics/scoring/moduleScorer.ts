import type { AnalyticsModuleId, AnalyticsModuleResult, AnalyticsRawSignals } from '../types';
import { ANALYTICS_MODULES } from '../registry/modules';
import { scoreToColor, scoreToStatus, trendFromDelta } from '../scoring/statusColors';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function normTest(value: number | undefined, good: number, elite: number, invert = false): number {
  if (value === undefined) return 55;
  const ratio = invert ? (good / Math.max(value, 0.01)) : value / elite;
  return clamp(ratio * 100);
}

type ModuleScorer = (signals: AnalyticsRawSignals) => { score: number; trendDelta: number; recommendationKey?: string };

const MODULE_SCORERS: Record<AnalyticsModuleId, ModuleScorer> = {
  physical_fitness: (s) => ({
    score: clamp(62 + s.testsCount * 1.2 + s.trendPercent * 0.8 + (s.status === 'active' ? 8 : 0)),
    trendDelta: s.trendPercent * 0.4,
  }),
  strength: (s) => ({
    score: normTest(s.testSignals.cmj, 38, 48) + (s.weightKg ? clamp((s.weightKg / 90) * 10) : 0),
    trendDelta: s.trendPercent * 0.3,
    recommendationKey: s.testSignals.cmj !== undefined && s.testSignals.cmj < 38 ? 'analytics.rec.strength' : undefined,
  }),
  speed: (s) => ({
    score: normTest(s.testSignals.sprint30, 4.2, 3.8, true),
    trendDelta: s.trendPercent * 0.35,
  }),
  endurance: (s) => ({
    score: clamp(
      (normTest(s.testSignals.yoyo, 1600, 2200) + normTest(s.testSignals.beep, 10, 14)) / 2
    ),
    trendDelta: s.trendPercent * 0.25,
  }),
  agility: (s) => ({
    score: clamp(normTest(s.testSignals.cmj, 35, 45) * 0.6 + normTest(s.testSignals.sprint30, 4.3, 3.9, true) * 0.4),
    trendDelta: s.trendPercent * 0.2,
  }),
  flexibility: (s) => {
    const base = 58 + (s.heightCm ? clamp((s.heightCm - 170) * 0.5 + 55) - 55 : 0);
    return {
      score: clamp(base - (s.status === 'injured' ? 15 : 0)),
      trendDelta: s.trendPercent * 0.15,
      recommendationKey: base < 55 ? 'analytics.rec.flexibility' : undefined,
    };
  },
  recovery: (s) => ({
    score: clamp(s.status === 'rest' ? 78 : s.status === 'injured' ? 42 : 68 + s.trendPercent * 0.5),
    trendDelta: s.trendPercent * 0.4,
    recommendationKey: s.status === 'injured' ? 'analytics.rec.recovery' : undefined,
  }),
  training_load: (s) => ({
    score: clamp(70 + s.testsCount * 0.8 - Math.abs(s.trendPercent) * 0.3),
    trendDelta: s.trendPercent * 0.2,
  }),
  fatigue: (s) => {
    const fatigueScore = clamp(75 - s.testsCount * 0.6 + (s.status === 'rest' ? 12 : 0) - Math.max(0, s.trendPercent) * 0.4);
    return {
      score: fatigueScore,
      trendDelta: -s.trendPercent * 0.25,
      recommendationKey: fatigueScore < 50 ? 'analytics.rec.fatigue' : undefined,
    };
  },
  injury_risk: (s) => {
    let risk = 82;
    if (s.status === 'injured') risk = 28;
    else if (s.status === 'rest') risk = 58;
    if (s.trendPercent < -5) risk -= 12;
    return {
      score: clamp(risk),
      trendDelta: s.trendPercent * 0.5,
      recommendationKey: risk < 50 ? 'analytics.rec.injury' : undefined,
    };
  },
  readiness: (s) => ({
    score: clamp(
      (s.status === 'active' ? 78 : s.status === 'rest' ? 65 : 40) +
        s.trendPercent * 0.6 +
        Math.min(10, s.testsCount / 3)
    ),
    trendDelta: s.trendPercent * 0.45,
  }),
  training_compliance: (s) => ({
    score: clamp(50 + Math.min(45, s.testsCount * 1.8)),
    trendDelta: s.trendPercent * 0.1,
  }),
};

export function scoreAllModules(signals: AnalyticsRawSignals): AnalyticsModuleResult[] {
  return ANALYTICS_MODULES.map((def) => {
    const result = MODULE_SCORERS[def.id](signals);
    const status = scoreToStatus(result.score);
    return {
      id: def.id,
      labelKey: def.labelKey,
      score: result.score,
      maxScore: 100,
      status,
      trend: trendFromDelta(result.trendDelta),
      trendDelta: Math.round(result.trendDelta * 10) / 10,
      color: scoreToColor(result.score),
      recommendationKey: result.recommendationKey,
      weight: def.weight,
    };
  });
}

export function computeOverallScore(modules: AnalyticsModuleResult[], previousOverall?: number): import('../types').OverallAthleteScore {
  const weighted = modules.reduce((sum, m) => sum + m.score * m.weight, 0);
  const score = Math.round(weighted * 10);
  const trendDelta = previousOverall !== undefined ? score - previousOverall : modules.reduce((s, m) => s + m.trendDelta * m.weight * 10, 0);
  const avgModuleScore = modules.reduce((s, m) => s + m.score, 0) / modules.length;
  const status = scoreToStatus(avgModuleScore);
  return {
    score,
    maxScore: 1000,
    percentileLabel: status,
    color: scoreToColor(avgModuleScore),
    trend: trendFromDelta(trendDelta),
    trendDelta: Math.round(trendDelta),
    modules,
  };
}

import type { TFunction } from 'i18next';

import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { computeAthleteAnalytics } from '../engine/performanceAnalyticsEngine';
import type { AnalyticsModuleResult, AthleteAnalyticsSnapshot } from '../types';

export interface TeamAnalyticsOverview {
  athleteCount: number;
  avgOverallScore: number;
  avgReadiness: number;
  avgFatigue: number;
  avgRecovery: number;
  avgTrainingLoad: number;
  avgInjuryRisk: number;
  aggregatedStrengths: AnalyticsModuleResult[];
  aggregatedWeaknesses: AnalyticsModuleResult[];
  primaryRecommendation: string | null;
  decisionTitleKey: string;
  snapshots: Array<{ athlete: MockAthlete; analytics: AthleteAnalyticsSnapshot }>;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function computeTeamOverview(
  athletes: MockAthlete[],
  tests: MockPerformanceTest[]
): TeamAnalyticsOverview {
  const snapshots = athletes.map((athlete) => ({
    athlete,
    analytics: computeAthleteAnalytics({
      athlete,
      tests: tests.filter((t) => t.athlete_id === athlete.id),
    }),
  }));

  if (snapshots.length === 0) {
    return {
      athleteCount: 0,
      avgOverallScore: 0,
      avgReadiness: 0,
      avgFatigue: 0,
      avgRecovery: 0,
      avgTrainingLoad: 0,
      avgInjuryRisk: 0,
      aggregatedStrengths: [],
      aggregatedWeaknesses: [],
      primaryRecommendation: null,
      decisionTitleKey: 'analytics.decision.readyTitle',
      snapshots: [],
    };
  }

  const analyticsList = snapshots.map((s) => s.analytics);
  const kpi = (id: string) =>
    avg(analyticsList.map((a) => a.kpis.find((k) => k.id === id)?.value ?? 0));

  const strengthPool = analyticsList.flatMap((a) => a.strengths);
  const weaknessPool = analyticsList.flatMap((a) => a.weaknesses);
  const topStrengths = [...strengthPool]
    .sort((a, b) => b.score - a.score)
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, 3);
  const topWeaknesses = [...weaknessPool]
    .sort((a, b) => a.score - b.score)
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, 3);

  const allRecs = analyticsList.flatMap((a) => a.recommendations);
  const primaryRec = allRecs.sort((a, b) => (a.priority === 'high' ? -1 : 1))[0];

  const decisions = analyticsList.map((a) => a.decision);
  const medical = decisions.filter((d) => d.level === 'medical_evaluation').length;
  const recovery = decisions.filter((d) => d.level === 'recovery_day').length;
  const decisionTitleKey =
    medical > 0
      ? 'analytics.decision.medicalTitle'
      : recovery > athletes.length / 2
        ? 'analytics.decision.recoveryTitle'
        : 'analytics.decision.readyTitle';

  return {
    athleteCount: athletes.length,
    avgOverallScore: avg(analyticsList.map((a) => a.overall.score)),
    avgReadiness: kpi('readiness'),
    avgFatigue: kpi('fatigue'),
    avgRecovery: kpi('recovery'),
    avgTrainingLoad: kpi('training_load'),
    avgInjuryRisk: kpi('injury_risk'),
    aggregatedStrengths: topStrengths,
    aggregatedWeaknesses: topWeaknesses,
    primaryRecommendation: primaryRec?.bodyKey ?? null,
    decisionTitleKey,
    snapshots,
  };
}

export function buildAiSummaryFromAnalytics(overview: TeamAnalyticsOverview, isRTL: boolean): string {
  if (overview.athleteCount === 0) {
    return isRTL ? 'أضف لاعبين لتفعيل التحليلات.' : 'Add athletes to enable analytics insights.';
  }
  const s = overview.aggregatedStrengths[0];
  const w = overview.aggregatedWeaknesses[0];
  if (isRTL) {
    return `متوسط النتيجة الإجمالية ${overview.avgOverallScore}/1000. الجاهزية ${overview.avgReadiness}%. ${
      w ? `مجال التركيز: ${w.id}.` : ''
    } ${overview.primaryRecommendation ? 'راجع التوصيات في لوحة التحكم.' : ''}`;
  }
  return `Squad avg score ${overview.avgOverallScore}/1000. Readiness ${overview.avgReadiness}%. ${
    w ? `Focus area: ${w.id.replace('_', ' ')}.` : ''
  } ${overview.primaryRecommendation ? 'See recommendations on the dashboard.' : ''}`;
}

export function buildAnalyticsReportSections(analytics: AthleteAnalyticsSnapshot, t: TFunction): {
  overall_score: string;
  kpi_summary: string;
  strengths: string;
  weaknesses: string;
  recommendations: string;
  decision_support: string;
} {
  const kpiLines = analytics.kpis.map((k) => `${t(k.labelKey)}: ${k.displayValue}`).join('\n');
  const strengthLines = analytics.strengths.map((m) => `${t(m.labelKey)} (${m.score})`).join('\n');
  const weaknessLines = analytics.weaknesses.map((m) => `${t(m.labelKey)} (${m.score})`).join('\n');
  const recLines = analytics.recommendations.map((r) => `${t(r.titleKey)} — ${t(r.bodyKey)}`).join('\n');

  return {
    overall_score: `${analytics.overall.score} / ${analytics.overall.maxScore} (${t(`analytics.status.${analytics.overall.percentileLabel}`)})`,
    kpi_summary: kpiLines,
    strengths: strengthLines || '—',
    weaknesses: weaknessLines || '—',
    recommendations: recLines || '—',
    decision_support: `${t(analytics.decision.titleKey)} — ${t(analytics.decision.bodyKey)} (${t('analytics.decision.confidence')}: ${analytics.decision.confidence}%)`,
  };
}

export function formatAthleteAnalyticsForAI(analytics: AthleteAnalyticsSnapshot, athleteName: string, isRTL: boolean): string {
  const readiness = analytics.kpis.find((k) => k.id === 'readiness');
  const fatigue = analytics.kpis.find((k) => k.id === 'fatigue');
  const injury = analytics.kpis.find((k) => k.id === 'injury_risk');
  const load = analytics.kpis.find((k) => k.id === 'training_load');

  if (isRTL) {
    return (
      `📊 تحليل ${athleteName}:\n` +
      `• النتيجة الإجمالية: ${analytics.overall.score}/1000\n` +
      `• الجاهزية: ${readiness?.displayValue ?? '—'}\n` +
      `• الإرهاق: ${fatigue?.displayValue ?? '—'}\n` +
      `• خطر الإصابة: ${injury?.displayValue ?? '—'}\n` +
      `• حمل التدريب: ${load?.displayValue ?? '—'}\n` +
      `• القرار: ${analytics.decision.level}`
    );
  }
  return (
    `📊 Analytics for ${athleteName}:\n` +
    `• Overall score: ${analytics.overall.score}/1000\n` +
    `• Readiness: ${readiness?.displayValue ?? '—'}\n` +
    `• Fatigue: ${fatigue?.displayValue ?? '—'}\n` +
    `• Injury risk: ${injury?.displayValue ?? '—'}\n` +
    `• Training load: ${load?.displayValue ?? '—'}\n` +
    `• Decision: ${analytics.decision.level}`
  );
}

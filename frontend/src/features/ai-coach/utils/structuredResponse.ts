import type { AnalyticsCoachContext } from '@/src/data/mock/ai-coach';
import type { StructuredAiResponse, StructuredAiSection } from '../types';
import { formatAnalyticsStatus, formatDecisionLevel, kpiLine } from './labels';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';

type TranslateFn = (key: string) => string;

function section(id: StructuredAiSection['id'], titleKey: string, items: string[]): StructuredAiSection | null {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;
  return { id, titleKey, items: filtered };
}

function buildAthleteStructured(
  analytics: AthleteAnalyticsSnapshot,
  athleteName: string,
  isRTL: boolean,
  t: TranslateFn
): StructuredAiResponse {
  const primaryRec = analytics.recommendations[0];
  const nextActions = analytics.recommendations.slice(0, 3).map((rec) => `• ${t(rec.titleKey)}`);

  const sections = [
    section('summary', 'aiCoach.sections.summary', [
      isRTL
        ? `${athleteName}: ${kpiLine(analytics, 'readiness', t)} · ${analytics.overall.score}/1000`
        : `${athleteName}: ${kpiLine(analytics, 'readiness', t)} · overall ${analytics.overall.score}/1000`,
    ]),
    section('indicators', 'aiCoach.sections.indicators', [
      `• ${kpiLine(analytics, 'fatigue', t)}`,
      `• ${kpiLine(analytics, 'recovery', t)}`,
      `• ${kpiLine(analytics, 'injury_risk', t)}`,
      `• ${kpiLine(analytics, 'training_load', t)}`,
    ]),
    section('interpretation', 'aiCoach.sections.interpretation', [
      t(analytics.decision.bodyKey),
      analytics.strengths[0] ? `• ${t(analytics.strengths[0].labelKey)} (${analytics.strengths[0].score})` : '',
      analytics.weaknesses[0] ? `• ${t(analytics.weaknesses[0].labelKey)} (${analytics.weaknesses[0].score})` : '',
    ]),
    section('decision', 'aiCoach.sections.decision', [
      `• ${t(analytics.decision.titleKey)}`,
      `• ${formatDecisionLevel(analytics.decision.level, t)} (${formatAnalyticsStatus(analytics.decision.level.includes('medical') ? 'critical' : 'moderate', t)})`,
    ]),
    section('recommendations', 'aiCoach.sections.recommendations', primaryRec ? [`• ${t(primaryRec.titleKey)}`, t(primaryRec.bodyKey)] : []),
    section('nextActions', 'aiCoach.sections.nextActions', nextActions.length ? nextActions : [isRTL ? '• راجع الفحص اليومي' : '• Review daily check-in']),
    section('confidence', 'aiCoach.sections.confidence', [`${analytics.decision.confidence}%`]),
    section('references', 'aiCoach.sections.references', [t('aiCoach.referencePlaceholder')]),
  ].filter(Boolean) as StructuredAiSection[];

  return {
    sections,
    confidence: analytics.decision.confidence,
    referencePlaceholder: t('aiCoach.referencePlaceholder'),
  };
}

export function structuredToPlainText(structured: StructuredAiResponse, t: TranslateFn): string {
  return structured.sections
    .map((s) => `${t(s.titleKey)}\n${s.items.join('\n')}`)
    .join('\n\n');
}

export function buildStructuredFromContext(
  ctx: AnalyticsCoachContext,
  isRTL: boolean,
  t: TranslateFn
): StructuredAiResponse | undefined {
  if (ctx.primary) {
    return buildAthleteStructured(ctx.primary, ctx.athleteName ?? (isRTL ? 'اللاعب' : 'Athlete'), isRTL, t);
  }
  if (ctx.teamIntelligence) {
    const m = ctx.teamIntelligence.metrics;
    const topRec = ctx.teamIntelligence.staffRecommendations[0];
    return {
      sections: [
        section('summary', 'aiCoach.sections.summary', [ctx.teamIntelligence.aiSummary])!,
        section('indicators', 'aiCoach.sections.indicators', [
          `• ${t('analytics.kpi.readiness')}: ${m.readiness}%`,
          `• ${t('analytics.kpi.fatigue')}: ${m.fatigue}%`,
          `• ${t('analytics.kpi.injuryRisk')}: ${m.injuryRisk}%`,
          `• ${t('teamIntelligence.trainingCompliance')}: ${m.trainingCompliance}%`,
        ])!,
        section('decision', 'aiCoach.sections.decision', topRec ? [`• ${t(topRec.titleKey)}`, t(topRec.bodyKey)] : [])!,
        section('confidence', 'aiCoach.sections.confidence', ['91%'])!,
        section('references', 'aiCoach.sections.references', [t('aiCoach.referencePlaceholder')])!,
      ].filter(Boolean) as StructuredAiSection[],
      confidence: 91,
      referencePlaceholder: t('aiCoach.referencePlaceholder'),
    };
  }
  return undefined;
}

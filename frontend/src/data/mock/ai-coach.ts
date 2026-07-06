/** Mock AI Coach agents, prompts, and analytics-aware response templates. */

import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { TeamAnalyticsOverview } from '@/src/analytics/summary/teamOverview';
import { formatAthleteAnalyticsForAI } from '@/src/analytics/summary/teamOverview';
import type { NutritionSnapshot } from '@/src/features/nutrition/types';
import { formatNutritionForAI } from '@/src/features/nutrition/utils/nutritionHelpers';

export type AiAgentId = 'performance' | 'recovery' | 'nutrition' | 'planning';

export interface AiAgent {
  id: AiAgentId;
  icon: ComponentProps<typeof Ionicons>['name'];
  labelEn: string;
  labelAr: string;
  color: string;
}

export interface AiConversation {
  id: string;
  title: string;
  titleAr: string;
  agentId: AiAgentId;
  updatedAt: string;
  messageCount: number;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentId?: AiAgentId;
}

export interface AnalyticsCoachContext {
  primary?: AthleteAnalyticsSnapshot;
  team?: TeamAnalyticsOverview;
  athleteName?: string;
  nutrition?: NutritionSnapshot;
}

export const AI_AGENTS: AiAgent[] = [
  { id: 'performance', icon: 'analytics', labelEn: 'Performance', labelAr: 'الأداء', color: '#0066FF' },
  { id: 'recovery', icon: 'heart', labelEn: 'Recovery', labelAr: 'التعافي', color: '#10B981' },
  { id: 'nutrition', icon: 'restaurant', labelEn: 'Nutrition', labelAr: 'التغذية', color: '#F97316' },
  { id: 'planning', icon: 'calendar', labelEn: 'Planning', labelAr: 'التخطيط', color: '#8B5CF6' },
];

export const SUGGESTED_PROMPTS = [
  {
    id: 'a1',
    textEn: 'Analyze athlete readiness',
    textAr: 'حلل جاهزية اللاعب',
    agentId: 'performance' as AiAgentId,
    analyticsTopic: 'readiness' as const,
  },
  {
    id: 'a2',
    textEn: 'Explain injury risk',
    textAr: 'اشرح خطر الإصابة',
    agentId: 'performance' as AiAgentId,
    analyticsTopic: 'injury' as const,
  },
  {
    id: 'a3',
    textEn: 'Compare performance trend',
    textAr: 'قارن اتجاه الأداء',
    agentId: 'performance' as AiAgentId,
    analyticsTopic: 'trend' as const,
  },
  {
    id: 'a4',
    textEn: 'Recommend training load',
    textAr: 'اوصِ بحمل تدريبي',
    agentId: 'planning' as AiAgentId,
    analyticsTopic: 'load' as const,
  },
  {
    id: 'p1',
    textEn: 'Analyze Ahmed Hassan sprint test trends',
    textAr: 'حلل اتجاهات اختبار السرعة لأحمد حسن',
    agentId: 'performance' as AiAgentId,
  },
  {
    id: 'p2',
    textEn: 'What recovery plan fits a heavy training week?',
    textAr: 'ما خطة التعافي المناسبة لأسبوع تدريب مكثف؟',
    agentId: 'recovery' as AiAgentId,
  },
  {
    id: 'p3',
    textEn: 'Compare Yo-Yo results across the squad',
    textAr: 'قارن نتائج Yo-Yo بين أعضاء الفريق',
    agentId: 'performance' as AiAgentId,
  },
  {
    id: 'p4',
    textEn: 'Build a pre-season microcycle for midfielders',
    textAr: 'أنشئ دورة تدريبية قصيرة قبل الموسم للوسط',
    agentId: 'planning' as AiAgentId,
  },
];

export const RECENT_CONVERSATIONS: AiConversation[] = [
  {
    id: 'c1',
    title: 'Sprint training optimization',
    titleAr: 'تحسين تدريب السرعة',
    agentId: 'performance',
    updatedAt: '2h ago',
    messageCount: 12,
  },
  {
    id: 'c2',
    title: 'Recovery strategies discussion',
    titleAr: 'استراتيجيات التعافي',
    agentId: 'recovery',
    updatedAt: 'Yesterday',
    messageCount: 8,
  },
  {
    id: 'c3',
    title: 'Performance benchmarks review',
    titleAr: 'مراجعة معايير الأداء',
    agentId: 'performance',
    updatedAt: '3 days ago',
    messageCount: 15,
  },
];

const MOCK_RESPONSES: Record<AiAgentId, { en: string; ar: string }> = {
  performance: {
    en: 'Based on recent test data, the athlete shows positive repeat-sprint trends. I recommend maintaining current load while adding one neuromuscular session per week.',
    ar: 'بناءً على بيانات الاختبار الأخيرة، يظهر اللاعب اتجاهات إيجابية في تكرار السرعة. أوصي بالحفاظ على الحمل الحالي مع إضافة جلسة عصبية عضلية أسبوعياً.',
  },
  recovery: {
    en: 'For a heavy training week, prioritize 8+ hours sleep, protein within 30 min post-session, and active recovery (20 min low-intensity cardio).',
    ar: 'في أسبوع تدريب مكثف، أولِ 8+ ساعات نوم، بروtein خلال 30 دقيقة بعد الجلسة، وتعافياً نشطاً (20 دقيقة cardio منخفض).',
  },
  nutrition: {
    en: 'Match-day nutrition: carb-load 24h prior (6–8 g/kg), hydrate with electrolytes, and avoid high-fiber meals 3h before kickoff.',
    ar: 'تغذية يوم المباراة: تحميل كربohydrates قبل 24 ساعة (6–8 g/kg)، ترطيب بإلكتروليت، وتجنب وجبات عالية الألياف قبل 3 ساعات من البداية.',
  },
  planning: {
    en: 'Suggested 7-day microcycle: Mon HIIT + strength, Tue technical, Wed recovery, Thu small-sided games, Fri activation, Sat match prep, Sun rest.',
    ar: 'دورة 7 أيام مقترحة: الاثنين HIIT + قوة، الثلاثاء تقني، الأربعاء تعافي، الخميس ألعاب مصغرة، الجمعة تفعيل، السبت تحضير مباراة، الأحد راحة.',
  },
};

type AnalyticsTopic = 'readiness' | 'injury' | 'load' | 'trend' | 'performance';
type NutritionTopic = 'macros' | 'hydration' | 'protein' | 'compliance' | 'goal';

function detectNutritionTopic(message: string): NutritionTopic | null {
  const m = message.toLowerCase();
  if (/protein|بروtein|بروتين/.test(message)) return 'protein';
  if (/hydration|water|ماء|ترطيب/.test(message)) return 'hydration';
  if (/calorie|macro|سعر|ماكرو/.test(m)) return 'macros';
  if (/compliance|امتثال|التزام/.test(message)) return 'compliance';
  if (/goal|weight|fat|muscle|هدف|وزن|دهون|عضل/.test(m)) return 'goal';
  if (/meal|supplement|تغذ|وجب|مكمل/.test(m)) return 'macros';
  return null;
}

function buildNutritionTopicResponse(topic: NutritionTopic, ctx: AnalyticsCoachContext, isRTL: boolean): string {
  const snap = ctx.nutrition!;
  const name = ctx.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete');
  const { totals, targets, hydration, compliancePercent, goal, primaryRecommendation } = snap;

  switch (topic) {
    case 'protein':
      return isRTL
        ? `🥩 بروtein ${name}: ${totals.protein_g}/${targets.protein_g}g (${Math.round((totals.protein_g / targets.protein_g) * 100)}%).\n` +
            (totals.protein_g < targets.protein_g * 0.85 ? 'زِد البروtein في الوجبات التالية.' : 'البروtein ضمن الهدف.')
        : `🥩 Protein for ${name}: ${totals.protein_g}/${targets.protein_g}g (${Math.round((totals.protein_g / targets.protein_g) * 100)}%).\n` +
            (totals.protein_g < targets.protein_g * 0.85 ? 'Increase protein at upcoming meals.' : 'Protein intake on target.');

    case 'hydration':
      return isRTL
        ? `💧 ترطيب ${name}: ${totals.water_liters}/${targets.water_liters}L (${hydration.hydrationPercent}%). خطر التعرق: ${hydration.sweatRisk}.`
        : `💧 Hydration for ${name}: ${totals.water_liters}/${targets.water_liters}L (${hydration.hydrationPercent}%). Sweat risk: ${hydration.sweatRisk}.`;

    case 'compliance':
      return isRTL
        ? `📋 امتثال التغذية لـ ${name}: ${compliancePercent}%. السعرات ${totals.calories}/${targets.calories} kcal.`
        : `📋 Nutrition compliance for ${name}: ${compliancePercent}%. Calories ${totals.calories}/${targets.calories} kcal.`;

    case 'goal':
      return isRTL
        ? `🎯 هدف التغذية: ${goal}. التقدم ${snap.goalProgress}%.`
        : `🎯 Nutrition goal: ${goal}. Progress ${snap.goalProgress}%.`;

    case 'macros':
    default:
      return formatNutritionForAI(snap, name, isRTL);
  }
}

function detectAnalyticsTopic(message: string): AnalyticsTopic | null {
  const m = message.toLowerCase();
  if (/readiness|ready|جاهز|جاهزية/.test(message)) return 'readiness';
  if (/injury|injured|risk|إصاب|خطر/.test(message)) return 'injury';
  if (/load|volume|intensity|حمل|شدة/.test(message)) return 'load';
  if (/trend|compare|اتجاه|قارن|مقار/.test(message)) return 'trend';
  if (/performance|score|kpi|أداء|نتيج/.test(message)) return 'performance';
  if (/analyze|analysis|حلل|تحليل/.test(m)) return 'performance';
  return null;
}

function kpiValue(analytics: AthleteAnalyticsSnapshot, id: string) {
  return analytics.kpis.find((k) => k.id === id);
}

function buildTopicResponse(topic: AnalyticsTopic, ctx: AnalyticsCoachContext, isRTL: boolean): string {
  const analytics = ctx.primary!;
  const name = ctx.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete');
  const readiness = kpiValue(analytics, 'readiness');
  const fatigue = kpiValue(analytics, 'fatigue');
  const injury = kpiValue(analytics, 'injury_risk');
  const load = kpiValue(analytics, 'training_load');
  const recovery = kpiValue(analytics, 'recovery');
  const weekly = analytics.trends.find((tr) => tr.period === 'weekly');
  const primaryRec = analytics.recommendations[0];

  switch (topic) {
    case 'readiness':
      return isRTL
        ? `📊 جاهزية ${name}: ${readiness?.displayValue ?? '—'} (${readiness?.status ?? 'moderate'}).\n\n` +
            `الإرهاق ${fatigue?.displayValue ?? '—'} والتعافي ${recovery?.displayValue ?? '—'}. ` +
            `القرار: ${analytics.decision.level.replace(/_/g, ' ')}.\n\n` +
            (primaryRec ? `💡 ${primaryRec.titleKey}` : '')
        : `📊 Readiness for ${name}: ${readiness?.displayValue ?? '—'} (${readiness?.status ?? 'moderate'}).\n\n` +
            `Fatigue ${fatigue?.displayValue ?? '—'}, recovery ${recovery?.displayValue ?? '—'}. ` +
            `Decision: ${analytics.decision.level.replace(/_/g, ' ')}.\n\n` +
            (primaryRec ? `💡 See recommendation: ${primaryRec.titleKey}` : '');

    case 'injury':
      return isRTL
        ? `⚠️ خطر الإصابة لـ ${name}: ${injury?.displayValue ?? '—'} (${injury?.status ?? 'moderate'}).\n\n` +
            `الجاهزية ${readiness?.displayValue ?? '—'} والإرهاق ${fatigue?.displayValue ?? '—'}. ` +
            `${analytics.decision.level === 'medical_evaluation' ? 'يُنصح بتقييم طبي قبل التدريب العالي.' : 'راقب الأعراض خلال 48 ساعة.'}`
        : `⚠️ Injury risk for ${name}: ${injury?.displayValue ?? '—'} (${injury?.status ?? 'moderate'}).\n\n` +
            `Readiness ${readiness?.displayValue ?? '—'}, fatigue ${fatigue?.displayValue ?? '—'}. ` +
            `${analytics.decision.level === 'medical_evaluation' ? 'Medical evaluation advised before high-intensity work.' : 'Monitor symptoms over the next 48h.'}`;

    case 'load':
      return isRTL
        ? `🏋️ حمل التدريب لـ ${name}: ${load?.displayValue ?? '—'}.\n\n` +
            `الجاهزية ${readiness?.displayValue ?? '—'} والإرهاق ${fatigue?.displayValue ?? '—'}. ` +
            `${analytics.decision.level === 'train_reduced_load' ? 'خفّض الحجم 20–30% هذا الأسبوع.' : 'الحمل الحالي ضمن النطاق المستهدف.'}`
        : `🏋️ Training load for ${name}: ${load?.displayValue ?? '—'}.\n\n` +
            `Readiness ${readiness?.displayValue ?? '—'}, fatigue ${fatigue?.displayValue ?? '—'}. ` +
            `${analytics.decision.level === 'train_reduced_load' ? 'Reduce volume 20–30% this week.' : 'Current load is within target range.'}`;

    case 'trend':
      return isRTL
        ? `📈 اتجاه الأداء لـ ${name}: النتيجة الإجمالية ${analytics.overall.score}/1000 (${analytics.overall.trendDelta > 0 ? '+' : ''}${analytics.overall.trendDelta}).\n\n` +
            (weekly
              ? `الاتجاه الأسبوعي: ${weekly.changePercent > 0 ? '+' : ''}${weekly.changePercent}%.\n`
              : '') +
            `نقاط القوة: ${analytics.strengths.map((s) => s.id).join(', ') || '—'}.`
        : `📈 Performance trend for ${name}: overall ${analytics.overall.score}/1000 (${analytics.overall.trendDelta > 0 ? '+' : ''}${analytics.overall.trendDelta}).\n\n` +
            (weekly ? `Weekly change: ${weekly.changePercent > 0 ? '+' : ''}${weekly.changePercent}%.\n` : '') +
            `Strengths: ${analytics.strengths.map((s) => s.id).join(', ') || '—'}.`;

    case 'performance':
    default:
      return formatAthleteAnalyticsForAI(analytics, name, isRTL);
  }
}

export function generateMockResponse(
  agentId: AiAgentId,
  userMessage: string,
  isRTL: boolean,
  analyticsContext?: AnalyticsCoachContext
): string {
  const topic = detectAnalyticsTopic(userMessage);
  const nutritionTopic = detectNutritionTopic(userMessage);
  const analyticsRelevant =
    topic !== null ||
    agentId === 'performance' ||
    agentId === 'recovery' ||
    agentId === 'planning' ||
    agentId === 'nutrition';

  if (analyticsContext?.nutrition && (agentId === 'nutrition' || nutritionTopic)) {
    const body = nutritionTopic
      ? buildNutritionTopicResponse(nutritionTopic, analyticsContext, isRTL)
      : formatNutritionForAI(
          analyticsContext.nutrition,
          analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
          isRTL
        );
    const rec = analyticsContext.nutrition.primaryRecommendation;
    const recLine = rec
      ? isRTL
        ? `\n\n💡 ${rec.titleKey}`
        : `\n\n💡 Recommendation available in Nutrition Center.`
      : '';
    const confidence = isRTL ? '\n\n✓ مستوى الثقة: 89%' : '\n\n✓ Confidence: 89%';
    return body + recLine + confidence;
  }

  if (analyticsContext?.primary && analyticsRelevant && topic) {
    const body = buildTopicResponse(topic, analyticsContext, isRTL);
    const confidence = isRTL
      ? `\n\n✓ مستوى الثقة: ${analyticsContext.primary.decision.confidence}%`
      : `\n\n✓ Confidence: ${analyticsContext.primary.decision.confidence}%`;
    return body + confidence;
  }

  if (analyticsContext?.primary && analyticsRelevant && (agentId === 'performance' || agentId === 'recovery')) {
    const summary = formatAthleteAnalyticsForAI(
      analyticsContext.primary,
      analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
      isRTL
    );
    const base = MOCK_RESPONSES[agentId];
    const prefix = isRTL ? base.ar.split('.')[0] + '.' : base.en.split('.')[0] + '.';
    const nutritionBlock =
      analyticsContext.nutrition && agentId === 'recovery'
        ? '\n\n' +
          formatNutritionForAI(
            analyticsContext.nutrition,
            analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
            isRTL
          )
        : '';
    return prefix + '\n\n' + summary + nutritionBlock;
  }

  if (agentId === 'nutrition' && analyticsContext?.nutrition) {
    const base = MOCK_RESPONSES.nutrition;
    const prefix = isRTL ? base.ar : base.en;
    const detail = formatNutritionForAI(
      analyticsContext.nutrition,
      analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
      isRTL
    );
    return prefix + '\n\n' + detail;
  }

  const base = MOCK_RESPONSES[agentId];
  const prefix = isRTL ? base.ar : base.en;
  const snippet = userMessage.length > 40 ? userMessage.slice(0, 40) + '…' : userMessage;
  const followUp = isRTL
    ? `\n\n📊 ملخص: بناءً على «${snippet}»، راجع حمل الأسبوع الماضي.`
    : `\n\n📊 Summary: Based on "${snippet}", review last week's load.`;
  const confidence = isRTL ? '\n\n✓ مستوى الثقة: 87%' : '\n\n✓ Confidence: 87%';
  return prefix + followUp + confidence;
}

export function getAgentById(id: AiAgentId): AiAgent | undefined {
  return AI_AGENTS.find((a) => a.id === id);
}

/** Mock AI Coach agents, prompts, and analytics-aware response templates. */

import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { TeamAnalyticsOverview } from '@/src/analytics/summary/teamOverview';
import { formatAthleteAnalyticsForAI } from '@/src/analytics/summary/teamOverview';
import type { NutritionSnapshot } from '@/src/features/nutrition/types';
import { formatNutritionForAI } from '@/src/features/nutrition/utils/nutritionHelpers';
import type { WearableDailySnapshot } from '@/src/features/wearables/types';
import { formatWearablesForAI } from '@/src/features/wearables/utils/wearableHelpers';
import type { TeamIntelligenceSnapshot } from '@/src/features/team-intelligence/types';
import { formatTeamIntelligenceForAI } from '@/src/features/team-intelligence';
import { buildWorkspaceSsidEntries, formatSsidForAI } from '@/src/features/ssid-engine';
import { buildStructuredFromContext, structuredToPlainText } from '@/src/features/ai-coach/utils/structuredResponse';
import { formatAnalyticsStatus, formatSweatRisk, formatDecisionLevel, kpiLine } from '@/src/features/ai-coach/utils/labels';
import type { MockResponseResult } from '@/src/features/ai-coach/types';

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
  structured?: import('@/src/features/ai-coach/types').StructuredAiResponse;
}

export interface AnalyticsCoachContext {
  primary?: AthleteAnalyticsSnapshot;
  team?: TeamAnalyticsOverview;
  teamIntelligence?: TeamIntelligenceSnapshot;
  athleteName?: string;
  nutrition?: NutritionSnapshot;
  wearables?: WearableDailySnapshot;
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
    id: 't1',
    textEn: 'Who is most ready on the squad?',
    textAr: 'من الأكثر جاهزية في الفريق؟',
    agentId: 'performance' as AiAgentId,
    analyticsTopic: 'team_ready' as const,
  },
  {
    id: 't2',
    textEn: 'Who is at injury risk?',
    textAr: 'من معرض لخطر الإصابة؟',
    agentId: 'performance' as AiAgentId,
    analyticsTopic: 'team_injury' as const,
  },
  {
    id: 't3',
    textEn: 'Which position needs improvement?',
    textAr: 'أي مركز يحتاج تحسين؟',
    agentId: 'planning' as AiAgentId,
    analyticsTopic: 'team_position' as const,
  },
  {
    id: 't4',
    textEn: 'What should the team focus on this week?',
    textAr: 'على ماذا يركز الفريق هذا الأسبوع؟',
    agentId: 'planning' as AiAgentId,
    analyticsTopic: 'team_focus' as const,
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
    ar: 'في أسبوع تدريب مكثف، أولِ 8+ ساعات نوم، البروتين خلال 30 دقيقة بعد الجلسة، وتعافياً نشطاً (20 دقيقة cardio خفيف).',
  },
  nutrition: {
    en: 'Match-day nutrition: carb-load 24h prior (6–8 g/kg), hydrate with electrolytes, and avoid high-fiber meals 3h before kickoff.',
    ar: 'تغذية يوم المباراة: تحميل كربوهيدرات قبل 24 ساعة (6–8 جم/كغ)، ترطيب بإلكتروليت، وتجنب وجبات عالية الألياف قبل 3 ساعات من البداية.',
  },
  planning: {
    en: 'Suggested 7-day microcycle: Mon HIIT + strength, Tue technical, Wed recovery, Thu small-sided games, Fri activation, Sat match prep, Sun rest.',
    ar: 'دورة 7 أيام مقترحة: الاثنين HIIT + قوة، الثلاثاء تقني، الأربعاء تعافي، الخميس ألعاب مصغرة، الجمعة تفعيل، السبت تحضير مباراة، الأحد راحة.',
  },
};

type AnalyticsTopic = 'readiness' | 'injury' | 'load' | 'trend' | 'performance' | 'team_ready' | 'team_injury' | 'team_position' | 'team_focus' | 'team_squad';
type NutritionTopic = 'macros' | 'hydration' | 'protein' | 'compliance' | 'goal' | 'body_comp';
type TeamTopic = 'most_ready' | 'injury_risk' | 'position_weakness' | 'weekly_focus' | 'squad';

function detectTeamTopic(message: string): TeamTopic | null {
  const m = message.toLowerCase();
  if (/most ready|who is ready|أكثر جاهز|من جاهز/.test(message)) return 'most_ready';
  if (/injury risk|at risk|who is injured|خطر إصاب|معرض/.test(message)) return 'injury_risk';
  if (/position|midfield|defender|forward|goalkeeper|مركز|وسط|مدافع|حارس/.test(m) && /improve|weak|needs|تحسين|ضعف/.test(m)) {
    return 'position_weakness';
  }
  if (/focus this week|team focus|what should the team|التركيز|هذا الأسبوع|يركز الفريق/.test(message)) return 'weekly_focus';
  if (/team|squad|roster|فريق|ال squad|قائمة/.test(m)) return 'squad';
  return null;
}

type WearableTopic = 'sleep' | 'hrv' | 'resting_hr' | 'activity' | 'recovery';

function detectWearableTopic(message: string): WearableTopic | null {
  const m = message.toLowerCase();
  if (/sleep|نوم/.test(m)) return 'sleep';
  if (/hrv|heart rate variability|تقلب/.test(m)) return 'hrv';
  if (/resting hr|resting heart|morning heart|نبض الراحة|نبض صباح/.test(m)) return 'resting_hr';
  if (/steps|activity|calories|خطوات|نشاط|سعرات/.test(m)) return 'activity';
  if (/wearable|device|watch|oura|whoop|garmin|ساعة|جهاز|حلقة/.test(m)) return 'recovery';
  return null;
}

function buildWearableTopicResponse(
  topic: WearableTopic,
  ctx: AnalyticsCoachContext,
  isRTL: boolean,
  t: (key: string) => string
): string {
  const w = ctx.wearables;
  const name = ctx.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete');
  if (!w || (!w.sleepDurationHours && !w.hrv && !w.restingHeartRate && !w.steps)) {
    return isRTL ? `⌚ لا توجد بيانات أجهزة محفوظة لـ ${name}.` : `⌚ No saved wearable data for ${name}.`;
  }

  switch (topic) {
    case 'sleep':
      if (w.sleepDurationHours !== undefined && w.sleepDurationHours < 6.5) {
        return isRTL
          ? `😴 النوم منخفض (${w.sleepDurationHours}h) — خفّض الحمل وادعم جودة النوم الليلة.`
          : `😴 Sleep is low (${w.sleepDurationHours}h) — reduce load and prioritize sleep hygiene tonight.`;
      }
      return isRTL
        ? `😴 النوم ${w.sleepDurationHours ?? '—'}h · جودة ${w.sleepQuality ?? '—'}/10 — ضمن النطاق الم acceptable للتدريب.`
        : `😴 Sleep ${w.sleepDurationHours ?? '—'}h · quality ${w.sleepQuality ?? '—'}/10 — acceptable for planned training.`;
    case 'hrv':
      if (w.hrv !== undefined && w.hrv < 40) {
        return isRTL
          ? `📉 HRV منخفض (${w.hrv} ms) — قد يشير لإجهاد أو نوم غير كافٍ.`
          : `📉 HRV is decreased (${w.hrv} ms) — may indicate stress or insufficient recovery.`;
      }
      return isRTL ? `📈 HRV ${w.hrv ?? '—'} ms — ضمن النطاق المتوقع.` : `📈 HRV ${w.hrv ?? '—'} ms — within expected range.`;
    case 'resting_hr':
      if (w.restingHeartRate !== undefined && w.restingHeartRate > 68) {
        return isRTL
          ? `❤️ نبض الراحة مرتفع (${w.restingHeartRate} bpm) — راقب التعافي قبل الحمل العالي.`
          : `❤️ Resting HR is elevated (${w.restingHeartRate} bpm) — monitor recovery before high load.`;
      }
      return isRTL
        ? `❤️ نبض الراحة ${w.restingHeartRate ?? '—'} bpm — لا يوجد إشارة إجهاد واضحة.`
        : `❤️ Resting HR ${w.restingHeartRate ?? '—'} bpm — no clear stress signal.`;
    case 'activity':
      if (w.steps !== undefined && w.steps > 11000) {
        return isRTL
          ? `🚶 نشاط مرتفع (${w.steps} خطوة) — ادمج ذلك في حساب الإجهاد اليومي.`
          : `🚶 Activity is high (${w.steps} steps) — factor into daily fatigue.`;
      }
      return isRTL
        ? `🚶 الخطوات ${w.steps ?? '—'} · السعرات ${w.calories ?? '—'} — نشاط يومي معتدل.`
        : `🚶 Steps ${w.steps ?? '—'} · calories ${w.calories ?? '—'} — moderate daily activity.`;
    case 'recovery':
    default:
      return formatWearablesForAI(w, name, isRTL, t);
  }
}

function buildTeamTopicResponse(topic: TeamTopic, ctx: AnalyticsCoachContext, isRTL: boolean, translate: (key: string) => string): string {
  const snap = ctx.teamIntelligence!;
  const m = snap.metrics;
  const ready = snap.rankings.find((r) => r.category === 'readiness')?.entries[0];
  const risk = snap.rankings.find((r) => r.category === 'injury_risk')?.entries[0];
  const weakPos = [...snap.positionAnalysis].sort((a, b) => a.avgOverallScore - b.avgOverallScore)[0];
  const topRec = snap.staffRecommendations[0];

  switch (topic) {
    case 'most_ready':
      return isRTL
        ? `✅ الأكثر جاهزية: ${ready?.athleteName ?? '—'} (${ready?.displayValue ?? '—'}).\nمتوسط جاهزية الفريق ${m.readiness}%.`
        : `✅ Most ready: ${ready?.athleteName ?? '—'} (${ready?.displayValue ?? '—'}).\nSquad average readiness ${m.readiness}%.`;

    case 'injury_risk':
      return isRTL
        ? `⚠️ أعلى خطر إصابة: ${risk?.athleteName ?? '—'} (${risk?.displayValue ?? '—'}).\n` +
            (snap.playersAtRisk.length > 0
              ? `تحت المراقبة: ${snap.playersAtRisk.map((p) => p.athleteName).join(', ')}.`
              : 'لا يوجد لاعبون في نطاق الخطر العالي.')
        : `⚠️ Highest injury risk: ${risk?.athleteName ?? '—'} (${risk?.displayValue ?? '—'}).\n` +
            (snap.playersAtRisk.length > 0
              ? `Watch list: ${snap.playersAtRisk.map((p) => p.athleteName).join(', ')}.`
              : 'No players currently in high-risk band.');

    case 'position_weakness':
      return isRTL
        ? weakPos
          ? `📍 المركز الأضعف: ${weakPos.id} (${weakPos.avgOverallScore}/1000). متوسط الجاهزية ${weakPos.avgReadiness}%.`
          : 'لا توجد بيانات كافية لمقارنة المراكز.'
        : weakPos
          ? `📍 Weakest position group: ${weakPos.id} (${weakPos.avgOverallScore}/1000). Avg readiness ${weakPos.avgReadiness}%.`
          : 'Insufficient data for position comparison.';

    case 'weekly_focus':
      return isRTL
        ? `📋 الملخص\n🎯 تركيز الأسبوع للفريق\n\n` +
            `📊 المؤشرات المهمة\n` +
            (topRec ? `• ${translate(topRec.titleKey)}\n` : '') +
            `• امتثال تدريب ${m.trainingCompliance}% · تغذية ${m.nutritionCompliance}%\n` +
            `• إرهاق ${m.fatigue}% · تعافي ${m.recovery}%`
        : `📋 Summary\n🎯 Weekly team focus\n\n` +
            `📊 Key indicators\n` +
            (topRec ? `• ${translate(topRec.titleKey)}\n` : '') +
            `• Training compliance ${m.trainingCompliance}% · Nutrition ${m.nutritionCompliance}%\n` +
            `• Fatigue ${m.fatigue}% · Recovery ${m.recovery}%`;

    case 'squad':
    default:
      return formatTeamIntelligenceForAI(snap, isRTL);
  }
}

function detectNutritionTopic(message: string): NutritionTopic | null {
  const m = message.toLowerCase();
  if (/body comp|body fat|bmi|whr|waist|hip|تركيب|دهون|خصر/.test(m)) return 'body_comp';
  if (/protein|بروtein|بروتين/.test(message)) return 'protein';
  if (/hydration|water|ماء|ترطيب/.test(message)) return 'hydration';
  if (/calorie|macro|سعر|ماكرو/.test(m)) return 'macros';
  if (/compliance|امتثال|التزام/.test(message)) return 'compliance';
  if (/goal|weight|fat|muscle|هدف|وزن|دهون|عضل/.test(m)) return 'goal';
  if (/meal|supplement|تغذ|وجب|مكمل/.test(m)) return 'macros';
  return null;
}

function buildNutritionTopicResponse(topic: NutritionTopic, ctx: AnalyticsCoachContext, isRTL: boolean, t: (key: string) => string): string {
  const snap = ctx.nutrition!;
  const name = ctx.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete');
  const { totals, targets, hydration, compliance, goal, primaryRecommendation, bodyCompositionAnalysis } = snap;

  switch (topic) {
    case 'body_comp': {
      const bc = bodyCompositionAnalysis;
      if (!bc?.latest) {
        return isRTL ? `📏 لا توجد قياسات تركيب جسم مسجلة لـ ${name}.` : `📏 No body composition entries logged for ${name}.`;
      }
      return isRTL
        ? `📏 تركيب جسم ${name}: ${bc.latest.weight_kg} kg · BMI ${bc.bmi ?? '—'} · WHR ${bc.waistHipRatio ?? '—'}.\n` +
            `التغير ${bc.weightChange ?? 0} kg · ${t(bc.statusKey)}`
        : `📏 Body composition for ${name}: ${bc.latest.weight_kg} kg · BMI ${bc.bmi ?? '—'} · WHR ${bc.waistHipRatio ?? '—'}.\n` +
            `Change ${bc.weightChange ?? 0} kg · ${t(bc.statusKey)}`;
    }
    case 'protein':
      return isRTL
        ? `🥩 البروتين لـ ${name}: ${totals.protein_g}/${targets.protein_g} جم (${Math.round((totals.protein_g / targets.protein_g) * 100)}%).\n` +
            (totals.protein_g < targets.protein_g * 0.85 ? 'زِد البروتين في الوجبات التالية.' : 'البروتين ضمن الهدف.')
        : `🥩 Protein for ${name}: ${totals.protein_g}/${targets.protein_g}g (${Math.round((totals.protein_g / targets.protein_g) * 100)}%).\n` +
            (totals.protein_g < targets.protein_g * 0.85 ? 'Increase protein at upcoming meals.' : 'Protein intake on target.');

    case 'hydration':
      return isRTL
        ? `💧 ترطيب ${name}: ${totals.water_liters}/${targets.water_liters}L (${hydration.hydrationPercent}%). ${t('nutrition.sweatRiskLabel')}: ${formatSweatRisk(hydration.sweatRisk, t)}.`
        : `💧 Hydration for ${name}: ${totals.water_liters}/${targets.water_liters}L (${hydration.hydrationPercent}%). ${t('nutrition.sweatRiskLabel')}: ${formatSweatRisk(hydration.sweatRisk, t)}.`;

    case 'compliance':
      return isRTL
        ? `📋 امتثال التغذية لـ ${name}: ${compliance.overall}%. البروتين ${compliance.protein}%. الترطيب ${compliance.hydration}%.`
        : `📋 Nutrition compliance for ${name}: ${compliance.overall}%. Protein ${compliance.protein}%. Hydration ${compliance.hydration}%.`;

    case 'goal':
      return isRTL
        ? `🎯 هدف التغذية: ${goal}. التقدم ${snap.goalProgress}%.`
        : `🎯 Nutrition goal: ${goal}. Progress ${snap.goalProgress}%.`;

    case 'macros':
    default:
      return formatNutritionForAI(snap, name, isRTL);
  }
}

function detectScientificQuestion(message: string): boolean {
  const m = message.toLowerCase();
  return (
    /scientific|physiological|physiology|interpret|meaning|why is|explain the|what does|evidence|reference/.test(m) ||
    /علمي|فسّر|اشرح|لماذا|معنى|تفسير|فسيولوج|مرجع/.test(message)
  );
}

function buildSsidFormattedResponse(
  ctx: AnalyticsCoachContext,
  translate: (key: string) => string,
  isRTL: boolean,
  entryIds?: string[]
): string {
  const analytics = ctx.primary!;
  const entries = buildWorkspaceSsidEntries(analytics, ctx.nutrition?.bodyCompositionAnalysis?.ssid);
  const filtered = entryIds ? entries.filter((entry) => entryIds.includes(entry.id)) : entries;
  const body = filtered.map((entry) => formatSsidForAI(entry.interpretation, translate)).join('\n\n');
  const header = isRTL ? '🧪 التفسير العلمي الرياضي' : '🧪 Sports Science Interpretation';
  return `${header}\n\n${body}`;
}

function buildSsidTopicResponse(
  topic: AnalyticsTopic,
  ctx: AnalyticsCoachContext,
  translate: (key: string) => string,
  isRTL: boolean
): string | null {
  switch (topic) {
    case 'readiness':
      return buildSsidFormattedResponse(ctx, translate, isRTL, ['readiness', 'recovery', 'overall']);
    case 'injury':
      return buildSsidFormattedResponse(ctx, translate, isRTL, ['injury_risk', 'fatigue']);
    case 'load':
      return buildSsidFormattedResponse(ctx, translate, isRTL, ['session_load', 'acwr', 'training_load']);
    case 'performance':
    case 'trend':
      return buildSsidFormattedResponse(ctx, translate, isRTL);
    default:
      return null;
  }
}

function detectAnalyticsTopic(message: string): AnalyticsTopic | null {
  const m = message.toLowerCase();
  if (/most ready|who is ready|أكثر جاهز/.test(message)) return 'team_ready';
  if (/injury risk|at risk|خطر إصاب/.test(message) && /team|squad|who|من|فريق/.test(message)) return 'team_injury';
  if (/position|midfield|defender|forward|goalkeeper|مركز/.test(m) && /improve|weak|needs|تحسين/.test(m)) return 'team_position';
  if (/focus this week|team focus|التركيز|هذا الأسبوع/.test(message)) return 'team_focus';
  if (/team intelligence|squad analytics|ذكاء الفريق|تحليل الفريق/.test(message)) return 'team_squad';
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

function buildTopicResponse(
  topic: AnalyticsTopic,
  ctx: AnalyticsCoachContext,
  isRTL: boolean,
  translate: (key: string) => string
): string {
  const analytics = ctx.primary!;
  const name = ctx.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete');
  const readiness = kpiValue(analytics, 'readiness');
  const fatigue = kpiValue(analytics, 'fatigue');
  const injury = kpiValue(analytics, 'injury_risk');
  const load = kpiValue(analytics, 'training_load');
  const recovery = kpiValue(analytics, 'recovery');
  const weekly = analytics.trends.find((tr) => tr.period === 'weekly');
  const primaryRec = analytics.recommendations[0];
  const decisionTitle = translate(analytics.decision.titleKey);
  const decisionBody = translate(analytics.decision.bodyKey);

  switch (topic) {
    case 'readiness':
      return isRTL
        ? `📋 الملخص\n${name}: ${kpiLine(analytics, 'readiness', translate)}.\n\n` +
            `📊 المؤشرات المهمة\n` +
            `• ${kpiLine(analytics, 'fatigue', translate)}\n` +
            `• ${kpiLine(analytics, 'recovery', translate)}\n\n` +
            `🎯 القرار التدريبي\n• ${decisionTitle}\n${decisionBody}\n\n` +
            (primaryRec ? `💡 التوصية\n• ${translate(primaryRec.titleKey)}\n${translate(primaryRec.bodyKey)}` : '')
        : `📋 Summary\n${name}: ${kpiLine(analytics, 'readiness', translate)}.\n\n` +
            `📊 Key indicators\n` +
            `• ${kpiLine(analytics, 'fatigue', translate)}\n` +
            `• ${kpiLine(analytics, 'recovery', translate)}\n\n` +
            `🎯 Training decision\n• ${decisionTitle}\n${decisionBody}\n\n` +
            (primaryRec ? `💡 Recommendation\n• ${translate(primaryRec.titleKey)}\n${translate(primaryRec.bodyKey)}` : '');

    case 'injury':
      return isRTL
        ? `📋 الملخص\n${name}: ${kpiLine(analytics, 'injury_risk', translate)}.\n\n` +
            `📊 المؤشرات المهمة\n` +
            `• ${kpiLine(analytics, 'readiness', translate)}\n` +
            `• ${kpiLine(analytics, 'fatigue', translate)}\n\n` +
            `🎯 القرار التدريبي\n• ${decisionTitle}\n` +
            `${analytics.decision.level === 'medical_evaluation' ? 'يُنصح بتقييم طبي قبل التدريب العالي.' : 'راقب الأعراض خلال 48 ساعة.'}`
        : `📋 Summary\n${name}: ${kpiLine(analytics, 'injury_risk', translate)}.\n\n` +
            `📊 Key indicators\n` +
            `• ${kpiLine(analytics, 'readiness', translate)}\n` +
            `• ${kpiLine(analytics, 'fatigue', translate)}\n\n` +
            `🎯 Training decision\n• ${decisionTitle}\n` +
            `${analytics.decision.level === 'medical_evaluation' ? 'Medical evaluation advised before high-intensity work.' : 'Monitor symptoms over the next 48h.'}`;

    case 'load':
      return isRTL
        ? `📋 الملخص\n${name}: ${kpiLine(analytics, 'training_load', translate)}.\n\n` +
            `📊 المؤشرات المهمة\n` +
            `• ${kpiLine(analytics, 'readiness', translate)}\n` +
            `• ${kpiLine(analytics, 'fatigue', translate)}\n\n` +
            `🎯 القرار التدريبي\n• ${decisionTitle}\n` +
            `${analytics.decision.level === 'train_reduced_load' ? 'خفّض الحجم 20–30% هذا الأسبوع.' : 'الحمل الحالي ضمن النطاق المستهدف.'}`
        : `📋 Summary\n${name}: ${kpiLine(analytics, 'training_load', translate)}.\n\n` +
            `📊 Key indicators\n` +
            `• ${kpiLine(analytics, 'readiness', translate)}\n` +
            `• ${kpiLine(analytics, 'fatigue', translate)}\n\n` +
            `🎯 Training decision\n• ${decisionTitle}\n` +
            `${analytics.decision.level === 'train_reduced_load' ? 'Reduce volume 20–30% this week.' : 'Current load is within target range.'}`;

    case 'trend':
      return isRTL
        ? `📋 الملخص\n${name}: النتيجة الإجمالية ${analytics.overall.score}/1000 (${analytics.overall.trendDelta > 0 ? '+' : ''}${analytics.overall.trendDelta}).\n\n` +
            `📊 المؤشرات المهمة\n` +
            (weekly ? `• الاتجاه الأسبوعي: ${weekly.changePercent > 0 ? '+' : ''}${weekly.changePercent}%\n` : '') +
            `• نقاط القوة: ${analytics.strengths.map((s) => translate(s.labelKey)).join('، ') || '—'}\n\n` +
            `🎯 القرار التدريبي\n• ${decisionTitle}`
        : `📋 Summary\n${name}: overall ${analytics.overall.score}/1000 (${analytics.overall.trendDelta > 0 ? '+' : ''}${analytics.overall.trendDelta}).\n\n` +
            `📊 Key indicators\n` +
            (weekly ? `• Weekly change: ${weekly.changePercent > 0 ? '+' : ''}${weekly.changePercent}%\n` : '') +
            `• Strengths: ${analytics.strengths.map((s) => translate(s.labelKey)).join(', ') || '—'}\n\n` +
            `🎯 Training decision\n• ${decisionTitle}`;

    case 'performance':
    default:
      return formatAthleteAnalyticsForAI(analytics, name, isRTL, translate);
  }
}

export function generateMockResponse(
  agentId: AiAgentId,
  userMessage: string,
  isRTL: boolean,
  analyticsContext?: AnalyticsCoachContext,
  translate?: (key: string) => string
): MockResponseResult {
  const t = translate ?? ((key: string) => key);

  const withStructured = (body: string, confidence?: number): MockResponseResult => {
    const structured = analyticsContext ? buildStructuredFromContext(analyticsContext, isRTL, t) : undefined;
    if (structured) {
      if (confidence !== undefined) {
        structured.confidence = confidence;
        const confSection = structured.sections.find((s) => s.id === 'confidence');
        if (confSection) confSection.items = [`${confidence}%`];
      }
      return { content: structuredToPlainText(structured, t), structured };
    }
    return { content: body };
  };

  if (analyticsContext?.primary && detectScientificQuestion(userMessage)) {
    const body = buildSsidFormattedResponse(analyticsContext, t, isRTL);
    return withStructured(body, analyticsContext.primary.decision.confidence);
  }

  const teamTopic = detectTeamTopic(userMessage);
  if (analyticsContext?.teamIntelligence && teamTopic) {
    const body = buildTeamTopicResponse(teamTopic, analyticsContext, isRTL, t);
    return withStructured(body, 91);
  }

  const topic = detectAnalyticsTopic(userMessage);
  const nutritionTopic = detectNutritionTopic(userMessage);
  const wearableTopic = detectWearableTopic(userMessage);
  const analyticsRelevant =
    topic !== null ||
    agentId === 'performance' ||
    agentId === 'recovery' ||
    agentId === 'planning' ||
    agentId === 'nutrition';

  const teamTopicFromAnalytics =
    topic === 'team_ready'
      ? 'most_ready'
      : topic === 'team_injury'
        ? 'injury_risk'
        : topic === 'team_position'
          ? 'position_weakness'
          : topic === 'team_focus'
            ? 'weekly_focus'
            : topic === 'team_squad'
              ? 'squad'
              : null;

  if (
    analyticsContext?.wearables &&
    wearableTopic &&
    (agentId === 'recovery' || agentId === 'performance' || agentId === 'planning')
  ) {
    const body = buildWearableTopicResponse(wearableTopic, analyticsContext, isRTL, t);
    return withStructured(body, 88);
  }

  if (analyticsContext?.teamIntelligence && teamTopicFromAnalytics) {
    const body = buildTeamTopicResponse(teamTopicFromAnalytics, analyticsContext, isRTL, t);
    return withStructured(body, 91);
  }

  if (analyticsContext?.nutrition && (agentId === 'nutrition' || nutritionTopic)) {
    if (nutritionTopic === 'body_comp' && analyticsContext.nutrition.bodyCompositionAnalysis?.ssid && translate) {
      const bundle = analyticsContext.nutrition.bodyCompositionAnalysis.ssid;
      const entries = Object.entries(bundle)
        .filter(([, value]) => value)
        .map(([, interpretation]) => formatSsidForAI(interpretation!, t));
      const header = isRTL ? '🧪 تفسير تركيب الجسم' : '🧪 Body composition interpretation';
      return withStructured(header + '\n\n' + entries.join('\n\n'), 89);
    }
    const body = nutritionTopic
      ? buildNutritionTopicResponse(nutritionTopic, analyticsContext, isRTL, t)
      : formatNutritionForAI(
          analyticsContext.nutrition,
          analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
          isRTL
        );
    const rec = analyticsContext.nutrition.primaryRecommendation;
    const recLine = rec
      ? isRTL
        ? `\n\n💡 التوصية\n• ${t(rec.titleKey)}\n${t(rec.bodyKey)}`
        : `\n\n💡 Recommendation\n• ${t(rec.titleKey)}\n${t(rec.bodyKey)}`
      : '';
    return withStructured(body + recLine, 89);
  }

  if (analyticsContext?.primary && analyticsRelevant && topic) {
    const ssidBody = translate ? buildSsidTopicResponse(topic, analyticsContext, t, isRTL) : null;
    if (ssidBody) {
      return withStructured(ssidBody, analyticsContext.primary.decision.confidence);
    }
    const body = buildTopicResponse(topic, analyticsContext, isRTL, t);
    return withStructured(body, analyticsContext.primary.decision.confidence);
  }

  if (analyticsContext?.primary && analyticsRelevant && (agentId === 'performance' || agentId === 'recovery')) {
    const summary = formatAthleteAnalyticsForAI(
      analyticsContext.primary,
      analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
      isRTL,
      t
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
    const wearableBlock =
      analyticsContext.wearables && agentId === 'recovery'
        ? '\n\n' + formatWearablesForAI(
            analyticsContext.wearables,
            analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
            isRTL,
            t
          )
        : '';
    return withStructured(prefix + '\n\n' + summary + nutritionBlock + wearableBlock, analyticsContext.primary.decision.confidence);
  }

  if (agentId === 'nutrition' && analyticsContext?.nutrition) {
    const base = MOCK_RESPONSES.nutrition;
    const prefix = isRTL ? base.ar : base.en;
    const detail = formatNutritionForAI(
      analyticsContext.nutrition,
      analyticsContext.athleteName ?? (isRTL ? 'اللاعب' : 'the athlete'),
      isRTL
    );
    return withStructured(prefix + '\n\n' + detail, 89);
  }

  const base = MOCK_RESPONSES[agentId];
  const prefix = isRTL ? base.ar : base.en;
  const snippet = userMessage.length > 40 ? userMessage.slice(0, 40) + '…' : userMessage;
  const followUp = isRTL
    ? `\n\n📊 ملخص: بناءً على «${snippet}»، راجع حمل الأسبوع الماضي.`
    : `\n\n📊 Summary: Based on "${snippet}", review last week's load.`;
  return withStructured(prefix + followUp, 87);
}

export function getAgentById(id: AiAgentId): AiAgent | undefined {
  return AI_AGENTS.find((a) => a.id === id);
}

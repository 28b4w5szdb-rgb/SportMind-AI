/** Mock AI Coach agents, prompts, and response templates. */

import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

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

export const AI_AGENTS: AiAgent[] = [
  { id: 'performance', icon: 'analytics', labelEn: 'Performance', labelAr: 'الأداء', color: '#0066FF' },
  { id: 'recovery', icon: 'heart', labelEn: 'Recovery', labelAr: 'التعافي', color: '#10B981' },
  { id: 'nutrition', icon: 'restaurant', labelEn: 'Nutrition', labelAr: 'التغذية', color: '#F97316' },
  { id: 'planning', icon: 'calendar', labelEn: 'Planning', labelAr: 'التخطيط', color: '#8B5CF6' },
];

export const SUGGESTED_PROMPTS = [
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
    en: 'Based on recent test data, Ahmed shows a +12% improvement in repeat-sprint ability. I recommend maintaining current load while adding one neuromuscular session per week. Monitor HRV before high-intensity days.',
    ar: 'بناءً على بيانات الاختبار الأخيرة، يظهر أحمد تحسناً بنسبة +12% في القدرة على تكرار السرعة. أوصي بالحفاظ على الحمل الحالي مع إضافة جلسة عصبية عضلية أسبوعياً. راقب HRV قبل أيام الشدة العالية.',
  },
  recovery: {
    en: 'For a heavy training week, prioritize 8+ hours sleep, protein within 30 min post-session, and active recovery (20 min low-intensity cardio). Consider reducing RPE by 1–2 on day 3 if soreness persists.',
    ar: 'في أسبوع تدريب مكثف، أولِ 8+ ساعات نوم، بروtein خلال 30 دقيقة بعد الجلسة، وتعافياً نشطاً (20 دقيقة cardio منخفض). فكر بتخفيض RPE بمقدار 1–2 في اليوم الثالث إذا استمرت آلام العضلات.',
  },
  nutrition: {
    en: 'Match-day nutrition: carb-load 24h prior (6–8 g/kg), hydrate with electrolytes, and avoid high-fiber meals 3h before kickoff. Post-match: 3:1 carb-to-protein ratio within 45 minutes.',
    ar: 'تغذية يوم المباراة: تحميل كربohydrates قبل 24 ساعة (6–8 g/kg)، ترطيب بإلكتروليت، وتجنب وجبات عالية الألياف قبل 3 ساعات من البداية. بعد المباراة: نسبة 3:1 كربohydrates إلى بروtein خلال 45 دقيقة.',
  },
  planning: {
    en: 'Suggested 7-day microcycle for midfielders: Mon HIIT + strength, Tue technical, Wed recovery, Thu small-sided games, Fri activation, Sat match prep, Sun rest. Adjust load using session RPE × duration.',
    ar: 'دورة 7 أيام مقترحة للوسط: الاثنين HIIT + قوة، الثلاثاء تقني، الأربعاء تعافي، الخميس ألعاب مصغرة، الجمعة تفعيل، السبت تحضير مباراة، الأحد راحة. عدّل الحمل باستخدام RPE × المدة.',
  },
};

export function generateMockResponse(
  agentId: AiAgentId,
  _userMessage: string,
  isRTL: boolean
): string {
  const base = MOCK_RESPONSES[agentId];
  const prefix = isRTL ? base.ar : base.en;
  return prefix;
}

export function getAgentById(id: AiAgentId): AiAgent | undefined {
  return AI_AGENTS.find((a) => a.id === id);
}

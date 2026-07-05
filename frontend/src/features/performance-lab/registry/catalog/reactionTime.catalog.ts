import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['speed', 'agility', 'readiness'];

function reaction(
  key: string,
  nameEn: string,
  nameAr: string,
  elite: number,
  good: number,
  avg: number,
  protocolEn: string,
  protocolAr: string,
  featured = false
) {
  return {
    key,
    categoryId: 'reaction_time' as const,
    icon: 'timer' as const,
    unit: 'ms',
    referenceValues: refs(elite, good, avg, true),
    affectedModules: MOD,
    analyticsWeight: 0.78,
    expectedTrend: 'down' as const,
    objective: 'reaction_cognition' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Reaction and decision-speed assessment: ${nameEn}.`,
        ar: `تقييم سرعة التفاعل والقرار: ${nameAr}.`,
      },
      purpose: {
        en: 'Quantify perceptual–motor response time for sport-specific readiness profiling.',
        ar: 'قياس زمن الاستجابة الإدراكية– الحركية لملف الجاهزية الرياضي.',
      },
      equipment: { en: 'Reaction timer app, light board, or validated software', ar: 'تطبيق reaction timer أو light board أو برنامج معتمد' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: 'Mean reaction time (ms). Lower is better.', ar: 'متوسط زمن التفاعل (ms). الأقل أفضل.' },
      interpretation: {
        en: 'Fatigue and sleep debt typically add 20–50 ms to baseline.',
        ar: 'الإرهاق ونقص النوم يضيفان عادة 20–50 ms لخط الأساس.',
      },
      aiRec: {
        en: 'Reduce cognitive load in training if reaction time degrades >10% from baseline.',
        ar: 'خفّف الحمل المعرفي إذا تراجع زمن التفاعل >10% عن خط الأساس.',
      },
      notes: { en: 'Discard anticipatory false starts; minimum 10 valid trials.', ar: 'استبعد البدايات الت anticipatory؛ 10 محاولات صالحة كحد أدنى.' },
    }),
  };
}

export const REACTION_TIME_TESTS: TestDefinition[] = defineTests([
  reaction('visual_reaction', 'Simple Visual Reaction Time', 'Visual Reaction', 180, 220, 260, 'Respond to green light stimulus; 20 trials; record mean excluding outliers.', 'استجب لمحفز ضوء أخضر؛ 20 محاولة؛ متوسط بدون outliers.', true),
  reaction('audio_reaction', 'Simple Auditory Reaction Time', 'Audio Reaction', 200, 240, 280, 'Respond to tone stimulus via button press; 20 trials; dominant hand.', 'استجب لنغمة عبر زر؛ 20 محاولة؛ اليد السائدة.', false),
  reaction('choice_reaction', 'Choice Reaction Time', 'Choice Reaction', 350, 420, 500, 'Respond to stimulus A with left, B with right; 30 randomized trials.', 'محفز A يسار، B يمين؛ 30 محاولة عشوائية.', false),
  reaction('decision_reaction', 'Decision Reaction Time', 'Decision Reaction', 500, 600, 700, 'Go/no-go or sport-specific decision task; record mean correct response time.', 'Go/no-go أو مهمة قرار رياضية؛ متوسط زمن الاستجابة الصحيحة.', false),
]);

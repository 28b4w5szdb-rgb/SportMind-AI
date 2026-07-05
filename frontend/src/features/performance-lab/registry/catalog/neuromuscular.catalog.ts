import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['strength', 'fatigue', 'training_load'];

function neuro(
  key: string,
  nameEn: string,
  nameAr: string,
  elite: number,
  good: number,
  avg: number,
  unit: string,
  protocolEn: string,
  protocolAr: string,
  featured = false,
  lowerIsBetter = false
) {
  return {
    key,
    categoryId: 'neuromuscular' as const,
    icon: 'pulse' as const,
    unit,
    referenceValues: refs(elite, good, avg, lowerIsBetter),
    affectedModules: MOD,
    analyticsWeight: 0.84,
    expectedTrend: (lowerIsBetter ? 'down' : 'up') as 'up' | 'down',
    objective: 'neuromuscular' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Neuromuscular function assessment: ${nameEn}.`,
        ar: `تقييم الوظيفة العصبية العضلية: ${nameAr}.`,
      },
      purpose: {
        en: 'Monitor neuromuscular fatigue, asymmetry, and reactive capacity for load management.',
        ar: 'مراقبة الإرهاق العصبي العضلي وعدم التناظر والقدرة التفاعلية لإدارة الحمل.',
      },
      equipment: { en: 'Force plate, jump mat, or video analysis as required', ar: 'Force plate أو jump mat أو تحليل فيديو حسب الحاجة' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: `Result in ${unit}. ${lowerIsBetter ? 'Lower is better.' : 'Higher is better.'}`, ar: `النتيجة بـ ${unit}. ${lowerIsBetter ? 'الأقل أفضل.' : 'الأعلى أفضل.'}` },
      interpretation: {
        en: 'Acute drops >8% from rolling baseline suggest incomplete recovery.',
        ar: 'انخفاض حاد >8% عن خط الأساس المتحرك يشير لتعافٍ غير كامل.',
      },
      aiRec: {
        en: 'Reduce training intensity if neuromuscular markers decline across consecutive sessions.',
        ar: 'خفّف شدة التدريب إذا تراجعت markers عصبية عضلية في جلسات متتالية.',
      },
      notes: { en: 'Test at consistent time of day; avoid post heavy eccentric loading.', ar: 'اختبر في وقت ثابت؛ تجنب بعد eccentric ثقيل.' },
    }),
  };
}

export const NEUROMUSCULAR_TESTS: TestDefinition[] = defineTests([
  neuro('cmj_rsi', 'CMJ Reactive Strength Index', 'CMJ RSI', 2.4, 1.8, 1.2, 'RSI', 'Countermovement jump on force plate; RSI-mod = jump height / contact time.', 'CMJ على force plate؛ RSI-mod = ارتفاع/contact.', true),
  neuro('reactive_jump', 'Reactive Jump Profile', 'Reactive Jump', 2.0, 1.5, 1.0, 'RSI', 'Series of 5 drop jumps from 30 cm; mean RSI and peak height.', '5 drop jumps من 30سم؛ متوسط RSI وذروة الارتفاع.', false),
  neuro('landing_mechanics', 'Landing Mechanics Score', 'Landing Mechanics', 90, 80, 70, 'score', 'Video-based LESS or similar; score movement errors on drop landing.', 'LESS بالفيديو أو مشابه؛ score أخطاء الحركة عند landing.', false),
  neuro('force_symmetry', 'Force Symmetry Index', 'Force Symmetry', 95, 90, 85, '%', 'IMTP or isometric squat; compare peak force L vs R; symmetry index.', 'IMTP أو squat isometric؛ مقارنة ذروة L vs R؛ symmetry index.', false),
]);

import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['agility', 'injury_risk', 'flexibility'];

function balance(
  key: string,
  nameEn: string,
  nameAr: string,
  elite: number,
  good: number,
  avg: number,
  unit: string,
  protocolEn: string,
  protocolAr: string,
  featured = false
) {
  return {
    key,
    categoryId: 'balance' as const,
    icon: 'git-commit' as const,
    unit,
    referenceValues: refs(elite, good, avg),
    affectedModules: MOD,
    analyticsWeight: 0.76,
    expectedTrend: 'up' as const,
    objective: 'stability' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Static and dynamic balance assessment: ${nameEn}.`,
        ar: `تقييم توازن static و dynamic: ${nameAr}.`,
      },
      purpose: {
        en: 'Evaluate postural control and limb stability for injury prevention screening.',
        ar: 'تقييم التحكم الوضعي واستقرار الأطراف للوقاية من الإصابات.',
      },
      equipment: { en: 'Balance pad optional, stopwatch, Y-balance kit or tape marks', ar: 'Balance pad اختياري، ساعة، kit Y-balance أو علامات' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: `Score in ${unit}. Higher is better.`, ar: `النتيجة بـ ${unit}. الأعلى أفضل.` },
      interpretation: {
        en: 'Leg asymmetry >4 cm (Y-balance) or >15% time difference flags risk.',
        ar: 'عدم تناظر >4سم (Y-balance) أو >15% فرق زمن يشير لخطر.',
      },
      aiRec: {
        en: 'Add unilateral stability and proprioception work if below composite norms.',
        ar: 'أضف استقرار unilateral و proprioception إذا دون المعايير المركبة.',
      },
      notes: { en: 'Eyes open unless sport-specific closed-eye protocol required.', ar: 'عيون مفتوحة ما لم يُطلب بروتوكول عيون مغلقة.' },
    }),
  };
}

export const BALANCE_TESTS: TestDefinition[] = defineTests([
  balance('stork_balance', 'Stork Stand Balance', 'Stork Balance', 60, 45, 30, 's', 'Stork stand on dominant leg; hands on hips; time until touch-down; three trials.', 'Stork stand على الساق السائدة؛ يدان على الورك؛ حتى touch-down؛ 3 محاولات.', false),
  balance('y_balance', 'Y-Balance Test', 'Y-Balance', 98, 94, 90, '%', 'Standard Y-balance kit; anterior, posteromedial, posterolateral reach; composite % leg length.', 'Kit Y-balance قياسي؛ anterior و posteromedial و posterolateral؛ % مركب من طول الساق.', true),
  balance('sebt', 'Star Excursion Balance Test (SEBT)', 'SEBT', 110, 100, 90, 'cm', 'Eight reach directions; maximal reach distance normalized to leg length; composite score.', '8 اتجاهات reach؛ أقصى مسافة normalized لطول الساق؛ نتيجة مركبة.', false),
  balance('single_leg_balance', 'Single-Leg Stand (Eyes Open)', 'Single-Leg Stand', 45, 35, 25, 's', 'Single-leg stand eyes open; hands on hips; time to loss of balance; both legs.', 'وقوف ساق واحدة عيون مفتوحة؛ يدان على الورك؛ حتى فقدان التوازن؛ كلا الساقين.', false),
]);

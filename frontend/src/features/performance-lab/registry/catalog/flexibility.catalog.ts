import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['flexibility', 'injury_risk', 'recovery'];

function rom(
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
    categoryId: 'flexibility' as const,
    icon: 'body' as const,
    unit,
    referenceValues: refs(elite, good, avg, lowerIsBetter),
    affectedModules: MOD,
    analyticsWeight: 0.72,
    expectedTrend: (lowerIsBetter ? 'down' : 'up') as 'up' | 'down',
    objective: 'range_of_motion' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Range-of-motion assessment: ${nameEn}.`,
        ar: `تقييم مدى الحركة: ${nameAr}.`,
      },
      purpose: {
        en: 'Identify mobility restrictions linked to injury risk and movement quality.',
        ar: 'تحديد قيود الحركة المرتبطة بخطر الإصابة وجودة الحركة.',
      },
      equipment: { en: 'Goniometer, sit-and-reach box, or measuring tape as required', ar: 'Goniometer أو صندوق sit-and-reach أو شريط قياس حسب الحاجة' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: `Measure in ${unit}. ${lowerIsBetter ? 'Lower is better.' : 'Higher is better.'}`, ar: `القياس بـ ${unit}. ${lowerIsBetter ? 'الأقل أفضل.' : 'الأعلى أفضل.'}` },
      interpretation: {
        en: 'Asymmetry >10% between sides warrants corrective mobility work.',
        ar: 'عدم تناظر >10% بين الجانبين يستدعي عمل حركة تصحيحي.',
      },
      aiRec: {
        en: 'Prescribe targeted mobility if below norms or asymmetry persists >2 weeks.',
        ar: 'صف حركة مستهدفة إذا دون المعايير أو استمر عدم التناظر >2 أسبوع.',
      },
      notes: { en: 'Test after general warm-up; avoid post heavy static stretching.', ar: 'اختبر بعد إحماء عام؛ تجنب بعد stretching ثابت ثقيل.' },
    }),
  };
}

export const FLEXIBILITY_TESTS: TestDefinition[] = defineTests([
  rom('sit_reach', 'Sit-and-Reach Test', 'Sit-and-Reach', 35, 25, 15, 'cm', 'Standard sit-and-reach box; legs extended; three trials; record best reach.', 'صندوق sit-and-reach قياسي؛ ساقان ممدودتان؛ 3 محاولات؛ أفضل reach.', true),
  rom('shoulder_mobility', 'Shoulder Mobility Screen', 'Shoulder Mobility', 4, 3, 2, 'score', 'FMS-style fist-to-fist behind back; score 3/2/1/0 per side.', 'FMS قبضة–قبضة خلف الظهر؛ 3/2/1/0 لكل جانب.', false),
  rom('thomas_test', 'Thomas Test (Hip Flexors)', 'Thomas Test', 0, 5, 10, '°', 'Supine on table; one knee to chest; measure opposite thigh angle from horizontal.', 'Supine على طاولة؛ ركبة للصدر؛ زاوية الفخذ المقابل من الأفقي.', false, true),
  rom('hip_rotation', 'Hip Internal/External Rotation', 'Hip Rotation', 45, 35, 25, '°', 'Prone or seated; goniometer at 90° hip/knee; record IR and ER sum.', 'Prone أو جلوس؛ goniometer 90° hip/knee؛ مجموع IR وER.', false),
  rom('ankle_dorsiflexion', 'Ankle Dorsiflexion (Knee-to-Wall)', 'Ankle Dorsiflexion', 15, 12, 9, 'cm', 'Knee-to-wall test; maximal distance while knee touches wall; both ankles.', 'Knee-to-wall؛ أقصى مسافة مع لمس الركبة للجدار؛ كلا الكاحلين.', false),
]);

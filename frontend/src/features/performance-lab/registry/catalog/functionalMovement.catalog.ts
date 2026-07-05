import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['flexibility', 'injury_risk', 'recovery'];

function fmsItem(
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
    categoryId: 'functional_movement' as const,
    icon: 'accessibility' as const,
    unit: 'score',
    referenceValues: refs(elite, good, avg),
    affectedModules: MOD,
    analyticsWeight: 0.73,
    expectedTrend: 'up' as const,
    objective: 'movement_quality' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Functional movement screen item: ${nameEn}.`,
        ar: `عنصر فحص الحركة الوظيفية: ${nameAr}.`,
      },
      purpose: {
        en: 'Identify movement dysfunctions and asymmetries linked to injury risk.',
        ar: 'تحديد خلل الحركة وعدم التناظر المرتبط بخطر الإصابة.',
      },
      equipment: { en: 'FMS kit: dowel, hurdle, board; standardized scoring sheet', ar: 'Kit FMS: dowel، hurdle، board؛ ورقة score موحدة' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: 'Score 0–3 per side; use lower score if asymmetry present.', ar: 'Score 0–3 لكل جانب؛ استخدم الأقل عند عدم تناظر.' },
      interpretation: {
        en: 'Score ≤1 on any pattern warrants corrective exercise intervention.',
        ar: 'Score ≤1 في أي نمط يستدعي تدخل تمرين تصحيحي.',
      },
      aiRec: {
        en: 'Prioritize corrective patterns before loading asymmetrical movement patterns.',
        ar: 'أولِّ الأنماط التصحيحية قبل تحميل أنماط حركة غير متناظرة.',
      },
      notes: { en: 'Certified FMS scorer recommended for valid comparison.', ar: 'يُفضل scorer FMS معتمد للمقارنة الصالحة.' },
    }),
  };
}

export const FUNCTIONAL_MOVEMENT_TESTS: TestDefinition[] = defineTests([
  {
    ...fmsItem('fms', 'Functional Movement Screen (Total)', 'FMS Total', 18, 15, 12, 'Complete 7 FMS patterns; sum scores; note asymmetries and pain.', '7 أنماط FMS كاملة؛ مجموع scores؛ سجل asymmetries والألم.', true),
    analyticsWeight: 0.85,
    unit: 'score',
  },
  fmsItem('deep_squat', 'Deep Squat (FMS)', 'Deep Squat', 3, 2, 1, 'Dowel overhead; feet shoulder-width; squat below parallel; score 0–3.', 'Dowel overhead؛ قدمان عرض الكتف؛ squat تحت parallel؛ 0–3.', false),
  fmsItem('hurdle_step', 'Hurdle Step (FMS)', 'Hurdle Step', 3, 2, 1, 'Hurdle at tibial height; step over without contact; score each leg.', 'Hurdle بارتفاع tibia؛ خطوة فوق بدون contact؛ score كل ساق.', false),
  fmsItem('inline_lunge', 'In-Line Lunge (FMS)', 'In-Line Lunge', 3, 2, 1, 'Dowel behind back; lunge foot on board line; score stability and alignment.', 'Dowel خلف الظهر؛ قدم lunge على خط board؛ score استقرار ومحاذاة.', false),
  fmsItem('aslr', 'Active Straight Leg Raise (FMS)', 'ASLR', 3, 2, 1, 'Supine; raise straight leg; dowel at mid-thigh of down leg; score angle.', 'Supine؛ ارفع ساق مستقيمة؛ dowel منتصف فخذ الساق السفلى؛ score زاوية.', false),
  fmsItem('shoulder_mobility_screen', 'Shoulder Mobility (FMS)', 'Shoulder Mobility FMS', 3, 2, 1, 'Fist-to-fist behind back; measure hand distance; score 0–3 per side.', 'قبضة–قبضة خلف الظهر؛ مسافة اليدين؛ 0–3 لكل جانب.', false),
]);

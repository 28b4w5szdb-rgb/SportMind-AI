import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['strength', 'agility', 'physical_fitness'];

function jump(
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
    categoryId: 'power' as const,
    icon: 'rocket' as const,
    unit,
    referenceValues: refs(elite, good, avg),
    affectedModules: MOD,
    analyticsWeight: 0.84,
    expectedTrend: 'up' as const,
    objective: 'explosive_power' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Explosive lower-body power assessment: ${nameEn}.`,
        ar: `تقييم قوة explosive للجزء السفلي: ${nameAr}.`,
      },
      purpose: {
        en: 'Quantify stretch–shortening cycle capacity and neuromuscular power output.',
        ar: 'قياس قدرة stretch–shortening cycle وخرج القوة العصبية العضلية.',
      },
      equipment: { en: 'Jump mat, force plate, or Vertec; standardized warm-up', ar: 'Jump mat أو force plate أو Vertec؛ إحماء موحد' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: `Best trial (${unit}). Higher is better.`, ar: `أفضل محاولة (${unit}). الأعلى أفضل.` },
      interpretation: {
        en: 'Track alongside strength metrics; power-to-strength ratio flags velocity deficits.',
        ar: 'تتبع مع مقاييس القوة؛ نسبة power–strength تكشف نقص السرعة.',
      },
      aiRec: {
        en: 'Add ballistic training if jump height plateaus while 1RM rises.',
        ar: 'أضف تدريب ballistic إذا ثبت ارتفاع القفز مع ارتفاع 1RM.',
      },
      notes: { en: 'Hands on hips for CMJ/SJ unless arm swing protocol specified.', ar: 'اليدان على الورك لـ CMJ/SJ ما لم يُحدد بروتوكول swing.' },
    }),
  };
}

export const POWER_TESTS: TestDefinition[] = defineTests([
  jump('cmj', 'Countermovement Jump (CMJ)', 'CMJ', 55, 45, 38, 'cm', 'Hands on hips; countermovement to max jump; three trials.', 'يدان على الورك؛ countermovement لقفزة max؛ 3 محاولات.', true),
  jump('squat_jump', 'Squat Jump (SJ)', 'Squat Jump', 50, 42, 35, 'cm', 'Static squat hold 2 s; explode upward without countermovement.', 'Squat ثابت 2ث؛ explode للأعلى بدون countermovement.', false),
  jump('drop_jump', 'Drop Jump (DJ)', 'Drop Jump', 45, 38, 30, 'cm', 'Step from 30–45 cm box; minimal ground contact; max rebound height.', 'نزول من صندوق 30–45سم؛ contact أرضي minimal؛ rebound max.', false),
  jump('broad_jump', 'Standing Broad Jump', 'Broad Jump', 280, 240, 200, 'cm', 'Two-foot takeoff; maximal horizontal distance; three trials.', 'انطلاق قدمين؛ أقصى مسافة أفقية؛ 3 محاولات.', false),
  jump('vertical_jump', 'Vertical Jump (Reach)', 'Vertical Jump', 70, 60, 50, 'cm', 'Standing reach subtracted from max touch height; arm swing allowed.', 'Reach وقوف يُطرح من touch max؛ swing مسموح.', false),
  {
    key: 'reactive_strength_index',
    categoryId: 'power',
    icon: 'pulse',
    unit: 'RSI',
    referenceValues: refs(2.4, 1.8, 1.2),
    affectedModules: ['strength', 'agility', 'training_load'],
    analyticsWeight: 0.86,
    expectedTrend: 'up',
    objective: 'explosive_power',
    featured: false,
    copy: copyBundle({
      name: { en: 'Reactive Strength Index (RSI)', ar: 'Reactive Strength Index RSI' },
      description: { en: 'Drop jump metric: jump height (m) divided by ground contact time (s).', ar: 'مقياس drop jump: ارتفاع القفزة (م) ÷ زمن contact (ث).' },
      purpose: { en: 'Assess stretch–shortening cycle efficiency and reactive power.', ar: 'تقييم كفاءة stretch–shortening cycle والقوة التفاعلية.' },
      equipment: { en: 'Force plate or contact mat, drop box 30 cm', ar: 'Force plate أو contact mat، صندوق 30سم' },
      protocol: { en: 'Drop from 30 cm; RSI = jump height / contact time; best of 5 trials.', ar: 'Drop من 30سم؛ RSI = ارتفاع/contact؛ أفضل 5 محاولات.' },
      scoring: { en: 'RSI-mod (m/s). Higher is better.', ar: 'RSI-mod (m/s). الأعلى أفضل.' },
      interpretation: { en: 'RSI >2.0 indicates elite reactive capacity.', ar: 'RSI >2.0 يدل على قدرة تفاعلية نخبوية.' },
      aiRec: { en: 'Program plyometrics if RSI lags CMJ height progression.', ar: 'برمج plyometrics إذا تأخر RSI عن تقدم CMJ.' },
    }),
  },
  jump('triple_hop', 'Triple Hop for Distance', 'Triple Hop', 750, 650, 550, 'cm', 'Three consecutive single-leg hops; measure total distance; test both legs.', '3 قفزات consecutive بساق واحدة؛ المسافة الكلية؛ كلا الساقين.', false),
]);

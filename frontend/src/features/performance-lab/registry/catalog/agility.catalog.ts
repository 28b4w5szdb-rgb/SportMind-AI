import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['agility', 'speed', 'physical_fitness'];

function cod(
  key: string,
  nameEn: string,
  nameAr: string,
  elite: number,
  good: number,
  avg: number,
  protocolEn: string,
  protocolAr: string,
  featured = false,
  icon: 'shuffle' | 'git-branch' | 'arrow-redo' = 'shuffle'
) {
  return {
    key,
    categoryId: 'agility' as const,
    icon,
    unit: 's',
    referenceValues: refs(elite, good, avg, true),
    affectedModules: MOD,
    analyticsWeight: 0.82,
    expectedTrend: 'down' as const,
    objective: 'change_of_direction' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Change-of-direction agility test: ${nameEn}.`,
        ar: `اختبار رشاقة تغيير الاتجاه: ${nameAr}.`,
      },
      purpose: {
        en: 'Quantify multi-directional movement efficiency and deceleration–reacceleration capacity.',
        ar: 'قياس كفاءة الحركة متعددة الاتجاهات وقدرة الكبح–إعادة التسارع.',
      },
      equipment: { en: 'Timing gates or stopwatch, cones, flat surface', ar: 'بوابات توقيت أو ساعة، أقماع، سطح مستو' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: 'Best legal trial time (s). Lower is better.', ar: 'أفضل زمن قانوني (ث). الأقل أفضل.' },
      interpretation: {
        en: 'Compare against sport-specific norms; asymmetry in 505 may indicate limb deficit.',
        ar: 'قارن مع معايير الرياضة؛ عدم تناظر 505 قد يدل على نقص طرف.',
      },
      aiRec: {
        en: 'Prioritize deceleration mechanics if COD time regresses despite speed gains.',
        ar: 'أولِّ mechanics الكبح إذا تراجع COD رغم تحسن السرعة.',
      },
      notes: { en: 'Standardize footwear and surface; two trials minimum.', ar: 'وحّد الحذاء والسطح؛ محاولتان كحد أدنى.' },
    }),
  };
}

export const AGILITY_TESTS: TestDefinition[] = defineTests([
  cod('illinois', 'Illinois Agility Test', 'Illinois Agility', 15.2, 16.5, 17.8, 'Standard 10×5 m Illinois course; best of two trials.', 'مسار Illinois 10×5م قياسي؛ أفضل محاولتين.', true),
  cod('t_test', 'T-Test', 'T-Test', 9.5, 10.5, 11.5, 'Sprint forward 10 m, shuffle left 5 m, shuffle right 10 m, shuffle left 5 m, backpedal 10 m.', 'Sprint 10م، shuffle يسار 5م، يمين 10م، يسار 5م، backpedal 10م.', false),
  cod('test_505', '505 Agility Test', '505 Agility', 2.3, 2.5, 2.7, '15 m approach; 5 m deceleration zone; 180° turn; 5 m sprint out; test both legs.', 'اقتراب 15م؛ منطقة كبح 5م؛ دوران 180°؛ sprint 5م؛ اختبر كلا الساقين.', false),
  cod('pro_agility', 'Pro Agility (5-10-5)', 'Pro Agility 5-10-5', 4.2, 4.5, 4.8, 'Start at center cone; sprint 5 m left, 10 m right, 5 m back to center.', 'بداية من القمع المركزي؛ 5م يسار، 10م يمين، 5م للمركز.', false),
  {
    key: 'reactive_agility',
    categoryId: 'agility',
    icon: 'flash',
    unit: 's',
    referenceValues: refs(2.8, 3.1, 3.4, true),
    affectedModules: ['agility', 'speed', 'readiness'],
    analyticsWeight: 0.88,
    expectedTrend: 'down',
    objective: 'change_of_direction',
    featured: false,
    copy: copyBundle({
      name: { en: 'Reactive Agility Test', ar: 'اختبار الرشاقة التفاعلية' },
      description: { en: 'COD sprint triggered by visual or light stimulus with randomized direction.', ar: 'Sprint COD بمحفز بصري أو ضوء واتجاه عشوائي.' },
      purpose: { en: 'Assess perceptual–cognitive component of agility beyond pre-planned COD.', ar: 'تقييم المكون الإدراكي– المعرفي للرشاقة beyond COD المخطط.' },
      equipment: { en: 'Timing gates, light system or video stimulus, cones', ar: 'بوابات، نظام ضوء أو محفز فيديو، أقماع' },
      protocol: { en: 'Athlete reacts to stimulus; sprint 5–10 m to target gate; 6–8 trials.', ar: 'رياضي يتفاعل مع المحفز؛ sprint 5–10م لبوابة الهدف؛ 6–8 محاولات.' },
      scoring: { en: 'Mean reactive time (s). Lower is better.', ar: 'متوسط زمن التفاعل (ث). الأقل أفضل.' },
      interpretation: { en: 'Gap between pre-planned and reactive COD reveals decision delay.', ar: 'الفجوة بين COD المخطط والتفاعلي تكشف تأخير القرار.' },
      aiRec: { en: 'Add small-sided games and reactive drills if reactive lag exceeds 15%.', ar: 'أضف ألعاباً مصغرة وdrills تفاعلية إذا تجاوز التأخير 15%.' },
    }),
  },
  cod('zigzag', 'Zigzag Agility Test', 'Zigzag Agility', 6.5, 7.2, 8.0, 'Weave through five cones spaced 5 m apart; best of three trials.', 'تموج بين 5 أقماع متباعدة 5م؛ أفضل 3 محاولات.', false, 'git-branch'),
]);

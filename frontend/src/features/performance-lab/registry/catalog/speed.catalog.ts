import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['speed', 'agility', 'physical_fitness'];

function sprint(
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
    categoryId: 'speed' as const,
    icon: 'flash' as const,
    unit: 's',
    referenceValues: refs(elite, good, avg, true),
    affectedModules: MOD,
    analyticsWeight: 0.85,
    expectedTrend: 'down' as const,
    objective: 'linear_speed' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Timed linear sprint assessment over ${nameEn}.`,
        ar: `تقييم سرعة خطية موقوت على ${nameAr}.`,
      },
      purpose: {
        en: 'Quantify acceleration and maximum velocity capacity for field sport profiling.',
        ar: 'قياس قدرة التسارع والسرعة القصوى لملف اللاعب.',
      },
      equipment: { en: 'Timing gates or laser system, cones, flat surface', ar: 'بوابات توقيت أو láser، أقماع، سطح مستو' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: 'Best legal trial time (s). Lower is better.', ar: 'أفضل زمن قانوني (ث). الأقل أفضل.' },
      interpretation: {
        en: 'Compare against position norms; track % change across mesocycles.',
        ar: 'قارن مع معايير المركز؛ تتبع نسبة التغير عبر الدورات.',
      },
      aiRec: {
        en: 'Maintain neuromuscular speed work if trend improves; reduce COD volume when injury risk KPI rises.',
        ar: 'حافظ على عمل سرعة عصبي عضلي إذا تحسن الاتجاه؛ خفّف COD عند ارتفاع خطر الإصابة.',
      },
      notes: { en: 'Standardize start type and surface.', ar: 'وحّد نوع البداية والسطح.' },
    }),
  };
}

export const SPEED_TESTS: TestDefinition[] = defineTests([
  sprint('sprint5', '5 m Sprint', 'Sprint 5m', 0.95, 1.05, 1.15, 'Standing start; timing gates at 0 and 5 m; two trials.', 'بداية وقوف؛ بوابات 0 و5م؛ محاولتان.', false),
  sprint('sprint10', '10 m Sprint', 'Sprint 10m', 1.65, 1.78, 1.92, 'Standing start; gates at 0 and 10 m; best of three trials.', 'بداية وقوف؛ بوابات 0 و10م؛ أفضل 3 محاولات.', false),
  sprint('sprint20', '20 m Sprint', 'Sprint 20m', 2.85, 3.05, 3.25, 'Standing start; gates at 0 and 20 m after standardized warm-up.', 'بداية وقوف؛ بوابات 0 و20م بعد إحماء.', false),
  sprint('sprint30', '30 m Sprint', 'Sprint 30m', 3.95, 4.2, 4.5, 'Standing start; gates at 0 and 30 m; best of two trials.', 'بداية وقوف؛ بوابات 0 و30م؛ أفضل محاولتين.', true),
  sprint('sprint40', '40 m Sprint', 'Sprint 40m', 5.1, 5.4, 5.7, 'Standing start; full 40 m split timing.', 'بداية وقوف؛ توقيت 40م كاملة.', false),
  {
    ...sprint('flying_sprint', 'Flying Sprint', 'Flying Sprint', 2.2, 2.35, 2.5, '10 m build-up then 10 m flying split.', 'تسارع 10م ثم split طيران 10م.', false),
    analyticsWeight: 0.9,
    affectedModules: ['speed', 'physical_fitness'],
  },
  {
    key: 'rsa',
    categoryId: 'speed',
    icon: 'repeat',
    unit: 's',
    referenceValues: refs(28, 32, 36, true),
    affectedModules: ['speed', 'fatigue', 'endurance'],
    analyticsWeight: 0.8,
    expectedTrend: 'down',
    objective: 'linear_speed',
    featured: false,
    copy: copyBundle({
      name: { en: 'Repeated Sprint Ability (RSA)', ar: 'قدرة تكرار السرعة RSA' },
      description: { en: 'Mean time across repeated maximal sprints with short recovery.', ar: 'متوسط زمن sprintات متكررة باستشفاء قصير.' },
      purpose: { en: 'Assess speed endurance and fatigue resistance in repeat-effort sports.', ar: 'تقييم تحمل السرعة ومقاومة الإرهاق.' },
      equipment: { en: 'Timing gates, cones, 20–30 m course', ar: 'بوابات، أقماع، مسار 20–30م' },
      protocol: { en: '6×30 m sprints, 20 s passive recovery; record mean and best.', ar: '6×30م، استشفاء 20ث؛ سجل المتوسط والأفضل.' },
      scoring: { en: 'Mean sprint time and fatigue index (%).', ar: 'متوسط الزمن ومؤشر الإرهاق (%).' },
      interpretation: { en: 'Rising fatigue index signals limited repeat-sprint capacity.', ar: 'ارتفاع مؤشر الإرهاق يدل على محدودية تكرار السرعة.' },
      aiRec: { en: 'Add RSA-specific conditioning if mean time decays >7%.', ar: 'أضف تهيئة RSA إذا تراجع المتوسط >7%.' },
    }),
  },
  {
    key: 'sprint_momentum',
    categoryId: 'speed',
    icon: 'speedometer',
    unit: 'kg·m/s',
    referenceValues: refs(450, 380, 320),
    affectedModules: ['speed', 'strength', 'physical_fitness'],
    analyticsWeight: 0.75,
    expectedTrend: 'up',
    objective: 'linear_speed',
    featured: false,
    copy: copyBundle({
      name: { en: 'Sprint Momentum', ar: 'زخم Sprint' },
      description: { en: 'Mass × velocity proxy from sprint and body mass.', ar: 'كتلة × سرعة من sprint وكتلة الجسم.' },
      purpose: { en: 'Integrate speed with anthropometrics for collision sports.', ar: 'دمج السرعة مع القياسات لرياضات التصادم.' },
      equipment: { en: 'Timing system, scale', ar: 'نظام توقيت، ميزان' },
      protocol: { en: 'Calculate from 30 m velocity and body mass.', ar: 'احسب من سرعة 30م وكتلة الجسم.' },
      scoring: { en: 'Momentum = mass (kg) × velocity (m/s).', ar: 'الزخم = الكتلة × السرعة.' },
      interpretation: { en: 'Higher momentum supports contact sports performance.', ar: 'زخم أعلى يدعم أداء التصادم.' },
      aiRec: { en: 'Balance mass gain with velocity maintenance.', ar: 'وازن زيادة الكتلة مع الحفاظ على السرعة.' },
    }),
  },
  sprint('acceleration_test', 'Acceleration Test', 'اختبار التسارع', 1.05, 1.15, 1.25, '0–10 m split from standing start; focus on first-step mechanics.', 'split 0–10م من وقوف؛ تركيز على الخطوة الأولى.', false),
  sprint('max_velocity_test', 'Maximum Velocity Test', 'اختبار السرعة القصوى', 8.5, 9.0, 9.5, 'Flying 10 m after 30 m build-up; peak velocity estimate.', '10m طيران بعد تسارع 30م؛ تقدير السرعة القصوى.', false),
]);

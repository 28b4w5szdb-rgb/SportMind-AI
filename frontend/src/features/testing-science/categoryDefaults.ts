import type { TestCategoryId, TestKnowledgeBundle } from '@/src/features/performance-lab/types';

export interface CategoryDefaults {
  retestIntervalDays: number;
  knowledge: Omit<TestKnowledgeBundle, 'whatMeasures' | 'howPerformed'>;
}

const BASE: CategoryDefaults = {
  retestIntervalDays: 28,
  knowledge: {
    whyImportant: {
      en: 'Provides objective data for training prescription and return-to-play decisions.',
      ar: 'يوفر بيانات موضوعية لوصف التدريب وقرارات العودة للعب.',
    },
    whatAffects: {
      en: 'Sleep, fatigue, warm-up quality, surface, footwear, motivation, and recent training load.',
      ar: 'النوم، الإرهاق، جودة الإحماء، السطح، الحذاء، الدافعية، والحمل التدريبي الأخير.',
    },
    commonMistakes: {
      en: 'Inconsistent protocol, insufficient trials, testing when fatigued, or changing equipment between sessions.',
      ar: 'بروتوكول غير متسق، محاولات غير كافية، الاختبار أثناء الإرهاق، أو تغيير المعدات بين الجلسات.',
    },
  },
};

export const CATEGORY_DEFAULTS: Record<TestCategoryId, CategoryDefaults> = {
  speed: {
    retestIntervalDays: 21,
    knowledge: {
      ...BASE.knowledge,
      whyImportant: {
        en: 'Linear speed underpins match sprint demands, pressing, and transition play in football.',
        ar: 'السرعة الخطية تدعم متطلبات sprint المباراة والضغط والتحول في كرة القدم.',
      },
      whatAffects: {
        en: 'Start technique, surface, footwear, hamstring readiness, CNS fatigue, and prior sprint volume.',
        ar: 'تقنية البداية، السطح، الحذاء، جاهزية hamstring، إرهاق CNS، وحجم sprint السابق.',
      },
      commonMistakes: {
        en: 'Non-standardized start, insufficient rest between trials, testing after heavy gym.',
        ar: 'بداية غير موحّدة، راحة غير كافية بين المحاولات، اختبار بعد صالة قوة ثقيلة.',
      },
    },
  },
  strength: { ...BASE, retestIntervalDays: 42 },
  endurance: {
    ...BASE,
    retestIntervalDays: 35,
    knowledge: {
      ...BASE.knowledge,
      whyImportant: {
        en: 'Aerobic capacity supports total work-rate and recovery between high-intensity bouts in team sports.',
        ar: 'القدرة الهوائية تدعم معدل العمل الكلي والتعافي بين جهود الشدة المرتفعة في الرياضات الجماعية.',
      },
    },
  },
  agility: { ...BASE, retestIntervalDays: 21 },
  power: { ...BASE, retestIntervalDays: 28 },
  flexibility: { ...BASE, retestIntervalDays: 14 },
  balance: { ...BASE, retestIntervalDays: 14 },
  body_composition: { ...BASE, retestIntervalDays: 42 },
  reaction_time: { ...BASE, retestIntervalDays: 21 },
  neuromuscular: { ...BASE, retestIntervalDays: 28 },
  functional_movement: { ...BASE, retestIntervalDays: 28 },
  custom: { ...BASE, retestIntervalDays: 28 },
};

export function getCategoryDefaults(categoryId: TestCategoryId): CategoryDefaults {
  return CATEGORY_DEFAULTS[categoryId] ?? BASE;
}

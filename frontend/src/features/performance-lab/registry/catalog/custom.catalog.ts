import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

export const CUSTOM_TESTS: TestDefinition[] = defineTests([
  {
    key: 'custom_test',
    categoryId: 'custom',
    icon: 'create',
    unit: 'units',
    referenceValues: refs(100, 75, 50),
    affectedModules: ['physical_fitness', 'training_compliance'],
    analyticsWeight: 0.5,
    expectedTrend: 'up',
    objective: 'custom_metric',
    featured: true,
    copy: copyBundle({
      name: { en: 'Custom Coach Test', ar: 'اختبار مخصص للمدرب' },
      description: {
        en: 'User-defined assessment with coach-specified protocol and metric.',
        ar: 'تقييم يحدده المستخدم ببروتوكول ومقياس من المدرب.',
      },
      purpose: {
        en: 'Track sport-specific or phase-specific metrics not covered by standard library tests.',
        ar: 'تتبع مقاييس رياضية أو مرحلية غير مغطاة بمكتبة الاختبارات القياسية.',
      },
      equipment: { en: 'As defined by coach during test creation', ar: 'حسب تعريف المدرب عند إنشاء الاختبار' },
      protocol: {
        en: 'Coach enters protocol steps, unit, and target metric at test setup.',
        ar: 'المدرب يدخل خطوات البروتوكول والوحدة والمقياس المستهدف عند الإعداد.',
      },
      scoring: {
        en: 'Record result in coach-defined unit; compare against baseline and target over time.',
        ar: 'سجّل النتيجة بالوحدة المحددة؛ قارن مع خط الأساس والهدف عبر الزمن.',
      },
      interpretation: {
        en: 'Interpret relative to athlete baseline, training phase, and coach-defined targets.',
        ar: 'فسّر نسبة لخط أساس الرياضي ومرحلة التدريب وأهداف المدرب.',
      },
      aiRec: {
        en: 'Link custom results to training objectives and review trends every mesocycle.',
        ar: 'اربط النتائج المخصصة بأهداف التدريب وراجع الاتجاهات كل دورة.',
      },
      notes: {
        en: 'Custom tests inherit default analytics weight; coach may override on save.',
        ar: 'الاختبارات المخصصة ترث weight تحليلي افتراضي؛ المدرب قد يعدّل عند الحفظ.',
      },
    }),
  },
]);

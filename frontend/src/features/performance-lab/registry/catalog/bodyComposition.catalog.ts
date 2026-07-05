import type { AnalyticsModuleId } from '@/src/analytics/types';
import { copyBundle, defineTests, refs } from '../factory';
import type { TestDefinition } from '../../types';

const MOD: AnalyticsModuleId[] = ['physical_fitness', 'endurance', 'training_load'];

function comp(
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
    categoryId: 'body_composition' as const,
    icon: 'scale' as const,
    unit,
    referenceValues: refs(elite, good, avg, lowerIsBetter),
    affectedModules: MOD,
    analyticsWeight: 0.74,
    expectedTrend: (lowerIsBetter ? 'down' : 'up') as 'up' | 'down',
    objective: 'body_composition' as const,
    featured,
    copy: copyBundle({
      name: { en: nameEn, ar: nameAr },
      description: {
        en: `Body composition metric: ${nameEn}.`,
        ar: `مقياس تركيب الجسم: ${nameAr}.`,
      },
      purpose: {
        en: 'Track anthropometric profile for performance optimization and health screening.',
        ar: 'تتبع الملف anthropometric لتحسين الأداء والفحص الصحي.',
      },
      equipment: { en: 'Scale, calipers, tape measure, or BIA device as required', ar: 'ميزان، calipers، شريط قياس، أو BIA حسب الحاجة' },
      protocol: { en: protocolEn, ar: protocolAr },
      scoring: { en: `Result in ${unit}. ${lowerIsBetter ? 'Lower is better for this metric.' : 'Higher is better for this metric.'}`, ar: `النتيجة بـ ${unit}. ${lowerIsBetter ? 'الأقل أفضل.' : 'الأعلى أفضل.'}` },
      interpretation: {
        en: 'Interpret relative to sport, position, and seasonal phase targets.',
        ar: 'فسّر نسبة إلى الرياضة والمركز وأهداف المرحلة الموسمية.',
      },
      aiRec: {
        en: 'Adjust nutrition periodization if trend moves away from phase targets >2 weeks.',
        ar: 'عدّل periodization التغذية إذا ابتعد الاتجاه عن أهداف المرحلة >2 أسبوع.',
      },
      notes: { en: 'Standardize hydration, time of day, and measurement site.', ar: 'وحّد الترطيب ووقت اليوم وموقع القياس.' },
    }),
  };
}

export const BODY_COMPOSITION_TESTS: TestDefinition[] = defineTests([
  comp('bmi', 'Body Mass Index (BMI)', 'BMI', 22, 24, 26, 'kg/m²', 'Weight (kg) / height² (m); measured morning fasted when possible.', 'الوزن (كغ) / الطول² (م)； قياس صباحاً صائماً إن أمكن.', false, true),
  comp('body_fat', 'Body Fat Percentage', 'Body Fat %', 8, 12, 16, '%', 'Skinfold sum (Jackson-Pollock) or BIA; same method each test.', 'مجموع skinfold (Jackson-Pollock) أو BIA؛ نفس الطريقة كل اختبار.', true, true),
  comp('skeletal_muscle_mass', 'Skeletal Muscle Mass', 'Skeletal Muscle Mass', 45, 40, 35, 'kg', 'DXA or validated BIA segmental estimate; record total SMM.', 'DXA أو BIA segmental معتمد؛ سجل SMM الكلي.', false),
  comp('waist_hip_ratio', 'Waist-to-Hip Ratio', 'Waist-Hip Ratio', 0.85, 0.9, 0.95, 'ratio', 'Waist at narrowest; hip at widest; ratio waist/hip.', 'الخصر عند أضيق نقطة؛ الورك عند أوسع؛ نسبة خصر/ورك.', false, true),
  comp('skinfold', 'Sum of Skinfolds (7-Site)', 'Skinfold Sum', 50, 70, 90, 'mm', 'Jackson-Pollock 7-site; same tester; record sum in mm.', 'Jackson-Pollock 7 مواقع؛ نفس الفاحص؛ مجموع mm.', false, true),
]);

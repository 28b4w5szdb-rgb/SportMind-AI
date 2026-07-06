/** Arabic overrides for SSID performance test templates. */
import type { TestCategoryId } from '@/src/features/performance-lab/types';

type Level = 'elite' | 'good' | 'average' | 'below';

function band(level: Level, texts: {
  classification: string;
  meaning: string;
  physiology: string;
  performance: string;
  risk: string;
  reference: string;
  ai: string;
  immediate: string;
  weekly: string;
  longTerm: string;
}) {
  return {
    classifications: { [level]: texts.classification },
    meanings: { [level]: texts.meaning },
    physiology: { [level]: texts.physiology },
    performance: { [level]: texts.performance },
    risk: { [level]: texts.risk },
    reference: { [level]: texts.reference },
    ai: { [level]: texts.ai },
    recs: { [level]: { immediate: texts.immediate, weekly: texts.weekly, longTerm: texts.longTerm } },
  };
}

function mergeParts(...parts: ReturnType<typeof band>[]) {
  return parts.reduce(
    (acc, part) => ({
      classifications: { ...acc.classifications, ...part.classifications },
      meanings: { ...acc.meanings, ...part.meanings },
      physiology: { ...acc.physiology, ...part.physiology },
      performance: { ...acc.performance, ...part.performance },
      risk: { ...acc.risk, ...part.risk },
      reference: { ...acc.reference, ...part.reference },
      ai: { ...acc.ai, ...part.ai },
      recs: { ...acc.recs, ...part.recs },
    }),
    { classifications: {}, meanings: {}, physiology: {}, performance: {}, risk: {}, reference: {}, ai: {}, recs: {} } as ReturnType<typeof band>
  );
}

function buildArCategory(labelAr: string, higherIsBetter: boolean) {
  const dir = higherIsBetter ? 'أعلى' : 'أقل';
  return {
    referenceLabel: `معايير مرجعية لـ ${labelAr} (معدّلة حسب الملف)`,
    ...mergeParts(
      band('elite', {
        classification: 'نخبة',
        meaning: `نتيجة ${labelAr} ضمن نطاق النخبة مقارنة بالمعايير المرجعية للعمر والجنس والرياضة والمستوى.`,
        physiology: 'ملف عصبي عضلي واستقلابي مناسب لهذه الصفة.',
        performance: 'يدعم متطلبات المباراة العالية والتقدم التدريبي.',
        risk: 'محدّد أداء منخفض؛ راقب الحمل لتجنب الإفراط.',
        reference: `النتيجة ${dir} عتبة النخبة المرجعية.`,
        ai: 'حافظ على جودة العمل؛ أعد الاختبار حسب فترة البروتوكول.',
        immediate: 'تابع الجلسة المخططة إذا دعمت الجاهزية ذلك.',
        weekly: 'تتبع الاتجاه؛ عدّل البرمجة إذا انخفض >3%.',
        longTerm: 'استخدم كمعيار للتدريب الدوري والمتابعة.',
      }),
      band('good', {
        classification: 'جيد',
        meaning: `${labelAr} جيد — تنافسي للملف مع مجال تحسين موجّه.`,
        physiology: 'قدرة كافية لمرحلة التدريب الحالية.',
        performance: 'متوافق مع تدريب الفريق وتحضير المباراة.',
        risk: 'منخفض إلى متوسط حسب إدارة الإرهاق.',
        reference: 'بين قيم المرجع الجيد والنخبة.',
        ai: 'استمر في تطوير هذه الصفة بشكل منظم.',
        immediate: 'تدرب حسب البرنامج مع مراقبة معتادة.',
        weekly: 'أضف جلسة موجّهة إذا ثبت التقدم.',
        longTerm: 'أعد الاختبار بعد الفترة المقترحة.',
      }),
      band('average', {
        classification: 'متوسط',
        meaning: `${labelAr} متوسط — وظيفي لكنه ليس نقطة قوة نسبية.`,
        physiology: 'قد يعكس تكيفاً غير مكتمل أو تعافياً دون الأمثل.',
        performance: 'قد يحدّ الذروة في السيناريوهات عالية المتطلبات.',
        risk: 'متوسط — تجنب قفزات الحمل أثناء معالجة المحدّد.',
        reference: 'قرب المتوسط المرجعي لملف الرياضي.',
        ai: 'أدخل دورة مركّزة لهذه الصفة.',
        immediate: 'ركّز على التقنية؛ قلّل الحجم الأقصى عند الإرهاق.',
        weekly: 'جلستان موجّهتان أسبوعياً مع تعافٍ كافٍ.',
        longTerm: 'راجع التغذية والنوم وبرنامج القوة.',
      }),
      band('below', {
        classification: 'دون المتوسط',
        meaning: `${labelAr} دون المرجع — محدّد واضح يتطلب تدخلاً.`,
        physiology: 'قدرة غير كافية أو تعافٍ ناقص على الأرجح.',
        performance: 'يؤثر على الأداء وتحمل التدريب.',
        risk: 'خطر أداء أو إصابة مرتفع إذا لم يُعدّل الحمل.',
        reference: `دون عتبة المتوسط (${dir} الاتجاه المتوقع).`,
        ai: 'خفّض الحمل المنافس 15–20%؛ أولِ العمل التصحيحي.',
        immediate: 'تجنب تكرار محاولات قصوى؛ ركّز على الأساسيات.',
        weekly: 'مراجعة طاقم للبرنامج والعافية والإصابات.',
        longTerm: 'كتلة علاجية شهرية مع إعادة اختبار.',
      })
    ),
  };
}

const AR_LABELS: Record<TestCategoryId, { label: string; higherIsBetter: boolean }> = {
  speed: { label: 'السرعة / Sprint', higherIsBetter: false },
  strength: { label: 'القوة', higherIsBetter: true },
  endurance: { label: 'التحمل / القدرة الهوائية', higherIsBetter: true },
  agility: { label: 'الرشاقة / تغيير الاتجاه', higherIsBetter: false },
  power: { label: 'القدرة الانفجارية', higherIsBetter: true },
  flexibility: { label: 'المرونة / الحركية', higherIsBetter: true },
  balance: { label: 'التوازن / الاستقرار', higherIsBetter: true },
  body_composition: { label: 'تركيب الجسم', higherIsBetter: false },
  reaction_time: { label: 'زمن رد الفعل', higherIsBetter: false },
  neuromuscular: { label: 'الوظيفة العصبية العضلية', higherIsBetter: true },
  functional_movement: { label: 'جودة الحركة الوظيفية', higherIsBetter: true },
  custom: { label: 'تقييم مخصص', higherIsBetter: true },
};

export const testTemplatesAr = Object.fromEntries(
  (Object.keys(AR_LABELS) as TestCategoryId[]).map((id) => [id, buildArCategory(AR_LABELS[id].label, AR_LABELS[id].higherIsBetter)])
);

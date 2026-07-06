/** SSID Arabic locale overrides — deep-merged with English SSID content at i18n boot. */
export const ssidArOverrides = {
  confidenceLabel: 'مستوى الثقة (placeholder)',
  references: {
    placeholder: 'مرجع علمي placeholder — مكتبة الأدلة قيد الإعداد.',
  },
  metricLabels: {
    bmi: 'مؤشر كتلة الجسم',
    body_fat: 'دهون الجسم',
    body_water: 'ماء الجسم',
    muscle_mass: 'كتلة العضلات',
    lean_mass: 'الكتلة النحيلة',
    vo2_max: 'VO₂ Max',
    hr_zones: 'منطقة نبض القلب',
    session_load: 'حمل الجلسة',
    acwr: 'نسبة الحمل الحاد/المزمن',
    recovery_score: 'درجة التعافي',
    readiness_score: 'درجة الجاهزية',
  },
  decisions: {
    train_normally: 'تدريب طبيعي',
    reduce_load: 'خفّض الحمل',
    recovery_session: 'جدولة جلسة تعافٍ',
    mobility_session: 'أضف جلسة حركية',
    medical_evaluation: 'تقييم طبي',
    increase_calories: 'زِد السعرات',
    increase_protein: 'زِد البروتين',
    increase_hydration: 'زِد الترطيب',
    retest: 'أعد الاختبار وتحقق من القياس',
    maintain: 'حافظ على الخطة الحالية',
  },
  metrics: {
    bmi: {
      classifications: { underweight: 'نقص وزن', normal: 'طبيعي', overweight: 'زيادة وزن', obesity: 'سمنة' },
      meanings: {
        underweight: 'مؤشر كتلة الجسم أقل من 18.5 يدل على كتلة جسدية غير كافية بالنسبة للطول.',
        normal: 'مؤشر 18.5–24.9 يعكس توازناً صحياً بين الوزن والطول.',
        overweight: 'مؤشر 25–29.9 يشير إلى كتلة أعلى قد تتضمن دهوناً زائدة.',
        obesity: 'مؤشر ≥30 يدل على فائض كبير في الكتلة بالنسبة للطول.',
      },
      ai: {
        underweight: 'أولِ توفر الطاقة قبل زيادة كثافة التدريب.',
        normal: 'حافظ على الحمل وراقب اتجاهات التركيب.',
        overweight: 'خفّف العمل عالي التأثير وركّز على جودة الحركة.',
        obesity: 'فحص طبي قبل التحميل عالي الشدة.',
      },
    },
    body_fat: {
      classifications: { athlete: 'رياضي', excellent: 'ممتاز', good: 'جيد', average: 'متوسط', high: 'مرتفع' },
    },
    vo2_max: {
      classifications: {
        poor: 'ضعيف',
        fair: 'مقبول',
        good: 'جيد',
        very_good: 'جيد جداً',
        excellent: 'ممتاز',
        elite: 'نخبة',
      },
    },
    recovery_score: {
      classifications: {
        poor: 'ضعيف',
        needs_recovery: 'يحتاج تعافياً',
        moderate: 'متوسط',
        good: 'جيد',
        excellent: 'ممتاز',
      },
    },
    readiness_score: {
      classifications: {
        poor: 'ضعيف',
        needs_recovery: 'يحتاج تعافياً',
        moderate: 'متوسط',
        good: 'جيد',
        excellent: 'ممتاز',
      },
    },
    acwr: {
      classifications: { undertraining: 'تحميل منخفض', optimal: 'مثالي', elevated: 'مرتفع', spike: 'خطر spike' },
    },
    session_load: {
      classifications: { low: 'منخفض', moderate: 'متوسط', high: 'مرتفع', very_high: 'مرتفع جداً' },
    },
    hr_zones: {
      classifications: { zone1: 'المنطقة 1', zone2: 'المنطقة 2', zone3: 'المنطقة 3', zone4: 'المنطقة 4', zone5: 'المنطقة 5' },
    },
    body_water: { classifications: { low: 'منخفض', optimal: 'مثالي', elevated: 'مرتفع' } },
    muscle_mass: { classifications: { low: 'منخفض', optimal: 'مثالي', high: 'مرتفع' } },
    lean_mass: { classifications: { low: 'منخفض', optimal: 'مثالي', high: 'مرتفع' } },
  },
};

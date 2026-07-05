/** Knowledge articles placeholder — kept separate from Testing Center registry. */

export const KNOWLEDGE_ARTICLES: Record<string, Array<{ id: string; titleEn: string; titleAr: string; readMin: number }>> = {
  testing: [
    { id: 't1', titleEn: 'Yo-Yo IR1 Protocol', titleAr: 'بروتوكول Yo-Yo IR1', readMin: 8 },
    { id: 't2', titleEn: 'Sprint Testing Standards', titleAr: 'معايير اختبار السرعة', readMin: 6 },
  ],
  training: [
    { id: 'tr1', titleEn: 'Session Load (RPE × Duration)', titleAr: 'حمل الجلسة (RPE × المدة)', readMin: 5 },
    { id: 'tr2', titleEn: 'Microcycle Planning', titleAr: 'تخطيط الدورة التدريبية', readMin: 10 },
  ],
  recovery: [
    { id: 'r1', titleEn: 'HRV-Guided Recovery', titleAr: 'التعافي الموجّه بـ HRV', readMin: 7 },
    { id: 'r2', titleEn: 'Sleep & Performance', titleAr: 'النوم والأداء', readMin: 6 },
  ],
  nutrition: [
    { id: 'n1', titleEn: 'Match-Day Fueling', titleAr: 'التغذية يوم المباراة', readMin: 5 },
    { id: 'n2', titleEn: 'Hydration Strategies', titleAr: 'استراتيجيات الترطيب', readMin: 4 },
  ],
};

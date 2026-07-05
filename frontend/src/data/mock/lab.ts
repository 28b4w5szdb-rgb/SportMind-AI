/** Performance Lab mock data — benchmarks, categories, norms. */

export const LAB_CATEGORIES = [
  { id: 'endurance', icon: 'heart' as const, labelEn: 'Endurance', labelAr: 'القدرة على التحمل', color: '#EF4444', tests: ['yoyo', 'beep'] },
  { id: 'speed', icon: 'flash' as const, labelEn: 'Speed', labelAr: 'السرعة', color: '#F97316', tests: ['sprint30'] },
  { id: 'strength', icon: 'fitness' as const, labelEn: 'Strength', labelAr: 'القوة', color: '#0066FF', tests: ['cmj'] },
  { id: 'power', icon: 'rocket' as const, labelEn: 'Power', labelAr: 'الطاقة', color: '#10B981', tests: ['cmj'] },
  { id: 'agility', icon: 'move' as const, labelEn: 'Agility', labelAr: 'الرشاقة', color: '#8B5CF6', tests: ['sprint30'] },
  { id: 'flexibility', icon: 'accessibility' as const, labelEn: 'Flexibility', labelAr: 'المرونة', color: '#EC4899', tests: [] },
];

export const BENCHMARK_NORMS = [
  { testKey: 'yoyo', labelEn: 'Yo-Yo IR1', labelAr: 'Yo-Yo IR1', unit: 'm', elite: 1800, good: 1500, avg: 1200 },
  { testKey: 'sprint30', labelEn: '30m Sprint', labelAr: 'Sprint 30m', unit: 's', elite: 3.95, good: 4.2, avg: 4.5, lowerIsBetter: true },
  { testKey: 'cmj', labelEn: 'CMJ', labelAr: 'CMJ', unit: 'cm', elite: 55, good: 45, avg: 38 },
  { testKey: 'beep', labelEn: 'Beep Test', labelAr: 'Beep Test', unit: 'level', elite: 14, good: 11, avg: 9 },
];

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

export function benchmarkRating(
  value: number,
  norm: (typeof BENCHMARK_NORMS)[0]
): 'elite' | 'good' | 'average' | 'below' {
  const lower = 'lowerIsBetter' in norm && norm.lowerIsBetter;
  if (lower) {
    if (value <= norm.elite) return 'elite';
    if (value <= norm.good) return 'good';
    if (value <= norm.avg) return 'average';
    return 'below';
  }
  if (value >= norm.elite) return 'elite';
  if (value >= norm.good) return 'good';
  if (value >= norm.avg) return 'average';
  return 'below';
}

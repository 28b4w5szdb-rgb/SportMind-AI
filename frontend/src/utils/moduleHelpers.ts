import type { MockAthlete, MockPerformanceTest, MockReportSections } from '@/src/data/mock/types';

export function buildPerformanceTestsSummary(tests: MockPerformanceTest[], isRTL: boolean): string {
  if (tests.length === 0) {
    return isRTL ? 'لا توجد اختبارات مسجلة بعد.' : 'No performance tests recorded yet.';
  }
  return tests
    .slice(0, 6)
    .map((t) => `${t.test_type}: ${t.value} ${t.unit} (${t.date})`)
    .join('\n');
}

export function buildAthleteSummary(athlete: MockAthlete | undefined, isRTL: boolean): string {
  if (!athlete) {
    return isRTL ? 'لم يتم اختيار لاعب.' : 'No athlete selected.';
  }
  return isRTL
    ? `${athlete.first_name} ${athlete.last_name} — ${athlete.position}. الحالة: ${athlete.status}. الاختبارات: ${athlete.tests_count}. الاتجاه: ${athlete.trend_percent}%.`
    : `${athlete.first_name} ${athlete.last_name} — ${athlete.position}. Status: ${athlete.status}. Tests: ${athlete.tests_count}. Trend: ${athlete.trend_percent}%.`;
}

export function buildMockAiInsights(isRTL: boolean): string {
  return isRTL
    ? '• تحميل تدريبي ضمن النطاق المستهدف\n• استشفاء كافٍ خلال آخر 48 ساعة\n• مراقبة Yo-Yo قبل الجلسة القادمة'
    : '• Training load within target range\n• Adequate recovery over last 48h\n• Monitor Yo-Yo before next session block';
}

export function buildMockRecommendations(isRTL: boolean): string {
  return isRTL
    ? '1. الحفاظ على حجم التدريب الحالي\n2. جلسة movilidad قبل المباراة\n3. مراجعة التغذية بعد التمرين'
    : '1. Maintain current training volume\n2. Add mobility session pre-match\n3. Review post-training nutrition';
}

export function buildDefaultReportSections(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  summary: string,
  isRTL: boolean
): MockReportSections {
  return {
    athlete_summary: summary.trim() || buildAthleteSummary(athlete, isRTL),
    performance_tests: buildPerformanceTestsSummary(tests, isRTL),
    ai_insights: buildMockAiInsights(isRTL),
    recommendations: buildMockRecommendations(isRTL),
  };
}

export function reportStatusVariant(status: string): 'success' | 'warning' | 'info' | 'neutral' {
  if (status === 'ready') return 'success';
  if (status === 'exported') return 'info';
  return 'warning';
}

export function researchStatusVariant(status: string): 'success' | 'warning' | 'info' | 'neutral' {
  if (status === 'completed') return 'success';
  if (status === 'active') return 'info';
  return 'warning';
}

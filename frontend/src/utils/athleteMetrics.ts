import type { MockAthlete } from '@/src/data/mock/types';

/** 0–100 readiness score derived from mock athlete fields. */
export function computeReadinessScore(athlete: MockAthlete): number {
  let score = 72;
  if (athlete.status === 'active') score += 12;
  if (athlete.status === 'injured') score -= 35;
  if (athlete.status === 'rest') score += 5;
  score += Math.min(15, athlete.trend_percent);
  score -= Math.max(0, -athlete.trend_percent * 2);
  score += Math.min(8, athlete.tests_count / 3);
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function readinessColor(score: number): string {
  if (score >= 75) return '#10B981';
  if (score >= 50) return '#F97316';
  return '#EF4444';
}

export function readinessLabel(score: number, isRTL: boolean): string {
  if (score >= 75) return isRTL ? 'جاهز' : 'Ready';
  if (score >= 50) return isRTL ? 'متوسط' : 'Moderate';
  return isRTL ? 'منخفض' : 'Low';
}

export function injuryRisk(athlete: MockAthlete): 'low' | 'medium' | 'high' {
  if (athlete.status === 'injured') return 'high';
  if (athlete.trend_percent < -5) return 'medium';
  if (athlete.status === 'rest') return 'medium';
  return 'low';
}

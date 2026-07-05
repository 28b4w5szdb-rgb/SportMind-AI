import type { ModuleStatus, TrendDirection } from '../types';

export function scoreToStatus(score: number): ModuleStatus {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'moderate';
  if (score >= 40) return 'low';
  return 'critical';
}

export function statusToColor(status: ModuleStatus): string {
  switch (status) {
    case 'excellent':
      return '#10B981';
    case 'good':
      return '#0D9488';
    case 'moderate':
      return '#F97316';
    case 'low':
      return '#EF4444';
    default:
      return '#DC2626';
  }
}

export function scoreToColor(score: number): string {
  return statusToColor(scoreToStatus(score));
}

export function trendFromDelta(delta: number): TrendDirection {
  if (delta > 1.5) return 'up';
  if (delta < -1.5) return 'down';
  return 'stable';
}

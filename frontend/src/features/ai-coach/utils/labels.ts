import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';

type TranslateFn = (key: string) => string;

export function formatAnalyticsStatus(status: string | undefined, t: TranslateFn): string {
  if (!status) return '—';
  const key = `analytics.status.${status}`;
  const translated = t(key);
  return translated === key ? status.replace(/_/g, ' ') : translated;
}

export function formatSweatRisk(value: string | undefined, t: TranslateFn): string {
  if (!value) return '—';
  const key = `nutrition.sweatRisk.${value}`;
  const translated = t(key);
  return translated === key ? value.replace(/_/g, ' ') : translated;
}

export function formatDecisionLevel(level: string, t: TranslateFn): string {
  const map: Record<string, string> = {
    ready_to_train: 'analytics.decision.readyTitle',
    train_reduced_load: 'analytics.decision.reducedTitle',
    recovery_day: 'analytics.decision.recoveryTitle',
    medical_evaluation: 'analytics.decision.medicalTitle',
  };
  const key = map[level];
  return key ? t(key) : level.replace(/_/g, ' ');
}

export function kpiLine(analytics: AthleteAnalyticsSnapshot, kpiId: string, t: TranslateFn): string {
  const kpi = analytics.kpis.find((k) => k.id === kpiId);
  if (!kpi) return '—';
  const label = t(kpi.labelKey);
  const status = kpi.status ? ` (${formatAnalyticsStatus(kpi.status, t)})` : '';
  return `${label}: ${kpi.displayValue}${status}`;
}

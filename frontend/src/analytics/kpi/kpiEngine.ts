import type { AnalyticsModuleResult, KpiCardData } from '../types';

const KPI_MODULE_MAP: Record<string, string> = {
  readiness: 'analytics.kpi.readiness',
  recovery: 'analytics.kpi.recovery',
  fatigue: 'analytics.kpi.fatigue',
  training_load: 'analytics.kpi.trainingLoad',
  physical_fitness: 'analytics.kpi.performance',
  injury_risk: 'analytics.kpi.injuryRisk',
};

const KPI_ICONS: Record<string, KpiCardData['icon']> = {
  readiness: 'checkmark-circle',
  recovery: 'bed',
  fatigue: 'battery-half',
  training_load: 'analytics',
  physical_fitness: 'trophy',
  injury_risk: 'medkit',
};

export function buildKpiCards(modules: AnalyticsModuleResult[]): KpiCardData[] {
  return Object.entries(KPI_MODULE_MAP).map(([moduleId, labelKey]) => {
    const mod = modules.find((m) => m.id === moduleId)!;
    return {
      id: moduleId,
      labelKey,
      value: mod.score,
      displayValue: `${mod.score}`,
      status: mod.status,
      trend: mod.trend,
      trendDelta: mod.trendDelta,
      color: mod.color,
      icon: KPI_ICONS[moduleId] ?? 'pulse',
    };
  });
}

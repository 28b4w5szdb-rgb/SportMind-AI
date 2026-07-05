import type { AnalyticsModuleId, AnalyticsModuleResult, ModuleStatus } from '@/src/analytics/types';

export interface BodyMapZoneDef {
  id: string;
  labelKey: string;
  moduleId: AnalyticsModuleId;
  kind: 'circle' | 'rect' | 'ellipse';
  props: Record<string, number>;
}

/** Abstract geometric figure — original SVG layout, no copyrighted anatomy assets. */
export const BODY_MAP_ZONES: BodyMapZoneDef[] = [
  { id: 'head', labelKey: 'athleteWorkspace.body.head', moduleId: 'readiness', kind: 'circle', props: { cx: 100, cy: 30, r: 22 } },
  { id: 'chest', labelKey: 'athleteWorkspace.body.chest', moduleId: 'strength', kind: 'rect', props: { x: 68, y: 56, width: 64, height: 46, rx: 14 } },
  { id: 'core', labelKey: 'athleteWorkspace.body.core', moduleId: 'physical_fitness', kind: 'rect', props: { x: 76, y: 104, width: 48, height: 38, rx: 12 } },
  { id: 'shoulder_l', labelKey: 'athleteWorkspace.body.shoulders', moduleId: 'strength', kind: 'ellipse', props: { cx: 52, cy: 68, rx: 16, ry: 12 } },
  { id: 'shoulder_r', labelKey: 'athleteWorkspace.body.shoulders', moduleId: 'strength', kind: 'ellipse', props: { cx: 148, cy: 68, rx: 16, ry: 12 } },
  { id: 'arm_l', labelKey: 'athleteWorkspace.body.arms', moduleId: 'strength', kind: 'rect', props: { x: 34, y: 78, width: 26, height: 58, rx: 10 } },
  { id: 'arm_r', labelKey: 'athleteWorkspace.body.arms', moduleId: 'strength', kind: 'rect', props: { x: 140, y: 78, width: 26, height: 58, rx: 10 } },
  { id: 'hips', labelKey: 'athleteWorkspace.body.hips', moduleId: 'flexibility', kind: 'rect', props: { x: 68, y: 144, width: 64, height: 30, rx: 16 } },
  { id: 'glutes', labelKey: 'athleteWorkspace.body.glutes', moduleId: 'injury_risk', kind: 'ellipse', props: { cx: 100, cy: 168, rx: 28, ry: 14 } },
  { id: 'leg_l', labelKey: 'athleteWorkspace.body.legs', moduleId: 'speed', kind: 'rect', props: { x: 72, y: 178, width: 26, height: 72, rx: 12 } },
  { id: 'leg_r', labelKey: 'athleteWorkspace.body.legs', moduleId: 'speed', kind: 'rect', props: { x: 102, y: 178, width: 26, height: 72, rx: 12 } },
  { id: 'calf_l', labelKey: 'athleteWorkspace.body.calves', moduleId: 'endurance', kind: 'rect', props: { x: 74, y: 254, width: 22, height: 52, rx: 10 } },
  { id: 'calf_r', labelKey: 'athleteWorkspace.body.calves', moduleId: 'endurance', kind: 'rect', props: { x: 104, y: 254, width: 22, height: 52, rx: 10 } },
];

export const BODY_MAP_VIEWBOX = { width: 200, height: 320 };

export interface ScoreBand {
  id: ModuleStatus;
  min: number;
  color: string;
  labelKey: string;
}

export const SCORE_BANDS: ScoreBand[] = [
  { id: 'excellent', min: 75, color: '#10B981', labelKey: 'athleteWorkspace.bodyMapLegend.excellent' },
  { id: 'good', min: 55, color: '#0066FF', labelKey: 'athleteWorkspace.bodyMapLegend.good' },
  { id: 'moderate', min: 40, color: '#F97316', labelKey: 'athleteWorkspace.bodyMapLegend.moderate' },
  { id: 'low', min: 0, color: '#EF4444', labelKey: 'athleteWorkspace.bodyMapLegend.low' },
];

export function scoreColor(score: number): string {
  if (score >= 75) return '#10B981';
  if (score >= 55) return '#0066FF';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

export function scoreBandFor(score: number): ScoreBand {
  return SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

export function moduleForZone(modules: AnalyticsModuleResult[], moduleId: AnalyticsModuleId): AnalyticsModuleResult | undefined {
  return modules.find((m) => m.id === moduleId);
}

export function zoneScore(modules: AnalyticsModuleResult[], moduleId: AnalyticsModuleId): number {
  return moduleForZone(modules, moduleId)?.score ?? 50;
}

export function bodyBalanceIndex(modules: AnalyticsModuleResult[]): number {
  const moduleIds = [...new Set(BODY_MAP_ZONES.map((z) => z.moduleId))];
  const total = moduleIds.reduce((sum, id) => sum + zoneScore(modules, id), 0);
  return Math.round(total / moduleIds.length);
}

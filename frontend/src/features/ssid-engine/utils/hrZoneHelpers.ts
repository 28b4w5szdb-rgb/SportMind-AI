export interface HrZoneRange {
  id: string;
  labelKey: string;
  minPct: number;
  maxPct: number;
  minBpm: number;
  maxBpm: number;
}

export function buildHrZoneRanges(maxHr: number): HrZoneRange[] {
  const pct = [
    { id: 'zone1', labelKey: 'ssid.metrics.hr_zones.classifications.zone1', min: 0.5, max: 0.6 },
    { id: 'zone2', labelKey: 'ssid.metrics.hr_zones.classifications.zone2', min: 0.6, max: 0.7 },
    { id: 'zone3', labelKey: 'ssid.metrics.hr_zones.classifications.zone3', min: 0.7, max: 0.8 },
    { id: 'zone4', labelKey: 'ssid.metrics.hr_zones.classifications.zone4', min: 0.8, max: 0.9 },
    { id: 'zone5', labelKey: 'ssid.metrics.hr_zones.classifications.zone5', min: 0.9, max: 1.0 },
  ];
  return pct.map((z) => ({
    id: z.id,
    labelKey: z.labelKey,
    minPct: z.min * 100,
    maxPct: z.max * 100,
    minBpm: Math.round(maxHr * z.min),
    maxBpm: Math.round(maxHr * z.max),
  }));
}

export function resolveHrZoneBand(targetHr: number, maxHr: number): string {
  const pct = maxHr > 0 ? targetHr / maxHr : 0.7;
  if (pct < 0.6) return 'zone1';
  if (pct < 0.7) return 'zone2';
  if (pct < 0.8) return 'zone3';
  if (pct < 0.9) return 'zone4';
  return 'zone5';
}

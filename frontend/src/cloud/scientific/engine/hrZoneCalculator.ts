/**
 * Heart rate zone calculator — %HRmax and Karvonen (HRR) methods.
 */

import type {
  HeartRateZone,
  HeartRateZoneMethod,
  HeartRateZoneResult,
} from '../models/calculation/HeartRateZones';

export type { HeartRateZoneMethod, HeartRateZoneResult };

const ZONE_DEFINITIONS: Array<{ zone: 1 | 2 | 3 | 4 | 5; label: string; min: number; max: number }> =
  [
    { zone: 1, label: 'Recovery', min: 50, max: 60 },
    { zone: 2, label: 'Aerobic', min: 60, max: 70 },
    { zone: 3, label: 'Tempo', min: 70, max: 80 },
    { zone: 4, label: 'Threshold', min: 80, max: 90 },
    { zone: 5, label: 'Max', min: 90, max: 100 },
  ];

function roundBpm(value: number): number {
  return Math.round(value);
}

function buildZonesFromPercents(
  resolveBpm: (percent: number) => number
): HeartRateZone[] {
  return ZONE_DEFINITIONS.map(({ zone, label, min, max }) => ({
    zone,
    label,
    min_bpm: roundBpm(resolveBpm(min)),
    max_bpm: roundBpm(resolveBpm(max)),
    min_percent: min,
    max_percent: max,
  }));
}

export function estimateMaxHeartRate(ageYears: number): number {
  return roundBpm(220 - ageYears);
}

/** 1 = %HRmax, 2 = Karvonen */
export function resolveHeartRateZoneMethod(
  methodCode: number | undefined,
  restingHr: number | undefined
): HeartRateZoneMethod {
  if (methodCode === 2) return 'karvonen';
  if (methodCode === 1) return 'hrmax_percent';
  return restingHr !== undefined ? 'karvonen' : 'hrmax_percent';
}

export function calculateHeartRateZones(input: {
  ageYears: number;
  restingHr?: number;
  method?: HeartRateZoneMethod;
}): HeartRateZoneResult {
  const maxHr = estimateMaxHeartRate(input.ageYears);
  const method = input.method ?? resolveHeartRateZoneMethod(undefined, input.restingHr);

  if (method === 'karvonen') {
    const resting = input.restingHr ?? 60;
    const reserve = maxHr - resting;
    if (reserve <= 0) {
      throw new Error('invalid_hr:heart_rate_reserve');
    }
    return {
      method: 'karvonen',
      max_heart_rate: maxHr,
      resting_heart_rate: resting,
      zones: buildZonesFromPercents((percent) => (reserve * percent) / 100 + resting),
    };
  }

  return {
    method: 'hrmax_percent',
    max_heart_rate: maxHr,
    resting_heart_rate: input.restingHr,
    zones: buildZonesFromPercents((percent) => (maxHr * percent) / 100),
  };
}

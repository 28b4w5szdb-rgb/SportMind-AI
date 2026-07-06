/**
 * Heart rate zone types — shared by engine and calculation models.
 */

export type HeartRateZoneMethod = 'hrmax_percent' | 'karvonen';

export interface HeartRateZone {
  zone: 1 | 2 | 3 | 4 | 5;
  label: string;
  min_bpm: number;
  max_bpm: number;
  min_percent: number;
  max_percent: number;
}

export interface HeartRateZoneResult {
  method: HeartRateZoneMethod;
  max_heart_rate: number;
  resting_heart_rate?: number;
  zones: HeartRateZone[];
}

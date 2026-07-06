/** Demographic reference tables for performance test norm adjustment. */

import type { TestReferenceValues } from '@/src/features/performance-lab/types';

export type GenderProfile = 'male' | 'female';
export type SportProfile = 'football' | 'basketball' | 'athletics' | 'combat' | 'general';
export type CompetitionLevel = 'elite' | 'professional' | 'academy' | 'recreational';

export interface ReferenceContext {
  ageYears?: number;
  gender?: GenderProfile;
  sport?: SportProfile;
  level?: CompetitionLevel;
}

export interface AgeBand {
  id: string;
  min: number;
  max: number;
  labelKey: string;
  speedFactor: number;
  enduranceFactor: number;
  powerFactor: number;
}

export const AGE_BANDS: AgeBand[] = [
  { id: 'u17', min: 0, max: 16, labelKey: 'testingScience.age.u17', speedFactor: 1.06, enduranceFactor: 0.97, powerFactor: 0.96 },
  { id: 'u20', min: 17, max: 20, labelKey: 'testingScience.age.u20', speedFactor: 1.03, enduranceFactor: 0.99, powerFactor: 0.98 },
  { id: 'senior', min: 21, max: 30, labelKey: 'testingScience.age.senior', speedFactor: 1.0, enduranceFactor: 1.0, powerFactor: 1.0 },
  { id: 'masters', min: 31, max: 99, labelKey: 'testingScience.age.masters', speedFactor: 1.04, enduranceFactor: 0.96, powerFactor: 0.94 },
];

export const GENDER_FACTORS: Record<GenderProfile, { speed: number; strength: number; bodyFat: number }> = {
  male: { speed: 1.0, strength: 1.0, bodyFat: 1.0 },
  female: { speed: 1.05, strength: 0.92, bodyFat: 1.12 },
};

export const SPORT_PROFILES: Record<SportProfile, { labelKey: string; speed: number; endurance: number; agility: number }> = {
  football: { labelKey: 'testingScience.sport.football', speed: 1.0, endurance: 1.0, agility: 1.0 },
  basketball: { labelKey: 'testingScience.sport.basketball', speed: 1.02, endurance: 0.98, agility: 0.97 },
  athletics: { labelKey: 'testingScience.sport.athletics', speed: 0.96, endurance: 0.97, agility: 0.98 },
  combat: { labelKey: 'testingScience.sport.combat', speed: 1.01, endurance: 0.99, agility: 0.99 },
  general: { labelKey: 'testingScience.sport.general', speed: 1.0, endurance: 1.0, agility: 1.0 },
};

export const COMPETITION_LEVELS: Record<CompetitionLevel, { labelKey: string; strictness: number }> = {
  elite: { labelKey: 'testingScience.level.elite', strictness: 0.95 },
  professional: { labelKey: 'testingScience.level.professional', strictness: 1.0 },
  academy: { labelKey: 'testingScience.level.academy', strictness: 1.06 },
  recreational: { labelKey: 'testingScience.level.recreational', strictness: 1.12 },
};

function resolveAgeBand(ageYears?: number): AgeBand {
  if (ageYears === undefined) return AGE_BANDS.find((b) => b.id === 'senior')!;
  return AGE_BANDS.find((b) => ageYears >= b.min && ageYears <= b.max) ?? AGE_BANDS[2];
}

function categoryFactor(categoryId: string, ctx: ReferenceContext): number {
  const age = resolveAgeBand(ctx.ageYears);
  const sport = SPORT_PROFILES[ctx.sport ?? 'general'];
  const level = COMPETITION_LEVELS[ctx.level ?? 'professional'];
  const gender = GENDER_FACTORS[ctx.gender ?? 'male'];

  switch (categoryId) {
    case 'speed':
      return age.speedFactor * gender.speed * sport.speed * level.strictness;
    case 'endurance':
      return (2 - age.enduranceFactor) * sport.endurance * level.strictness;
    case 'strength':
    case 'power':
      return (2 - age.powerFactor) * gender.strength * level.strictness;
    case 'agility':
      return sport.agility * level.strictness;
    case 'body_composition':
      return gender.bodyFat * level.strictness;
    default:
      return level.strictness;
  }
}

/** Adjust registry reference values using age, gender, sport, and competition level. */
export function adjustReferenceValues(ref: TestReferenceValues, categoryId: string, ctx: ReferenceContext = {}): TestReferenceValues {
  const factor = categoryFactor(categoryId, ctx);
  const lower = ref.lowerIsBetter === true;

  const scale = (v: number) => Math.round(v * factor * 100) / 100;

  if (lower) {
    return { ...ref, elite: scale(ref.elite), good: scale(ref.good), average: scale(ref.average) };
  }
  return { ...ref, elite: scale(ref.elite), good: scale(ref.good), average: scale(ref.average) };
}

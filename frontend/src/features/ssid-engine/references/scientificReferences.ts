import type { TestCategoryId } from '@/src/features/performance-lab/types';

import type { SsidMetricId } from '../types';

export type ScientificReferenceGroupId = 'acsm' | 'nsca' | 'fifa' | 'ioc' | 'sports_medicine';
export type EvidenceLevelId = 'high' | 'moderate' | 'emerging';

interface ReferenceAssignment {
  group: ScientificReferenceGroupId;
  evidence: EvidenceLevelId;
}

const METRIC_REFERENCES: Record<SsidMetricId, ReferenceAssignment> = {
  bmi: { group: 'acsm', evidence: 'high' },
  body_fat: { group: 'acsm', evidence: 'high' },
  body_water: { group: 'sports_medicine', evidence: 'moderate' },
  muscle_mass: { group: 'nsca', evidence: 'moderate' },
  lean_mass: { group: 'nsca', evidence: 'moderate' },
  vo2_max: { group: 'acsm', evidence: 'high' },
  hr_zones: { group: 'acsm', evidence: 'high' },
  session_load: { group: 'ioc', evidence: 'moderate' },
  acwr: { group: 'ioc', evidence: 'high' },
  recovery_score: { group: 'sports_medicine', evidence: 'emerging' },
  readiness_score: { group: 'sports_medicine', evidence: 'emerging' },
};

const CATEGORY_REFERENCES: Record<TestCategoryId, ReferenceAssignment> = {
  speed: { group: 'fifa', evidence: 'high' },
  strength: { group: 'nsca', evidence: 'high' },
  endurance: { group: 'acsm', evidence: 'high' },
  agility: { group: 'fifa', evidence: 'high' },
  power: { group: 'nsca', evidence: 'high' },
  flexibility: { group: 'acsm', evidence: 'moderate' },
  balance: { group: 'sports_medicine', evidence: 'moderate' },
  body_composition: { group: 'acsm', evidence: 'high' },
  reaction_time: { group: 'sports_medicine', evidence: 'moderate' },
  neuromuscular: { group: 'nsca', evidence: 'moderate' },
  functional_movement: { group: 'acsm', evidence: 'moderate' },
  custom: { group: 'sports_medicine', evidence: 'emerging' },
};

const DEFAULT_REFERENCE: ReferenceAssignment = { group: 'sports_medicine', evidence: 'moderate' };

export function resolveScientificReferenceForMetric(metricId: SsidMetricId): {
  scientificReferenceKey: string;
  evidenceLevelKey: string;
} {
  const ref = METRIC_REFERENCES[metricId] ?? DEFAULT_REFERENCE;
  return {
    scientificReferenceKey: `ssid.references.${ref.group}`,
    evidenceLevelKey: `ssid.evidenceLevel.${ref.evidence}`,
  };
}

export function resolveScientificReferenceForCategory(categoryId: TestCategoryId | string): {
  scientificReferenceKey: string;
  evidenceLevelKey: string;
} {
  const ref = CATEGORY_REFERENCES[categoryId as TestCategoryId] ?? DEFAULT_REFERENCE;
  return {
    scientificReferenceKey: `ssid.references.${ref.group}`,
    evidenceLevelKey: `ssid.evidenceLevel.${ref.evidence}`,
  };
}

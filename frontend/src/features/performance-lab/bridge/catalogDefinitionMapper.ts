/**
 * Maps Scientific catalog definitions ↔ Performance Lab TestDefinition.
 */

import type { CatalogAssessmentDefinition } from '@/src/cloud/scientific/models/catalog/AssessmentDefinition';
import type { EvidenceTier, ScientificCategoryCode } from '@/src/cloud/scientific/models/common';

import { getTestDefinition } from '../registry/tests';
import type { TestCategoryId, TestDefinition, TestLibraryFilters, TestObjective } from '../types';
import { matchesLibraryQuery } from '../utils/copyHelpers';

export const PERF_LAB_TO_SCIENTIFIC: Record<TestCategoryId, ScientificCategoryCode> = {
  speed: 'speed',
  strength: 'strength',
  endurance: 'cardiorespiratory',
  agility: 'agility',
  power: 'power',
  flexibility: 'injury_risk',
  balance: 'injury_risk',
  body_composition: 'body_composition',
  reaction_time: 'neuromuscular',
  neuromuscular: 'neuromuscular',
  functional_movement: 'injury_risk',
  custom: 'monitoring',
};

const SUBCATEGORY_OBJECTIVE: Record<string, TestObjective> = {
  linear_speed: 'linear_speed',
  max_strength: 'max_force',
  aerobic_fitness: 'aerobic_capacity',
  change_of_direction: 'change_of_direction',
  explosive_power: 'explosive_power',
  range_of_motion: 'range_of_motion',
  postural_control: 'stability',
  composition_analysis: 'body_composition',
  reaction_cognition: 'reaction_cognition',
  neuromuscular_control: 'neuromuscular',
  movement_screening: 'movement_quality',
  custom_metric: 'custom_metric',
};

export function mapScientificCategoryToPerfLab(
  categoryCode: ScientificCategoryCode,
  subcategory: string,
  key: string
): TestCategoryId {
  const legacy = getTestDefinition(key);
  if (legacy) return legacy.categoryId;

  if (categoryCode === 'cardiorespiratory') return 'endurance';
  if (categoryCode === 'body_composition') return 'body_composition';
  if (categoryCode === 'speed') return 'speed';
  if (categoryCode === 'strength') return 'strength';
  if (categoryCode === 'agility') return 'agility';
  if (categoryCode === 'power') return 'power';
  if (categoryCode === 'monitoring') return 'custom';

  if (categoryCode === 'injury_risk') {
    if (subcategory.includes('balance') || subcategory.includes('postural')) return 'balance';
    if (subcategory.includes('movement')) return 'functional_movement';
    return 'flexibility';
  }

  if (categoryCode === 'neuromuscular') {
    if (subcategory.includes('reaction')) return 'reaction_time';
    return 'neuromuscular';
  }

  return 'custom';
}

export function mapCatalogToTestDefinition(catalog: CatalogAssessmentDefinition): TestDefinition {
  const legacy = getTestDefinition(catalog.key);
  const isOrgCustom = Boolean(catalog.tags?.includes('custom'));
  const categoryId = mapScientificCategoryToPerfLab(
    catalog.category_code,
    catalog.subcategory,
    catalog.key
  );
  const objective = SUBCATEGORY_OBJECTIVE[catalog.subcategory] ?? legacy?.objective ?? 'custom_metric';

  if (legacy) {
    return {
      ...legacy,
      evidenceTier: catalog.evidence_tier,
      usabilityModes: catalog.usability_modes,
      isCustom: legacy.isCustom ?? isOrgCustom,
      scientificStatus: legacy.scientificStatus ?? (isOrgCustom ? 'scientific' : undefined),
    };
  }

  return {
    key: catalog.key,
    categoryId,
    icon: 'flask',
    unit: catalog.unit,
    referenceValues: { elite: 0, good: 0, average: 0 },
    affectedModules: [],
    analyticsWeight: 0.5,
    expectedTrend: 'up',
    objective,
    featured: false,
    isCustom: isOrgCustom || undefined,
    scientificStatus: isOrgCustom ? 'scientific' : undefined,
    retestIntervalDays: catalog.retest_interval_days,
    knowledge: {
      whatMeasures: catalog.description,
      whyImportant: catalog.purpose,
      howPerformed: catalog.protocol_summary,
      whatAffects: catalog.common_mistakes,
      commonMistakes: catalog.common_mistakes,
    },
    copy: {
      name: catalog.name,
      description: catalog.description,
      purpose: catalog.purpose,
      equipment: catalog.protocol_summary,
      protocol: catalog.protocol_summary,
      scoring: catalog.protocol_summary,
      interpretation: catalog.interpretation_scope,
      aiRec: catalog.interpretation_scope,
    },
    evidenceTier: catalog.evidence_tier,
    usabilityModes: catalog.usability_modes,
  };
}

export function catalogMatchesCategory(
  catalog: CatalogAssessmentDefinition,
  categoryId: TestCategoryId
): boolean {
  const mapped = mapCatalogToTestDefinition(catalog);
  return mapped.categoryId === categoryId;
}

export function filterLibraryDefinitions(
  definitions: TestDefinition[],
  filters: TestLibraryFilters,
  favorites: string[],
  isRTL: boolean
): TestDefinition[] {
  return definitions.filter((def) => {
    if (filters.categoryId !== 'all' && def.categoryId !== filters.categoryId) return false;
    if (filters.objective !== 'all' && def.objective !== filters.objective) return false;
    if (filters.favoritesOnly && !favorites.includes(def.key)) return false;
    if (filters.evidenceTier && filters.evidenceTier !== 'all' && def.evidenceTier !== filters.evidenceTier) {
      return false;
    }
    if (filters.usabilityMode && filters.usabilityMode !== 'all') {
      const modes = def.usabilityModes?.[filters.usabilityMode];
      if (!modes || modes.length === 0) return false;
    }
    if (!matchesLibraryQuery(def, filters.query, isRTL)) return false;
    return true;
  });
}

export type UsabilityModeFilter = 'beginner' | 'professional' | 'research';

export function extendLibraryFilters(
  filters: TestLibraryFilters
): Required<Pick<TestLibraryFilters, 'evidenceTier' | 'usabilityMode'>> & TestLibraryFilters {
  return {
    ...filters,
    evidenceTier: filters.evidenceTier ?? 'all',
    usabilityMode: filters.usabilityMode ?? 'all',
  };
}

export const EVIDENCE_TIER_OPTIONS: EvidenceTier[] = [
  'screening',
  'field',
  'professional',
  'clinical',
  'research',
];

export const USABILITY_MODE_OPTIONS: UsabilityModeFilter[] = ['beginner', 'professional', 'research'];

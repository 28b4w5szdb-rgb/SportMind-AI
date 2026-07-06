/**
 * Maps Performance Lab TestDefinition rows to scientific catalog definitions.
 * Keeps Performance Lab registry as migration source — no UI changes in this phase.
 */

import type { TestCategoryId, TestDefinition } from '@/src/features/performance-lab/types';
import type { CatalogAssessmentDefinition } from '../../models/catalog/AssessmentDefinition';
import type { EvidenceTier, ScientificCategoryCode } from '../../models/common';
import {
  buildAssessmentDefinition,
  buildProtocolVersion,
  type BuildAssessmentDefinitionInput,
} from '../definitionBuilder';
import type { AssessmentProtocolVersion } from '../../models/catalog/AssessmentDefinition';

const PERF_LAB_TO_SCIENTIFIC: Record<TestCategoryId, ScientificCategoryCode> = {
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

const EVIDENCE_TIER_OVERRIDES: Partial<Record<string, EvidenceTier>> = {
  astrand: 'clinical',
  bruce: 'clinical',
  balke: 'clinical',
  cooper: 'field',
  yoyo: 'professional',
  yoyo_ir2: 'professional',
  fms: 'screening',
  y_balance: 'screening',
  sebt: 'professional',
  cmj: 'field',
  cmj_rsi: 'research',
  imtp: 'research',
  force_symmetry: 'research',
  skinfold: 'field',
  body_fat: 'field',
  bmi: 'screening',
  vo2max_est: 'screening',
  lactate_threshold: 'professional',
  visual_reaction: 'field',
  choice_reaction: 'field',
};

const SUBCATEGORY_BY_CATEGORY: Record<TestCategoryId, string> = {
  speed: 'linear_speed',
  strength: 'max_strength',
  endurance: 'aerobic_fitness',
  agility: 'change_of_direction',
  power: 'explosive_power',
  flexibility: 'range_of_motion',
  balance: 'postural_control',
  body_composition: 'composition_analysis',
  reaction_time: 'reaction_cognition',
  neuromuscular: 'neuromuscular_control',
  functional_movement: 'movement_screening',
  custom: 'custom_metric',
};

function resolveEvidenceTier(test: TestDefinition): EvidenceTier {
  return EVIDENCE_TIER_OVERRIDES[test.key] ?? 'field';
}

export function mapPerformanceLabTestToDefinition(test: TestDefinition): CatalogAssessmentDefinition {
  const categoryCode = PERF_LAB_TO_SCIENTIFIC[test.categoryId];
  const input: BuildAssessmentDefinitionInput = {
    key: test.key,
    categoryCode,
    subcategory: SUBCATEGORY_BY_CATEGORY[test.categoryId] ?? test.objective,
    name: test.copy.name,
    description: test.copy.description,
    purpose: test.copy.purpose,
    audience: {
      en: 'Coaches, sports scientists, and medical staff in field and club settings',
      ar: 'المدربون وعلماء الرياضة والطاقم الطبي في البيئات الميدانية والأندية',
    },
    evidenceTier: resolveEvidenceTier(test),
    unit: test.unit,
    lowerIsBetter: test.referenceValues.lowerIsBetter ?? false,
    protocolSummary: test.copy.protocol,
    retestIntervalDays: test.retestIntervalDays,
    sourceTypes: ['manual'],
    equipmentOptionKeys: [test.copy.equipment.en],
    commonMistakes: test.knowledge.commonMistakes,
    interpretationScope: test.copy.interpretation,
    tags: [categoryCode, test.objective, test.key],
    ssidTemplateId: test.ssidMetricId ?? null,
  };

  return buildAssessmentDefinition(input);
}

export function mapPerformanceLabTestToProtocol(
  test: TestDefinition,
  definition: CatalogAssessmentDefinition
): AssessmentProtocolVersion {
  return buildProtocolVersion(definition, test.copy.protocol, test.copy.equipment);
}

export function mapPerformanceLabTests(
  tests: TestDefinition[]
): { definitions: CatalogAssessmentDefinition[]; protocols: AssessmentProtocolVersion[] } {
  const definitions: CatalogAssessmentDefinition[] = [];
  const protocols: AssessmentProtocolVersion[] = [];

  for (const test of tests) {
    if (test.key === 'custom_test' || test.isCustom) continue;
    const definition = mapPerformanceLabTestToDefinition(test);
    definitions.push(definition);
    protocols.push(mapPerformanceLabTestToProtocol(test, definition));
  }

  return { definitions, protocols };
}

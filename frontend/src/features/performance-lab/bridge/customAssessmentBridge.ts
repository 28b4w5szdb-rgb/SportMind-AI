/**
 * Custom Assessment Bridge — org-scoped definitions for Performance Lab (Phase 6C.9.3).
 */

import type { CatalogAssessmentDefinition } from '@/src/cloud/scientific/models/catalog/AssessmentDefinition';
import type { AssessmentProtocolVersion } from '@/src/cloud/scientific/models/catalog/AssessmentDefinition';
import type { EvidenceTier } from '@/src/cloud/scientific/models/common';
import {
  buildAssessmentDefinition,
  buildProtocolVersion,
  primaryInputField,
} from '@/src/cloud/scientific/seed/definitionBuilder';
import { bilingual } from '@/src/cloud/scientific/seed/seedHelpers';
import { registerCustomAssessmentBundle, getCustomAssessmentBundle, type CustomAssessmentBundle } from '@/src/cloud/scientific/adapters/mock/customAssessmentRegistry';

import type { CustomTestInput, ScientificCustomStatus, TestCategoryId, TestDefinition } from '../types';
import { PERF_LAB_TO_SCIENTIFIC } from './catalogDefinitionMapper';
import { PERFORMANCE_LAB_MOCK_ORG_ID } from './constants';

const VALID_CATEGORIES: TestCategoryId[] = [
  'speed',
  'strength',
  'endurance',
  'agility',
  'power',
  'flexibility',
  'balance',
  'body_composition',
  'reaction_time',
  'neuromuscular',
  'functional_movement',
  'custom',
];

const ADVANCED_EVIDENCE_TIERS: EvidenceTier[] = ['screening', 'field', 'professional'];
const RESEARCH_EVIDENCE_TIERS: EvidenceTier[] = ['clinical', 'research'];

export interface CustomAssessmentValidationResult {
  valid: boolean;
  errorKey?: string;
}

export interface CreateCustomAssessmentResult {
  key: string;
  definition: CatalogAssessmentDefinition;
  protocol: AssessmentProtocolVersion;
  bundle: CustomAssessmentBundle;
  scientificStatus: ScientificCustomStatus;
}

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
}

export function buildUniqueCustomKey(name: string, existingKeys: string[]): string {
  const base = `custom_${slugifyName(name) || 'assessment'}`;
  const keys = new Set(existingKeys);
  if (!keys.has(base)) return base;
  let index = 2;
  while (keys.has(`${base}_${index}`)) index += 1;
  return `${base}_${index}`;
}

export function validateCustomAssessmentInput(
  input: CustomTestInput,
  existingKeys: string[]
): CustomAssessmentValidationResult {
  if (!input.name?.trim()) {
    return { valid: false, errorKey: 'testingCenter.custom.nameRequired' };
  }
  if (!input.unit?.trim()) {
    return { valid: false, errorKey: 'testingCenter.custom.unitRequired' };
  }
  if (!input.protocol?.trim()) {
    return { valid: false, errorKey: 'testingCenter.custom.protocolRequired' };
  }

  const metricKey = input.primaryMetricKey?.trim() || input.targetMetric?.trim() || 'primary_value';
  if (!metricKey) {
    return { valid: false, errorKey: 'testingCenter.custom.metricRequired' };
  }

  const categoryId = input.categoryId ?? 'custom';
  if (!VALID_CATEGORIES.includes(categoryId)) {
    return { valid: false, errorKey: 'testingCenter.custom.invalidCategory' };
  }

  const tier = input.evidenceTier ?? 'screening';
  if (RESEARCH_EVIDENCE_TIERS.includes(tier)) {
    const meta = input.researchMetadata;
    if (!meta?.validityNotes?.trim() || !meta?.reliabilityNotes?.trim()) {
      return { valid: false, errorKey: 'testingCenter.custom.researchMetadataRequired' };
    }
  }

  if (!['manual'].includes(input.sourceType ?? 'manual')) {
    return { valid: false, errorKey: 'testingCenter.custom.unsupportedSourceType' };
  }

  const proposedKey = buildUniqueCustomKey(input.name, existingKeys);
  if (existingKeys.includes(proposedKey)) {
    return { valid: false, errorKey: 'testingCenter.custom.duplicateKey' };
  }

  if (!ADVANCED_EVIDENCE_TIERS.includes(tier) && !RESEARCH_EVIDENCE_TIERS.includes(tier)) {
    return { valid: false, errorKey: 'testingCenter.custom.invalidEvidenceTier' };
  }

  return { valid: true };
}

export function buildCustomCatalogDefinition(
  input: CustomTestInput,
  key: string
): { definition: CatalogAssessmentDefinition; protocol: AssessmentProtocolVersion } {
  const nameAr = input.nameAr?.trim() || input.name.trim();
  const protocolAr = input.protocolAr?.trim() || input.protocol.trim();
  const categoryId = input.categoryId ?? 'custom';
  const categoryCode = PERF_LAB_TO_SCIENTIFIC[categoryId];
  const evidenceTier = input.evidenceTier ?? 'screening';
  const metricKey = input.primaryMetricKey?.trim() || input.targetMetric?.trim() || 'primary_value';
  const unit = input.unit.trim();

  const definition = buildAssessmentDefinition({
    key,
    categoryCode,
    subcategory: categoryId === 'custom' ? 'custom_metric' : categoryId,
    name: bilingual(input.name.trim(), nameAr),
    description: bilingual(
      `Organization custom assessment: ${input.name.trim()}.`,
      `تقييم مخصص للمنظمة: ${nameAr}.`
    ),
    purpose: bilingual(
      input.targetMetric?.trim()
        ? `Track ${input.targetMetric.trim()}.`
        : 'Track a custom performance metric.',
      input.targetMetricAr?.trim()
        ? `تتبع ${input.targetMetricAr.trim()}.`
        : 'تتبع مقياس أداء مخصص.'
    ),
    audience: bilingual(
      'Coaches and performance staff in organization settings',
      'المدربون وطاقم الأداء في بيئة المنظمة'
    ),
    evidenceTier,
    unit,
    lowerIsBetter: false,
    requiredInputs: [
      primaryInputField(unit, bilingual(input.targetMetric?.trim() || 'Primary result', 'النتيجة الأساسية')),
    ],
    calculatedOutputs: [
      {
        key: metricKey,
        label: bilingual(input.targetMetric?.trim() || 'Primary result', 'النتيجة الأساسية'),
        unit,
      },
    ],
    calculatedMetricKeys: [metricKey],
    outputUnits: { [metricKey]: unit },
    protocolSummary: bilingual(input.protocol.trim(), protocolAr),
    sourceTypes: ['manual'],
    retestIntervalDays: 28,
    validityNotes: input.researchMetadata?.validityNotes
      ? bilingual(input.researchMetadata.validityNotes, input.researchMetadata.validityNotes)
      : undefined,
    reliabilityNotes: input.researchMetadata?.reliabilityNotes
      ? bilingual(input.researchMetadata.reliabilityNotes, input.researchMetadata.reliabilityNotes)
      : undefined,
    interpretationScope: bilingual(
      'Interpret relative to athlete baseline and organization monitoring goals.',
      'فسّر النتيجة مقارنة بخط الأساس وأهداف مراقبة المنظمة.'
    ),
    tags: ['custom', categoryCode, key, PERFORMANCE_LAB_MOCK_ORG_ID],
    usabilityModes: {
      beginner: ['result', 'unit', 'date'],
      professional: ['result', 'unit', 'date', 'trial_notes', 'protocol_version'],
      research:
        evidenceTier === 'clinical' || evidenceTier === 'research'
          ? ['result', 'unit', 'date', 'trial_notes', 'protocol_version', 'raw_trials', 'environment']
          : undefined,
    },
  });

  definition.tags = [...(definition.tags ?? []), `org:${PERFORMANCE_LAB_MOCK_ORG_ID}`];

  const protocol = buildProtocolVersion(
    definition,
    bilingual(input.protocol.trim(), protocolAr),
    bilingual('As defined by organization', 'حسب تعريف المنظمة')
  );

  return { definition, protocol };
}

export function createCustomAssessmentBundle(
  input: CustomTestInput,
  existingKeys: string[]
): CreateCustomAssessmentResult {
  const validation = validateCustomAssessmentInput(input, existingKeys);
  if (!validation.valid) {
    throw new Error(validation.errorKey ?? 'testingCenter.custom.validationFailed');
  }

  const key = buildUniqueCustomKey(input.name, existingKeys);
  const { definition, protocol } = buildCustomCatalogDefinition(input, key);

  const bundle: CustomAssessmentBundle = {
    definition,
    protocol,
    organizationId: PERFORMANCE_LAB_MOCK_ORG_ID,
    createdAt: new Date().toISOString(),
  };

  registerCustomAssessmentBundle(bundle);

  return {
    key,
    definition,
    protocol,
    bundle,
    scientificStatus: 'scientific',
  };
}

export function hasScientificCustomDefinition(key: string): boolean {
  return getCustomAssessmentBundle(key) !== null;
}

export function resolveCustomScientificStatus(definition: TestDefinition): ScientificCustomStatus {
  if (!definition.isCustom) return 'scientific';
  if (definition.scientificStatus) return definition.scientificStatus;
  return hasScientificCustomDefinition(definition.key) ? 'scientific' : 'legacy_custom';
}

export function canUseScientificCustomPipeline(definition: TestDefinition): boolean {
  if (!definition.isCustom) return true;
  if (definition.scientificStatus === 'legacy_custom') return false;
  return hasScientificCustomDefinition(definition.key);
}

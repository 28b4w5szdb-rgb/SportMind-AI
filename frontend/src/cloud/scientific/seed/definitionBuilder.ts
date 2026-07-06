/**
 * Assessment Definition Engine — seed builder helpers.
 * Catalog First: every assessment passes through the scientific data model.
 */

import type {
  AssessmentProtocolVersion,
  CalculatedOutputDefinition,
  CatalogAssessmentDefinition,
} from '../models/catalog/AssessmentDefinition';
import type {
  BilingualText,
  DataSourceType,
  EvidenceTier,
  SchemaFieldDefinition,
  ScientificCategoryCode,
} from '../models/common';
import { bilingual, seedDocumentMeta, seedVersionMeta } from './seedHelpers';

export interface AssessmentUsabilityModesInput {
  beginner?: string[];
  professional?: string[];
  research?: string[];
}

export interface BuildAssessmentDefinitionInput {
  key: string;
  categoryCode: ScientificCategoryCode;
  subcategory: string;
  name: BilingualText;
  description: BilingualText;
  purpose: BilingualText;
  audience: BilingualText;
  evidenceTier: EvidenceTier;
  unit: string;
  lowerIsBetter?: boolean;
  requiredInputs?: SchemaFieldDefinition[];
  optionalInputs?: SchemaFieldDefinition[];
  calculatedOutputs?: CalculatedOutputDefinition[];
  calculatedMetricKeys?: string[];
  outputUnits?: Record<string, string>;
  protocolSummary: BilingualText;
  equipmentTypeIds?: string[];
  equipmentOptionKeys?: string[];
  sourceTypes?: DataSourceType[];
  formulaKeys?: string[];
  normativeKeys?: string[];
  retestIntervalDays?: number;
  reliabilityNotes?: BilingualText;
  validityNotes?: BilingualText;
  contraindications?: BilingualText;
  commonMistakes?: BilingualText;
  interpretationScope?: BilingualText;
  usabilityModes?: AssessmentUsabilityModesInput;
  aiCompatible?: boolean;
  reportCompatible?: boolean;
  tags?: string[];
  ssidTemplateId?: string | null;
}

const DEFAULT_BEGINNER = ['result', 'unit', 'date'];
const DEFAULT_PROFESSIONAL = [
  'result',
  'unit',
  'date',
  'trial_notes',
  'equipment_id',
  'protocol_version',
];
const DEFAULT_RESEARCH = [
  'result',
  'unit',
  'date',
  'trial_notes',
  'equipment_id',
  'protocol_version',
  'raw_trials',
  'environment',
  'reliability_flag',
];

const DEFAULT_AUDIENCE = bilingual(
  'Sports scientists, strength coaches, and performance staff',
  'علماء الرياضة ومدربي القوة وطاقم الأداء'
);

const DEFAULT_INTERPRETATION = bilingual(
  'Interpret relative to athlete baseline, position norms, and training phase.',
  'فسّر النتيجة مقارنة بخط الأساس ومعايير المركز ومرحلة التدريب.'
);

export function definitionId(key: string): string {
  return `def_${key}`;
}

export function protocolVersionId(key: string, version = 1): string {
  return `proto_${key}_v${version}`;
}

export function primaryInputField(unit: string, label?: BilingualText): SchemaFieldDefinition {
  return {
    key: 'primary_value',
    label: label ?? bilingual('Primary result', 'النتيجة الأساسية'),
    unit,
    type: 'number',
    required: true,
  };
}

export function buildAssessmentDefinition(
  input: BuildAssessmentDefinitionInput
): CatalogAssessmentDefinition {
  const id = definitionId(input.key);
  const protocolId = protocolVersionId(input.key);
  const requiredInputs = input.requiredInputs ?? [primaryInputField(input.unit)];
  const calculatedOutputs =
    input.calculatedOutputs ??
    [
      {
        key: 'primary_value',
        label: bilingual('Primary result', 'النتيجة الأساسية'),
        unit: input.unit,
      },
    ];

  return {
    ...seedDocumentMeta(id),
    ...seedVersionMeta(),
    key: input.key,
    category_code: input.categoryCode,
    subcategory: input.subcategory,
    name: input.name,
    description: input.description,
    purpose: input.purpose,
    audience: input.audience,
    evidence_tier: input.evidenceTier,
    usability_modes: {
      beginner: input.usabilityModes?.beginner ?? DEFAULT_BEGINNER,
      professional: input.usabilityModes?.professional ?? DEFAULT_PROFESSIONAL,
      research: input.usabilityModes?.research ?? DEFAULT_RESEARCH,
    },
    unit: input.unit,
    lower_is_better: input.lowerIsBetter ?? false,
    required_inputs: requiredInputs,
    optional_inputs: input.optionalInputs ?? [],
    raw_measurement_schema: requiredInputs,
    calculated_outputs: calculatedOutputs,
    calculated_metric_keys: input.calculatedMetricKeys ?? ['primary_value'],
    output_units: input.outputUnits ?? { primary_value: input.unit },
    protocol_summary: input.protocolSummary,
    supported_equipment_type_ids: input.equipmentTypeIds ?? [],
    equipment_option_keys: input.equipmentOptionKeys ?? [],
    allowed_source_types: input.sourceTypes ?? ['manual'],
    formula_reference_keys: input.formulaKeys ?? [],
    normative_reference_keys: input.normativeKeys ?? [],
    current_protocol_version_id: protocolId,
    retest_interval_days: input.retestIntervalDays ?? 28,
    reliability_notes:
      input.reliabilityNotes ??
      bilingual('Follow standardized protocol; retest under similar conditions.', 'اتبع بروتوكولاً موحداً؛ أعد الاختبار في ظروف مماثلة.'),
    validity_notes:
      input.validityNotes ??
      bilingual('Valid for field monitoring when protocol is standardized.', 'صالح للمراقبة الميدانية عند توحيد البروتوكول.'),
    contraindications:
      input.contraindications ??
      bilingual('Defer testing during acute injury or illness.', 'أجل الاختبار أثناء الإصابة الحادة أو المرض.'),
    common_mistakes:
      input.commonMistakes ??
      bilingual('Inconsistent warm-up, surface, or equipment invalidates comparison.', 'الإحماء أو السطح أو المعدات غير المتسقة تبطل المقارنة.'),
    interpretation_scope: input.interpretationScope ?? DEFAULT_INTERPRETATION,
    ai_compatible: input.aiCompatible ?? true,
    report_compatible: input.reportCompatible ?? true,
    tags: input.tags ?? [input.categoryCode, input.subcategory],
    ssid_template_id: input.ssidTemplateId ?? null,
    interpretation_rule_set_id: null,
    active: true,
  };
}

export function buildProtocolVersion(
  definition: CatalogAssessmentDefinition,
  protocolText: BilingualText,
  equipmentText: BilingualText
): AssessmentProtocolVersion {
  return {
    ...seedDocumentMeta(definition.current_protocol_version_id),
    ...seedVersionMeta(),
    definition_id: definition.id,
    protocol_text: protocolText,
    equipment_requirements: equipmentText,
    standardization_notes: definition.protocol_summary,
    reliability: {
      retest_interval_days: definition.retest_interval_days,
    },
    validity_citation_ids: [],
  };
}

export interface CompactAssessmentSpec {
  key: string;
  category: ScientificCategoryCode;
  subcategory: string;
  nameEn: string;
  nameAr: string;
  unit: string;
  tier: EvidenceTier;
  lowerIsBetter?: boolean;
  retestDays?: number;
  sources?: DataSourceType[];
  tags?: string[];
  purposeEn?: string;
  purposeAr?: string;
  protocolEn?: string;
  protocolAr?: string;
}

export function buildFromCompactSpec(spec: CompactAssessmentSpec): CatalogAssessmentDefinition {
  const purpose = bilingual(
    spec.purposeEn ?? `Assess ${spec.nameEn.toLowerCase()} for athlete profiling and monitoring.`,
    spec.purposeAr ?? `تقييم ${spec.nameAr} لملف اللاعب والمراقبة.`
  );
  const protocol = bilingual(
    spec.protocolEn ?? `Standardized ${spec.nameEn} protocol per sport science guidelines.`,
    spec.protocolAr ?? `بروتوكول ${spec.nameAr} موحد وفق إرشادات علوم الرياضة.`
  );

  return buildAssessmentDefinition({
    key: spec.key,
    categoryCode: spec.category,
    subcategory: spec.subcategory,
    name: bilingual(spec.nameEn, spec.nameAr),
    description: bilingual(
      `${spec.nameEn} — ${spec.subcategory} assessment.`,
      `${spec.nameAr} — تقييم ${spec.subcategory}.`
    ),
    purpose,
    audience: DEFAULT_AUDIENCE,
    evidenceTier: spec.tier,
    unit: spec.unit,
    lowerIsBetter: spec.lowerIsBetter,
    protocolSummary: protocol,
    retestIntervalDays: spec.retestDays,
    sourceTypes: spec.sources,
    tags: spec.tags ?? [spec.category, spec.subcategory, spec.key],
  });
}

export function buildProtocolFromDefinition(
  definition: CatalogAssessmentDefinition
): AssessmentProtocolVersion {
  return buildProtocolVersion(
    definition,
    definition.protocol_summary,
    bilingual(
      definition.equipment_option_keys.length
        ? definition.equipment_option_keys.join(', ')
        : 'Standard field equipment as per protocol',
      definition.equipment_option_keys.length
        ? definition.equipment_option_keys.join('، ')
        : 'معدات ميدانية قياسية حسب البروتوكول'
    )
  );
}

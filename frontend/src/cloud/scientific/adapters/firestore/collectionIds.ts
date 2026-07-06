import { CATALOG_COLLECTIONS } from '../../paths/catalogPaths';

/** Maps logical catalog paths to Firestore collection IDs (no slashes). */
export const FIRESTORE_CATALOG_COLLECTION_IDS = {
  sports: 'catalog_sports',
  assessmentCategories: 'catalog_assessment_categories',
  assessmentDefinitions: 'catalog_assessment_definitions',
  evidenceTiers: 'catalog_evidence_tiers',
  formulas: 'catalog_formulas',
  equipmentTypes: 'catalog_equipment_types',
  equipmentModels: 'catalog_equipment_models',
  normativeReferences: 'catalog_normative_references',
  questionnaireTemplates: 'catalog_questionnaire_templates',
} as const;

export function formulaVersionsCollectionId(formulaId: string): string {
  return `${FIRESTORE_CATALOG_COLLECTION_IDS.formulas}_${formulaId}_versions`;
}

export function protocolVersionsCollectionId(definitionId: string): string {
  return `${FIRESTORE_CATALOG_COLLECTION_IDS.assessmentDefinitions}_${definitionId}_protocol_versions`;
}

/** Validates logical path keys remain aligned with catalog path constants. */
export const CATALOG_PATH_ALIGNMENT = {
  sports: CATALOG_COLLECTIONS.sports,
  assessmentCategories: CATALOG_COLLECTIONS.assessmentCategories,
} as const;

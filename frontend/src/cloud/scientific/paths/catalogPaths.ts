/**
 * Global catalog collection paths — read-mostly, admin-managed.
 * Prepared for future Firestore Security Rules (no public writes).
 */

export const CATALOG_ROOT = 'catalog' as const;

export const CATALOG_COLLECTIONS = {
  sports: `${CATALOG_ROOT}/sports`,
  assessmentCategories: `${CATALOG_ROOT}/assessment_categories`,
  assessmentDefinitions: `${CATALOG_ROOT}/assessment_definitions`,
  evidenceTiers: `${CATALOG_ROOT}/evidence_tiers`,
  formulas: `${CATALOG_ROOT}/formulas`,
  equipmentTypes: `${CATALOG_ROOT}/equipment_types`,
  equipmentModels: `${CATALOG_ROOT}/equipment_models`,
  normativeReferences: `${CATALOG_ROOT}/normative_references`,
  questionnaireTemplates: `${CATALOG_ROOT}/questionnaire_templates`,
} as const;

export type CatalogCollectionKey = keyof typeof CATALOG_COLLECTIONS;

export function catalogSportPath(sportId: string): string {
  return `${CATALOG_COLLECTIONS.sports}/${sportId}`;
}

export function catalogAssessmentCategoryPath(categoryId: string): string {
  return `${CATALOG_COLLECTIONS.assessmentCategories}/${categoryId}`;
}

export function catalogAssessmentDefinitionPath(definitionId: string): string {
  return `${CATALOG_COLLECTIONS.assessmentDefinitions}/${definitionId}`;
}

export function catalogAssessmentProtocolVersionPath(
  definitionId: string,
  protocolVersionId: string
): string {
  return `${catalogAssessmentDefinitionPath(definitionId)}/protocol_versions/${protocolVersionId}`;
}

export function catalogEvidenceTierPath(tierId: string): string {
  return `${CATALOG_COLLECTIONS.evidenceTiers}/${tierId}`;
}

export function catalogFormulaPath(formulaId: string): string {
  return `${CATALOG_COLLECTIONS.formulas}/${formulaId}`;
}

export function catalogFormulaVersionPath(formulaId: string, versionId: string): string {
  return `${catalogFormulaPath(formulaId)}/versions/${versionId}`;
}

export function catalogEquipmentTypePath(typeId: string): string {
  return `${CATALOG_COLLECTIONS.equipmentTypes}/${typeId}`;
}

export function catalogEquipmentModelPath(modelId: string): string {
  return `${CATALOG_COLLECTIONS.equipmentModels}/${modelId}`;
}

export function catalogNormativeReferencePath(referenceId: string): string {
  return `${CATALOG_COLLECTIONS.normativeReferences}/${referenceId}`;
}

export function catalogNormativeReferenceVersionPath(
  referenceId: string,
  versionId: string
): string {
  return `${catalogNormativeReferencePath(referenceId)}/versions/${versionId}`;
}

export function catalogQuestionnaireTemplatePath(templateId: string): string {
  return `${CATALOG_COLLECTIONS.questionnaireTemplates}/${templateId}`;
}

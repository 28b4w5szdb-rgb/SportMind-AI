/**
 * Global catalog repository contracts — read-only for clients.
 * Implementations deferred to future phases.
 */

import type { EvidenceTier, ScientificCategoryCode } from '../../models/common';
import type {
  CatalogAssessmentCategory,
  CatalogAssessmentDefinition,
  CatalogEquipmentModel,
  CatalogEquipmentType,
  CatalogEvidenceTier,
  CatalogFormula,
  CatalogFormulaVersion,
  CatalogNormativeReference,
  CatalogNormativeReferenceVersion,
  CatalogQuestionnaireTemplate,
  CatalogSport,
  AssessmentProtocolVersion,
  NormativeReferenceProfile,
} from '../../models/catalog';

export interface CatalogSportRepository {
  getById(sportId: string): Promise<CatalogSport | null>;
  getByKey(key: string): Promise<CatalogSport | null>;
  listActive(): Promise<CatalogSport[]>;
}

export interface CatalogAssessmentCategoryRepository {
  getById(categoryId: string): Promise<CatalogAssessmentCategory | null>;
  getByCode(code: ScientificCategoryCode): Promise<CatalogAssessmentCategory | null>;
  listActive(): Promise<CatalogAssessmentCategory[]>;
}

export interface AssessmentDefinitionSearchOptions {
  query?: string;
  categoryCode?: ScientificCategoryCode;
  evidenceTier?: EvidenceTier;
  tags?: string[];
  limit?: number;
}

export interface CatalogAssessmentDefinitionRepository {
  getById(definitionId: string): Promise<CatalogAssessmentDefinition | null>;
  getByKey(key: string): Promise<CatalogAssessmentDefinition | null>;
  listByCategory(categoryCode: ScientificCategoryCode): Promise<CatalogAssessmentDefinition[]>;
  listActive(): Promise<CatalogAssessmentDefinition[]>;
  listAssessmentDefinitions(): Promise<CatalogAssessmentDefinition[]>;
  getAssessmentDefinitionByKey(key: string): Promise<CatalogAssessmentDefinition | null>;
  listAssessmentDefinitionsByCategory(
    categoryCode: ScientificCategoryCode
  ): Promise<CatalogAssessmentDefinition[]>;
  listAssessmentDefinitionsByEvidenceTier(
    tier: EvidenceTier
  ): Promise<CatalogAssessmentDefinition[]>;
  searchAssessmentDefinitions(
    options?: AssessmentDefinitionSearchOptions
  ): Promise<CatalogAssessmentDefinition[]>;
  getProtocolVersion(
    definitionId: string,
    protocolVersionId: string
  ): Promise<AssessmentProtocolVersion | null>;
  listProtocolVersions(definitionId: string): Promise<AssessmentProtocolVersion[]>;
}

export interface CatalogEvidenceTierRepository {
  getByTier(tier: CatalogEvidenceTier['tier']): Promise<CatalogEvidenceTier | null>;
  listAll(): Promise<CatalogEvidenceTier[]>;
}

export interface CatalogFormulaRepository {
  getById(formulaId: string): Promise<CatalogFormula | null>;
  getByKey(key: string): Promise<CatalogFormula | null>;
  getVersion(formulaId: string, versionId: string): Promise<CatalogFormulaVersion | null>;
  listVersions(formulaId: string): Promise<CatalogFormulaVersion[]>;
}

export interface CatalogEquipmentCatalogRepository {
  getTypeById(typeId: string): Promise<CatalogEquipmentType | null>;
  getModelById(modelId: string): Promise<CatalogEquipmentModel | null>;
  listActiveTypes(): Promise<CatalogEquipmentType[]>;
  listModelsByType(typeId: string): Promise<CatalogEquipmentModel[]>;
}

export interface CatalogNormativeReferenceRepository {
  getById(referenceId: string): Promise<CatalogNormativeReference | null>;
  getByKey(key: string): Promise<CatalogNormativeReference | null>;
  getNormativeReferenceByKey(key: string): Promise<CatalogNormativeReference | null>;
  listNormativeReferences(): Promise<CatalogNormativeReference[]>;
  listReferencesForAssessment(
    assessmentDefinitionKey: string
  ): Promise<CatalogNormativeReference[]>;
  listNormativeProfiles(): Promise<NormativeReferenceProfile[]>;
  getVersion(referenceId: string, versionId: string): Promise<CatalogNormativeReferenceVersion | null>;
  listVersions(referenceId: string): Promise<CatalogNormativeReferenceVersion[]>;
}

export interface CatalogQuestionnaireTemplateRepository {
  getById(templateId: string): Promise<CatalogQuestionnaireTemplate | null>;
  getByKey(key: string): Promise<CatalogQuestionnaireTemplate | null>;
  listActive(): Promise<CatalogQuestionnaireTemplate[]>;
}

/** Aggregated catalog access — dependency-injection friendly. */
export interface ScientificCatalogRepository {
  sports: CatalogSportRepository;
  assessmentCategories: CatalogAssessmentCategoryRepository;
  assessmentDefinitions: CatalogAssessmentDefinitionRepository;
  evidenceTiers: CatalogEvidenceTierRepository;
  formulas: CatalogFormulaRepository;
  equipment: CatalogEquipmentCatalogRepository;
  normativeReferences: CatalogNormativeReferenceRepository;
  questionnaireTemplates: CatalogQuestionnaireTemplateRepository;
}

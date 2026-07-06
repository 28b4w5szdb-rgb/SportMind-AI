/**
 * In-memory index over static catalog seed documents.
 */

import type { CatalogAssessmentCategory } from '../models/catalog/AssessmentCategory';
import type {
  AssessmentProtocolVersion,
  CatalogAssessmentDefinition,
} from '../models/catalog/AssessmentDefinition';
import type { CatalogEquipmentModel, CatalogEquipmentType } from '../models/catalog/EquipmentCatalog';
import type { CatalogEvidenceTier } from '../models/catalog/EvidenceTier';
import type { CatalogFormula, CatalogFormulaVersion } from '../models/catalog/FormulaRegistry';
import type { CatalogQuestionnaireTemplate } from '../models/catalog/QuestionnaireTemplate';
import type { CatalogSport } from '../models/catalog/Sport';
import type { EvidenceTier, ScientificCategoryCode } from '../models/common';

import { SEED_ASSESSMENT_CATEGORIES } from './assessmentCategories.seed';
import {
  SEED_ASSESSMENT_DEFINITIONS,
  SEED_ASSESSMENT_PROTOCOL_VERSIONS,
} from './assessmentDefinitions.seed';
import { SEED_EQUIPMENT_TYPES } from './equipmentTypes.seed';
import { SEED_EVIDENCE_TIERS } from './evidenceTiers.seed';
import { SEED_FORMULAS, SEED_FORMULA_VERSIONS } from './formulas.seed';
import { SEED_QUESTIONNAIRE_TEMPLATES } from './questionnaireTemplates.seed';
import { SEED_SPORTS } from './sports.seed';

function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

function indexByKey<T extends { key: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.key, item]));
}

export class CatalogSeedIndex {
  readonly sports = SEED_SPORTS;
  readonly assessmentCategories = SEED_ASSESSMENT_CATEGORIES;
  readonly assessmentDefinitions = SEED_ASSESSMENT_DEFINITIONS;
  readonly assessmentProtocolVersions = SEED_ASSESSMENT_PROTOCOL_VERSIONS;
  readonly evidenceTiers = SEED_EVIDENCE_TIERS;
  readonly equipmentTypes = SEED_EQUIPMENT_TYPES;
  readonly equipmentModels: CatalogEquipmentModel[] = [];
  readonly formulas = SEED_FORMULAS;
  readonly formulaVersions = SEED_FORMULA_VERSIONS;
  readonly questionnaireTemplates = SEED_QUESTIONNAIRE_TEMPLATES;

  private sportsById = indexById(SEED_SPORTS);
  private sportsByKey = indexByKey(SEED_SPORTS);
  private categoriesById = indexById(SEED_ASSESSMENT_CATEGORIES);
  private categoriesByCode = new Map(
    SEED_ASSESSMENT_CATEGORIES.map((c) => [c.code, c] as const)
  );
  private definitionsById = indexById(SEED_ASSESSMENT_DEFINITIONS);
  private definitionsByKey = indexByKey(SEED_ASSESSMENT_DEFINITIONS);
  private protocolVersionsById = indexById(SEED_ASSESSMENT_PROTOCOL_VERSIONS);
  private tiersByTier = new Map(
    SEED_EVIDENCE_TIERS.map((t) => [t.tier, t] as const)
  );
  private equipmentTypesById = indexById(SEED_EQUIPMENT_TYPES);
  private formulasById = indexById(SEED_FORMULAS);
  private formulasByKey = indexByKey(SEED_FORMULAS);
  private formulaVersionsById = indexById(SEED_FORMULA_VERSIONS);
  private questionnairesById = indexById(SEED_QUESTIONNAIRE_TEMPLATES);
  private questionnairesByKey = indexByKey(SEED_QUESTIONNAIRE_TEMPLATES);

  getSportById(id: string): CatalogSport | null {
    return this.sportsById.get(id) ?? null;
  }

  getSportByKey(key: string): CatalogSport | null {
    return this.sportsByKey.get(key) ?? null;
  }

  listActiveSports(): CatalogSport[] {
    return this.sports.filter((s) => s.active);
  }

  getCategoryById(id: string): CatalogAssessmentCategory | null {
    return this.categoriesById.get(id) ?? null;
  }

  getCategoryByCode(code: ScientificCategoryCode): CatalogAssessmentCategory | null {
    return this.categoriesByCode.get(code) ?? null;
  }

  listActiveCategories(): CatalogAssessmentCategory[] {
    return this.assessmentCategories.filter((c) => c.active);
  }

  getDefinitionById(id: string): CatalogAssessmentDefinition | null {
    return this.definitionsById.get(id) ?? null;
  }

  getDefinitionByKey(key: string): CatalogAssessmentDefinition | null {
    return this.definitionsByKey.get(key) ?? null;
  }

  listActiveDefinitions(): CatalogAssessmentDefinition[] {
    return this.assessmentDefinitions.filter((d) => d.active);
  }

  listDefinitionsByCategory(categoryCode: ScientificCategoryCode): CatalogAssessmentDefinition[] {
    return this.listActiveDefinitions().filter((d) => d.category_code === categoryCode);
  }

  listDefinitionsByEvidenceTier(tier: EvidenceTier): CatalogAssessmentDefinition[] {
    return this.listActiveDefinitions().filter((d) => d.evidence_tier === tier);
  }

  getProtocolVersion(
    definitionId: string,
    protocolVersionId: string
  ): AssessmentProtocolVersion | null {
    const version = this.protocolVersionsById.get(protocolVersionId);
    if (!version || version.definition_id !== definitionId) return null;
    return version;
  }

  listProtocolVersions(definitionId: string): AssessmentProtocolVersion[] {
    return this.assessmentProtocolVersions.filter((v) => v.definition_id === definitionId);
  }

  getEvidenceTier(tier: EvidenceTier): CatalogEvidenceTier | null {
    return this.tiersByTier.get(tier) ?? null;
  }

  listEvidenceTiers(): CatalogEvidenceTier[] {
    return this.evidenceTiers;
  }

  getEquipmentTypeById(id: string): CatalogEquipmentType | null {
    return this.equipmentTypesById.get(id) ?? null;
  }

  listActiveEquipmentTypes(): CatalogEquipmentType[] {
    return this.equipmentTypes.filter((t) => t.active);
  }

  listEquipmentModelsByType(typeId: string): CatalogEquipmentModel[] {
    return this.equipmentModels.filter((m) => m.type_id === typeId && m.active);
  }

  getEquipmentModelById(id: string): CatalogEquipmentModel | null {
    return this.equipmentModels.find((m) => m.id === id) ?? null;
  }

  getFormulaById(id: string): CatalogFormula | null {
    return this.formulasById.get(id) ?? null;
  }

  getFormulaByKey(key: string): CatalogFormula | null {
    return this.formulasByKey.get(key) ?? null;
  }

  getFormulaVersion(formulaId: string, versionId: string): CatalogFormulaVersion | null {
    const version = this.formulaVersionsById.get(versionId);
    if (!version || version.formula_id !== formulaId) return null;
    return version;
  }

  listFormulaVersions(formulaId: string): CatalogFormulaVersion[] {
    return this.formulaVersions.filter((v) => v.formula_id === formulaId);
  }

  getQuestionnaireById(id: string): CatalogQuestionnaireTemplate | null {
    return this.questionnairesById.get(id) ?? null;
  }

  getQuestionnaireByKey(key: string): CatalogQuestionnaireTemplate | null {
    return this.questionnairesByKey.get(key) ?? null;
  }

  listActiveQuestionnaires(): CatalogQuestionnaireTemplate[] {
    return this.questionnaireTemplates.filter((q) => q.active);
  }
}

let cachedIndex: CatalogSeedIndex | undefined;

export function getCatalogSeedIndex(): CatalogSeedIndex {
  if (!cachedIndex) cachedIndex = new CatalogSeedIndex();
  return cachedIndex;
}

export function resetCatalogSeedIndex(): void {
  cachedIndex = undefined;
}

/**
 * In-memory catalog repository — default when cloud mode is off.
 */

import type { ScientificCategoryCode } from '../../models/common';
import type {
  AssessmentProtocolVersion,
  CatalogAssessmentCategory,
  CatalogAssessmentDefinition,
  CatalogEquipmentModel,
  CatalogEquipmentType,
  CatalogEvidenceTier,
  CatalogFormula,
  CatalogFormulaVersion,
  CatalogNormativeReferenceVersion,
  CatalogQuestionnaireTemplate,
  CatalogSport,
} from '../../models/catalog';
import type {
  CatalogAssessmentCategoryRepository,
  CatalogAssessmentDefinitionRepository,
  CatalogEquipmentCatalogRepository,
  CatalogEvidenceTierRepository,
  CatalogFormulaRepository,
  CatalogNormativeReferenceRepository,
  CatalogQuestionnaireTemplateRepository,
  CatalogSportRepository,
  ScientificCatalogRepository,
} from '../../repositories/contracts/CatalogRepository';
import { getCatalogMemoryCache } from '../../cache/memoryCache';
import { getCatalogSeedIndex } from '../../seed/catalogSeedIndex';
import { createSeedDefinitionRepository } from '../shared/definitionRepositoryHelpers';
import { createSeedNormativeRepository } from '../shared/normativeRepositoryHelpers';

function cacheKey(scope: string, id: string): string {
  return `mock:catalog:${scope}:${id}`;
}

function fromCache<T>(scope: string, id: string, loader: () => T): T {
  const cache = getCatalogMemoryCache();
  const key = cacheKey(scope, id);
  const hit = cache.get<T>(key);
  if (hit !== undefined) return hit;
  const value = loader();
  cache.set(key, value);
  return value;
}

function createSportRepository(seed = getCatalogSeedIndex()): CatalogSportRepository {
  return {
    async getById(sportId) {
      return fromCache('sport:id', sportId, () => seed.getSportById(sportId));
    },
    async getByKey(key) {
      return fromCache('sport:key', key, () => seed.getSportByKey(key));
    },
    async listActive() {
      return fromCache('sport:list', 'active', () => seed.listActiveSports());
    },
  };
}

function createCategoryRepository(seed = getCatalogSeedIndex()): CatalogAssessmentCategoryRepository {
  return {
    async getById(categoryId) {
      return fromCache('category:id', categoryId, () => seed.getCategoryById(categoryId));
    },
    async getByCode(code: ScientificCategoryCode) {
      return fromCache('category:code', code, () => seed.getCategoryByCode(code));
    },
    async listActive() {
      return fromCache('category:list', 'active', () => seed.listActiveCategories());
    },
  };
}

function createDefinitionRepository(seed = getCatalogSeedIndex()): CatalogAssessmentDefinitionRepository {
  return createSeedDefinitionRepository(seed);
}

function createEvidenceTierRepository(seed = getCatalogSeedIndex()): CatalogEvidenceTierRepository {
  return {
    async getByTier(tier) {
      return fromCache('tier', tier, () => seed.getEvidenceTier(tier));
    },
    async listAll() {
      return fromCache('tier:list', 'all', () => seed.listEvidenceTiers());
    },
  };
}

function createFormulaRepository(seed = getCatalogSeedIndex()): CatalogFormulaRepository {
  return {
    async getById(formulaId) {
      return fromCache('formula:id', formulaId, () => seed.getFormulaById(formulaId));
    },
    async getByKey(key) {
      return fromCache('formula:key', key, () => seed.getFormulaByKey(key));
    },
    async getVersion(formulaId, versionId) {
      return fromCache(`formula:${formulaId}:version`, versionId, () =>
        seed.getFormulaVersion(formulaId, versionId)
      );
    },
    async listVersions(formulaId) {
      return fromCache('formula:versions', formulaId, () => seed.listFormulaVersions(formulaId));
    },
  };
}

function createEquipmentRepository(seed = getCatalogSeedIndex()): CatalogEquipmentCatalogRepository {
  return {
    async getTypeById(typeId) {
      return fromCache('equipment-type:id', typeId, () => seed.getEquipmentTypeById(typeId));
    },
    async getModelById(modelId) {
      return fromCache('equipment-model:id', modelId, () => seed.getEquipmentModelById(modelId));
    },
    async listActiveTypes() {
      return fromCache('equipment-type:list', 'active', () => seed.listActiveEquipmentTypes());
    },
    async listModelsByType(typeId) {
      return fromCache('equipment-model:list', typeId, () => seed.listEquipmentModelsByType(typeId));
    },
  };
}

function createNormativeRepository(seed = getCatalogSeedIndex()): CatalogNormativeReferenceRepository {
  return createSeedNormativeRepository(seed);
}

function createQuestionnaireRepository(
  seed = getCatalogSeedIndex()
): CatalogQuestionnaireTemplateRepository {
  return {
    async getById(templateId) {
      return fromCache('questionnaire:id', templateId, () => seed.getQuestionnaireById(templateId));
    },
    async getByKey(key) {
      return fromCache('questionnaire:key', key, () => seed.getQuestionnaireByKey(key));
    },
    async listActive() {
      return fromCache('questionnaire:list', 'active', () => seed.listActiveQuestionnaires());
    },
  };
}

export function createCatalogMockRepository(): ScientificCatalogRepository {
  const seed = getCatalogSeedIndex();

  return {
    sports: createSportRepository(seed),
    assessmentCategories: createCategoryRepository(seed),
    assessmentDefinitions: createDefinitionRepository(),
    evidenceTiers: createEvidenceTierRepository(seed),
    formulas: createFormulaRepository(seed),
    equipment: createEquipmentRepository(seed),
    normativeReferences: createNormativeRepository(seed),
    questionnaireTemplates: createQuestionnaireRepository(seed),
  };
}

/**
 * Firestore catalog repository — read-only with seed fallback and memory cache.
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
  CatalogNormativeReference,
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
import {
  FIRESTORE_CATALOG_COLLECTION_IDS,
} from './collectionIds';
import { readCollection, readDocument, readSubcollection } from './firestoreReadHelper';

function cacheKey(scope: string, id: string): string {
  return `firestore:catalog:${scope}:${id}`;
}

async function cached<T>(scope: string, id: string, loader: () => Promise<T>): Promise<T> {
  const cache = getCatalogMemoryCache();
  const key = cacheKey(scope, id);
  const hit = cache.get<T>(key);
  if (hit !== undefined) return hit;
  const value = await loader();
  cache.set(key, value);
  return value;
}

async function loadActive<T extends { active?: boolean }>(
  collectionId: string,
  seedLoader: () => T[]
): Promise<T[]> {
  const remote = await readCollection<T>(collectionId, [
    { field: 'active', op: '==', value: true },
  ]);
  if (remote.length > 0) return remote;
  return seedLoader();
}

function createSportRepository(seed = getCatalogSeedIndex()): CatalogSportRepository {
  const collectionId = FIRESTORE_CATALOG_COLLECTION_IDS.sports;

  return {
    async getById(sportId) {
      return cached('sport:id', sportId, async () => {
        const remote = await readDocument<CatalogSport>(collectionId, sportId);
        return remote ?? seed.getSportById(sportId);
      });
    },
    async getByKey(key) {
      return cached('sport:key', key, async () => {
        const remote = await readCollection<CatalogSport>(collectionId, [
          { field: 'key', op: '==', value: key },
        ]);
        return remote[0] ?? seed.getSportByKey(key);
      });
    },
    async listActive() {
      return cached('sport:list', 'active', () =>
        loadActive(collectionId, () => seed.listActiveSports())
      );
    },
  };
}

function createCategoryRepository(seed = getCatalogSeedIndex()): CatalogAssessmentCategoryRepository {
  const collectionId = FIRESTORE_CATALOG_COLLECTION_IDS.assessmentCategories;

  return {
    async getById(categoryId) {
      return cached('category:id', categoryId, async () => {
        const remote = await readDocument<CatalogAssessmentCategory>(collectionId, categoryId);
        return remote ?? seed.getCategoryById(categoryId);
      });
    },
    async getByCode(code: ScientificCategoryCode) {
      return cached('category:code', code, async () => {
        const remote = await readCollection<CatalogAssessmentCategory>(collectionId, [
          { field: 'code', op: '==', value: code },
        ]);
        return remote[0] ?? seed.getCategoryByCode(code);
      });
    },
    async listActive() {
      return cached('category:list', 'active', () =>
        loadActive(collectionId, () => seed.listActiveCategories())
      );
    },
  };
}

function createDefinitionRepository(): CatalogAssessmentDefinitionRepository {
  const collectionId = FIRESTORE_CATALOG_COLLECTION_IDS.assessmentDefinitions;

  return {
    async getById(definitionId) {
      return cached('definition:id', definitionId, async () => {
        return readDocument<CatalogAssessmentDefinition>(collectionId, definitionId);
      });
    },
    async getByKey(key) {
      return cached('definition:key', key, async () => {
        const remote = await readCollection<CatalogAssessmentDefinition>(collectionId, [
          { field: 'key', op: '==', value: key },
        ]);
        return remote[0] ?? null;
      });
    },
    async listByCategory(categoryCode: ScientificCategoryCode) {
      return cached('definition:category', categoryCode, async () => {
        return readCollection<CatalogAssessmentDefinition>(collectionId, [
          { field: 'category_code', op: '==', value: categoryCode },
          { field: 'active', op: '==', value: true },
        ]);
      });
    },
    async listActive() {
      return cached('definition:list', 'active', () =>
        loadActive(collectionId, () => [])
      );
    },
    async getProtocolVersion(definitionId, protocolVersionId) {
      return cached(`definition:${definitionId}:protocol`, protocolVersionId, async () => {
        const versions = await readSubcollection<AssessmentProtocolVersion>(
          collectionId,
          definitionId,
          'protocol_versions'
        );
        return versions.find((v) => v.id === protocolVersionId) ?? null;
      });
    },
    async listProtocolVersions(definitionId) {
      return cached('definition:protocols', definitionId, async () => {
        return readSubcollection<AssessmentProtocolVersion>(
          collectionId,
          definitionId,
          'protocol_versions'
        );
      });
    },
  };
}

function createEvidenceTierRepository(seed = getCatalogSeedIndex()): CatalogEvidenceTierRepository {
  const collectionId = FIRESTORE_CATALOG_COLLECTION_IDS.evidenceTiers;

  return {
    async getByTier(tier) {
      return cached('tier', tier, async () => {
        const remote = await readCollection<CatalogEvidenceTier>(collectionId, [
          { field: 'tier', op: '==', value: tier },
        ]);
        return remote[0] ?? seed.getEvidenceTier(tier);
      });
    },
    async listAll() {
      return cached('tier:list', 'all', async () => {
        const remote = await readCollection<CatalogEvidenceTier>(collectionId);
        return remote.length > 0 ? remote : seed.listEvidenceTiers();
      });
    },
  };
}

function createFormulaRepository(seed = getCatalogSeedIndex()): CatalogFormulaRepository {
  const collectionId = FIRESTORE_CATALOG_COLLECTION_IDS.formulas;

  return {
    async getById(formulaId) {
      return cached('formula:id', formulaId, async () => {
        const remote = await readDocument<CatalogFormula>(collectionId, formulaId);
        return remote ?? seed.getFormulaById(formulaId);
      });
    },
    async getByKey(key) {
      return cached('formula:key', key, async () => {
        const remote = await readCollection<CatalogFormula>(collectionId, [
          { field: 'key', op: '==', value: key },
        ]);
        return remote[0] ?? seed.getFormulaByKey(key);
      });
    },
    async getVersion(formulaId, versionId) {
      return cached(`formula:${formulaId}:version`, versionId, async () => {
        const versions = await readSubcollection<CatalogFormulaVersion>(
          collectionId,
          formulaId,
          'versions'
        );
        const match = versions.find((v) => v.id === versionId);
        return match ?? seed.getFormulaVersion(formulaId, versionId);
      });
    },
    async listVersions(formulaId) {
      return cached('formula:versions', formulaId, async () => {
        const remote = await readSubcollection<CatalogFormulaVersion>(
          collectionId,
          formulaId,
          'versions'
        );
        return remote.length > 0 ? remote : seed.listFormulaVersions(formulaId);
      });
    },
  };
}

function createEquipmentRepository(seed = getCatalogSeedIndex()): CatalogEquipmentCatalogRepository {
  const typesCollectionId = FIRESTORE_CATALOG_COLLECTION_IDS.equipmentTypes;
  const modelsCollectionId = FIRESTORE_CATALOG_COLLECTION_IDS.equipmentModels;

  return {
    async getTypeById(typeId) {
      return cached('equipment-type:id', typeId, async () => {
        const remote = await readDocument<CatalogEquipmentType>(typesCollectionId, typeId);
        return remote ?? seed.getEquipmentTypeById(typeId);
      });
    },
    async getModelById(modelId) {
      return cached('equipment-model:id', modelId, async () => {
        return readDocument<CatalogEquipmentModel>(modelsCollectionId, modelId);
      });
    },
    async listActiveTypes() {
      return cached('equipment-type:list', 'active', () =>
        loadActive(typesCollectionId, () => seed.listActiveEquipmentTypes())
      );
    },
    async listModelsByType(typeId) {
      return cached('equipment-model:list', typeId, async () => {
        const remote = await readCollection<CatalogEquipmentModel>(modelsCollectionId, [
          { field: 'type_id', op: '==', value: typeId },
          { field: 'active', op: '==', value: true },
        ]);
        return remote.length > 0 ? remote : seed.listEquipmentModelsByType(typeId);
      });
    },
  };
}

function createNormativeRepository(): CatalogNormativeReferenceRepository {
  const collectionId = FIRESTORE_CATALOG_COLLECTION_IDS.normativeReferences;

  return {
    async getById(referenceId) {
      return cached('normative:id', referenceId, async () => {
        return readDocument<CatalogNormativeReference>(collectionId, referenceId);
      });
    },
    async getByKey(key) {
      return cached('normative:key', key, async () => {
        const remote = await readCollection<CatalogNormativeReference>(collectionId, [
          { field: 'key', op: '==', value: key },
        ]);
        return remote[0] ?? null;
      });
    },
    async getVersion(referenceId, versionId) {
      return cached(`normative:${referenceId}:version`, versionId, async () => {
        const versions = await readSubcollection<CatalogNormativeReferenceVersion>(
          collectionId,
          referenceId,
          'versions'
        );
        return versions.find((v) => v.id === versionId) ?? null;
      });
    },
    async listVersions(referenceId) {
      return cached('normative:versions', referenceId, async () => {
        return readSubcollection<CatalogNormativeReferenceVersion>(
          collectionId,
          referenceId,
          'versions'
        );
      });
    },
  };
}

function createQuestionnaireRepository(
  seed = getCatalogSeedIndex()
): CatalogQuestionnaireTemplateRepository {
  const collectionId = FIRESTORE_CATALOG_COLLECTION_IDS.questionnaireTemplates;

  return {
    async getById(templateId) {
      return cached('questionnaire:id', templateId, async () => {
        const remote = await readDocument<CatalogQuestionnaireTemplate>(collectionId, templateId);
        return remote ?? seed.getQuestionnaireById(templateId);
      });
    },
    async getByKey(key) {
      return cached('questionnaire:key', key, async () => {
        const remote = await readCollection<CatalogQuestionnaireTemplate>(collectionId, [
          { field: 'key', op: '==', value: key },
        ]);
        return remote[0] ?? seed.getQuestionnaireByKey(key);
      });
    },
    async listActive() {
      return cached('questionnaire:list', 'active', () =>
        loadActive(collectionId, () => seed.listActiveQuestionnaires())
      );
    },
  };
}

export function createCatalogFirestoreRepository(): ScientificCatalogRepository {
  const seed = getCatalogSeedIndex();

  return {
    sports: createSportRepository(seed),
    assessmentCategories: createCategoryRepository(seed),
    assessmentDefinitions: createDefinitionRepository(),
    evidenceTiers: createEvidenceTierRepository(seed),
    formulas: createFormulaRepository(seed),
    equipment: createEquipmentRepository(seed),
    normativeReferences: createNormativeRepository(),
    questionnaireTemplates: createQuestionnaireRepository(seed),
  };
}

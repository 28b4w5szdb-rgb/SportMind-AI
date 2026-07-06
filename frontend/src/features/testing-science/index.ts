export {
  AGE_BANDS,
  GENDER_FACTORS,
  SPORT_PROFILES,
  COMPETITION_LEVELS,
  DEFAULT_DEMOGRAPHIC_CONTEXT,
  adjustReferenceValues,
  buildStoredReferenceProfile,
  resolveAgeBand,
} from './referenceTables';
export type {
  ReferenceContext,
  GenderProfile,
  SportProfile,
  CompetitionLevel,
  AgeBand,
  AgeBandId,
  TestDemographicContext,
  StoredReferenceProfile,
} from './referenceTables';
export { CATEGORY_DEFAULTS, getCategoryDefaults } from './categoryDefaults';

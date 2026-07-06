/**
 * Normative Reference Engine — Raw / Derived / Interpretation separation.
 *
 * Missing reference behavior:
 * - classification: unknown
 * - reason: no_reference_available
 * - recommendation: use raw value + longitudinal trend
 */

import type { NormativePerformanceBandLabel } from '../models/catalog/NormativeReference';
import type { NormativeReferenceProfile } from '../models/catalog/NormativeReference';
import type { ScientificCatalogRepository } from '../repositories/contracts/CatalogRepository';
import { resolveNormativeProfile } from '../seed/normativeReferenceBuilder';
import { getCatalogSeedIndex } from '../seed/catalogSeedIndex';

export interface NormativeLookupParams {
  assessmentDefinitionKey: string;
  metricKey?: string;
  sport?: string | null;
  age?: number | null;
  sex?: 'male' | 'female' | 'mixed' | 'other' | null;
  position?: string | null;
  competitionLevel?: string | null;
}

export interface NormativeValueParams extends NormativeLookupParams {
  value: number;
}

export interface NormativeClassificationResult {
  classification: NormativePerformanceBandLabel | 'unknown';
  band?: NormativePerformanceBandLabel;
  profileKey?: string;
  profileId?: string;
  zScore?: number | null;
  reason?: string;
  recommendation?: string;
  sourceQuality?: NormativeReferenceProfile['source_quality'];
  evidenceTier?: NormativeReferenceProfile['evidence_tier'];
}

export interface NormativeZScoreResult {
  zScore: number | null;
  reason?: string;
  profileKey?: string;
}

const MISSING_RECOMMENDATION =
  'Use raw value and longitudinal trend until a published reference is available.';

const BAND_ORDER_HIGH: NormativePerformanceBandLabel[] = [
  'elite',
  'excellent',
  'good',
  'average',
  'below_average',
  'poor',
];

const BAND_ORDER_LOW: NormativePerformanceBandLabel[] = [...BAND_ORDER_HIGH].reverse();

function unknownResult(reason = 'no_reference_available'): NormativeClassificationResult {
  return {
    classification: 'unknown',
    reason,
    recommendation: MISSING_RECOMMENDATION,
  };
}

function populationScore(
  profile: NormativeReferenceProfile,
  params: NormativeLookupParams
): number {
  let score = 0;
  const pop = profile.population;

  if (params.sport && pop.sport) {
    score += pop.sport === params.sport ? 4 : -2;
  } else if (!pop.sport) {
    score += 1;
  }

  if (params.sex && pop.sex && pop.sex !== 'mixed') {
    score += pop.sex === params.sex ? 3 : -1;
  } else if (pop.sex === 'mixed' || !pop.sex) {
    score += 1;
  }

  if (params.age != null && pop.age_min != null && pop.age_max != null) {
    score += params.age >= pop.age_min && params.age <= pop.age_max ? 2 : -1;
  }

  if (params.position && pop.position) {
    score += pop.position === params.position ? 2 : 0;
  }

  if (params.competitionLevel && pop.competition_level) {
    score += pop.competition_level === params.competitionLevel ? 1 : 0;
  }

  if (profile.source_quality === 'published') score += 3;
  else if (profile.source_quality === 'internal') score += 1;

  return score;
}

function valueInBand(value: number, min?: number | null, max?: number | null): boolean {
  if (min != null && value < min) return false;
  if (max != null && value > max) return false;
  return true;
}

export function classifyValueWithProfile(
  profile: NormativeReferenceProfile,
  value: number
): NormativeClassificationResult {
  const order = profile.lower_is_better ? BAND_ORDER_LOW : BAND_ORDER_HIGH;

  for (const label of order) {
    const range = profile.bands[label];
    if (valueInBand(value, range.min_value, range.max_value)) {
      return {
        classification: label,
        band: label,
        profileKey: profile.key,
        profileId: profile.id,
        sourceQuality: profile.source_quality,
        evidenceTier: profile.evidence_tier,
        zScore: profile.z_score_support
          ? (value - profile.z_score_support.mean) / profile.z_score_support.sd
          : null,
      };
    }
  }

  return {
    classification: 'unknown',
    band: undefined,
    profileKey: profile.key,
    profileId: profile.id,
    reason: 'value_outside_bands',
    recommendation: MISSING_RECOMMENDATION,
    sourceQuality: profile.source_quality,
    evidenceTier: profile.evidence_tier,
  };
}

export function calculateZScoreWithProfile(
  profile: NormativeReferenceProfile,
  value: number
): NormativeZScoreResult {
  if (!profile.z_score_support) {
    return { zScore: null, reason: 'z_score_not_supported', profileKey: profile.key };
  }
  const { mean, sd } = profile.z_score_support;
  if (!sd) return { zScore: null, reason: 'invalid_sd', profileKey: profile.key };
  return { zScore: (value - mean) / sd, profileKey: profile.key };
}

export function resolveSeedProfiles(): NormativeReferenceProfile[] {
  const seed = getCatalogSeedIndex();
  return seed.listNormativeProfiles();
}

export function findBestSeedProfile(params: NormativeLookupParams): NormativeReferenceProfile | null {
  const metricKey = params.metricKey ?? 'primary_value';
  const candidates = resolveSeedProfiles().filter(
    (p) =>
      p.assessment_definition_key === params.assessmentDefinitionKey &&
      p.metric_key === metricKey
  );

  if (candidates.length === 0) return null;

  return candidates
    .slice()
    .sort((a, b) => populationScore(b, params) - populationScore(a, params))[0];
}

export class NormativeReferenceEngine {
  constructor(private readonly catalog: ScientificCatalogRepository) {}

  async listNormativeReferences() {
    return this.catalog.normativeReferences.listNormativeReferences();
  }

  async getNormativeReferenceByKey(key: string) {
    return this.catalog.normativeReferences.getNormativeReferenceByKey(key);
  }

  async listReferencesForAssessment(assessmentDefinitionKey: string) {
    return this.catalog.normativeReferences.listReferencesForAssessment(assessmentDefinitionKey);
  }

  async listNormativeProfiles(): Promise<NormativeReferenceProfile[]> {
    return this.catalog.normativeReferences.listNormativeProfiles();
  }

  async findBestReferenceProfile(
    params: NormativeLookupParams
  ): Promise<NormativeReferenceProfile | null> {
    const profiles = await this.listNormativeProfiles();
    const metricKey = params.metricKey ?? 'primary_value';
    const candidates = profiles.filter(
      (p) =>
        p.assessment_definition_key === params.assessmentDefinitionKey &&
        p.metric_key === metricKey
    );
    if (candidates.length === 0) return null;
    return candidates
      .slice()
      .sort((a, b) => populationScore(b, params) - populationScore(a, params))[0];
  }

  async classifyMetricValue(params: NormativeValueParams): Promise<NormativeClassificationResult> {
    const profile = await this.findBestReferenceProfile(params);
    if (!profile) return unknownResult();
    return classifyValueWithProfile(profile, params.value);
  }

  async calculateZScore(params: NormativeValueParams): Promise<NormativeZScoreResult> {
    const profile = await this.findBestReferenceProfile(params);
    if (!profile) return { zScore: null, reason: 'no_reference_available' };
    return calculateZScoreWithProfile(profile, params.value);
  }

  async getPerformanceBand(params: NormativeValueParams): Promise<NormativeClassificationResult> {
    return this.classifyMetricValue(params);
  }
}

export async function resolveProfileFromCatalog(
  catalog: ScientificCatalogRepository,
  referenceKey: string
): Promise<NormativeReferenceProfile | null> {
  const reference = await catalog.normativeReferences.getNormativeReferenceByKey(referenceKey);
  if (!reference) return null;
  const version = await catalog.normativeReferences.getVersion(reference.id, reference.current_version_id);
  if (!version) return null;
  return resolveNormativeProfile(reference, version);
}

export function createNormativeReferenceEngine(
  catalog: ScientificCatalogRepository
): NormativeReferenceEngine {
  return new NormativeReferenceEngine(catalog);
}

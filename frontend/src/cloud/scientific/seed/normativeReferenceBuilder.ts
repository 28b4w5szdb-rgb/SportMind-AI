/**
 * Normative reference seed builder — conservative placeholder bands.
 * Do not overclaim: default sourceQuality is placeholder.
 */

import type {
  CatalogNormativeReference,
  CatalogNormativeReferenceVersion,
  NormativeBandRange,
  NormativePerformanceBands,
  NormativeReferenceProfile,
} from '../models/catalog/NormativeReference';
import type { EvidenceTier } from '../models/common';
import { bilingual, seedDocumentMeta, seedVersionMeta } from './seedHelpers';

export interface NormativeSeedSpec {
  key: string;
  assessmentDefinitionKey: string;
  metricKey?: string;
  nameEn: string;
  nameAr: string;
  unit: string;
  lowerIsBetter?: boolean;
  elite: number;
  good: number;
  average: number;
  evidenceTier?: EvidenceTier;
  sourceQuality?: CatalogNormativeReferenceVersion['source_quality'];
  sport?: string | null;
  ageMin?: number | null;
  ageMax?: number | null;
  sex?: 'male' | 'female' | 'mixed' | null;
  zScoreMean?: number;
  zScoreSd?: number;
  sampleSize?: number;
}

export function normativeReferenceId(key: string): string {
  return `norm_${key}`;
}

export function normativeVersionId(key: string, version = 1): string {
  return `norm_${key}_v${version}`;
}

export function buildPerformanceBands(
  elite: number,
  good: number,
  average: number,
  lowerIsBetter: boolean
): NormativePerformanceBands {
  const gap = Math.abs(good - average) || Math.abs(average) * 0.1 || 1;
  const span = Math.abs(elite - good) || gap;

  const band = (min: number, max: number): NormativeBandRange => ({
    min_value: Math.min(min, max),
    max_value: Math.max(min, max),
  });

  if (lowerIsBetter) {
    return {
      elite: { min_value: null, max_value: elite },
      excellent: band(elite, elite + span * 0.5),
      good: band(elite + span * 0.5, good),
      average: band(good, average + gap * 0.5),
      below_average: band(average + gap * 0.5, average + gap * 1.5),
      poor: { min_value: average + gap * 1.5, max_value: null },
    };
  }

  return {
    poor: { min_value: null, max_value: average - gap * 1.5 },
    below_average: band(average - gap * 1.5, average - gap * 0.5),
    average: band(average - gap * 0.5, average + gap * 0.5),
    good: band(average + gap * 0.5, good),
    excellent: band(good, elite - span * 0.1),
    elite: { min_value: elite, max_value: null },
  };
}

export function buildNormativeReferenceFromSpec(
  spec: NormativeSeedSpec
): { reference: CatalogNormativeReference; version: CatalogNormativeReferenceVersion } {
  const metricKey = spec.metricKey ?? 'primary_value';
  const versionId = normativeVersionId(spec.key);
  const referenceId = normativeReferenceId(spec.key);
  const lowerIsBetter = spec.lowerIsBetter ?? false;

  const reference: CatalogNormativeReference = {
    ...seedDocumentMeta(referenceId),
    ...seedVersionMeta(),
    key: spec.key,
    name: bilingual(spec.nameEn, spec.nameAr),
    assessment_definition_key: spec.assessmentDefinitionKey,
    metric_key: metricKey,
    current_version_id: versionId,
    active: true,
  };

  const version: CatalogNormativeReferenceVersion = {
    ...seedDocumentMeta(versionId),
    ...seedVersionMeta(),
    reference_id: referenceId,
    assessment_definition_key: spec.assessmentDefinitionKey,
    metric_key: metricKey,
    population: {
      sport: spec.sport ?? null,
      age_min: spec.ageMin ?? 16,
      age_max: spec.ageMax ?? 40,
      sex: spec.sex ?? 'mixed',
      position: null,
      competition_level: 'field_sport',
    },
    unit: spec.unit,
    lower_is_better: lowerIsBetter,
    bands: buildPerformanceBands(spec.elite, spec.good, spec.average, lowerIsBetter),
    percentile_table: null,
    z_score_support:
      spec.zScoreMean !== undefined && spec.zScoreSd !== undefined
        ? { mean: spec.zScoreMean, sd: spec.zScoreSd }
        : null,
    swc: null,
    mdc: null,
    sem: null,
    source_quality: spec.sourceQuality ?? 'placeholder',
    evidence_tier: spec.evidenceTier ?? 'field',
    sample_size: spec.sampleSize ?? null,
    citations: [
      {
        citation_id: `cite_placeholder_${spec.key}`,
        label: 'Placeholder reference — replace with published citation before clinical use',
        doi: null,
      },
    ],
  };

  return { reference, version };
}

export function resolveNormativeProfile(
  reference: CatalogNormativeReference,
  version: CatalogNormativeReferenceVersion
): NormativeReferenceProfile {
  return {
    id: reference.id,
    key: reference.key,
    name: reference.name,
    assessment_definition_key: version.assessment_definition_key,
    metric_key: version.metric_key,
    population: version.population,
    unit: version.unit,
    lower_is_better: version.lower_is_better,
    bands: version.bands,
    percentile_table: version.percentile_table ?? null,
    z_score_support: version.z_score_support ?? null,
    swc: version.swc ?? null,
    mdc: version.mdc ?? null,
    sem: version.sem ?? null,
    source_quality: version.source_quality,
    evidence_tier: version.evidence_tier,
    sample_size: version.sample_size ?? null,
    citation_refs: version.citations,
    version: version.version,
    version_number: version.version_number,
  };
}

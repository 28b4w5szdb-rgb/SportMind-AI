import type { BilingualText, CitationRef, EvidenceTier, VersionedDocumentMeta } from '../common';

export type NormativePerformanceBandLabel =
  | 'poor'
  | 'below_average'
  | 'average'
  | 'good'
  | 'excellent'
  | 'elite';

export type NormativeSourceQuality = 'placeholder' | 'internal' | 'published';

export interface NormativeBandRange {
  min_value?: number | null;
  max_value?: number | null;
}

export interface NormativePerformanceBands {
  poor: NormativeBandRange;
  below_average: NormativeBandRange;
  average: NormativeBandRange;
  good: NormativeBandRange;
  excellent: NormativeBandRange;
  elite: NormativeBandRange;
}

export interface NormativePopulationFilter {
  sport?: string | null;
  age_min?: number | null;
  age_max?: number | null;
  sex?: 'male' | 'female' | 'mixed' | null;
  position?: string | null;
  competition_level?: string | null;
}

export interface NormativePercentileEntry {
  percentile: number;
  value: number;
}

export interface NormativeZScoreSupport {
  mean: number;
  sd: number;
}

/** Normative reference version — population profile + bands. */
export interface CatalogNormativeReferenceVersion extends VersionedDocumentMeta {
  reference_id: string;
  assessment_definition_key: string;
  metric_key: string;
  population: NormativePopulationFilter;
  unit: string;
  lower_is_better: boolean;
  bands: NormativePerformanceBands;
  percentile_table?: NormativePercentileEntry[] | null;
  z_score_support?: NormativeZScoreSupport | null;
  swc?: number | null;
  mdc?: number | null;
  sem?: number | null;
  source_quality: NormativeSourceQuality;
  evidence_tier: EvidenceTier;
  sample_size?: number | null;
  citations: CitationRef[];
}

/** Normative reference root document. Path: `catalog/normative_references/{referenceId}`. */
export interface CatalogNormativeReference extends VersionedDocumentMeta {
  key: string;
  name: BilingualText;
  assessment_definition_key: string;
  metric_key: string;
  current_version_id: string;
  active: boolean;
}

/** Flattened profile consumed by the Normative Reference Engine. */
export interface NormativeReferenceProfile {
  id: string;
  key: string;
  name: BilingualText;
  assessment_definition_key: string;
  metric_key: string;
  population: NormativePopulationFilter;
  unit: string;
  lower_is_better: boolean;
  bands: NormativePerformanceBands;
  percentile_table?: NormativePercentileEntry[] | null;
  z_score_support?: NormativeZScoreSupport | null;
  swc?: number | null;
  mdc?: number | null;
  sem?: number | null;
  source_quality: NormativeSourceQuality;
  evidence_tier: EvidenceTier;
  sample_size?: number | null;
  citation_refs: CitationRef[];
  version: string;
  version_number: number;
}

export type CatalogNormativeReferenceInput = Omit<
  CatalogNormativeReference,
  keyof VersionedDocumentMeta | 'active'
> & {
  active?: boolean;
};

export type CatalogNormativeReferenceVersionInput = Omit<
  CatalogNormativeReferenceVersion,
  keyof VersionedDocumentMeta
>;

export type NormativeReferenceEngineDocument = NormativeReferenceProfile;

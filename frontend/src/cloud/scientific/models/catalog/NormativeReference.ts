import type { BilingualText, CitationRef, VersionedDocumentMeta } from '../common';

/** Normative reference version. Path: `catalog/normative_references/{id}/versions/{versionId}`. */
export interface CatalogNormativeReferenceVersion extends VersionedDocumentMeta {
  reference_id: string;
  population: {
    age_min?: number | null;
    age_max?: number | null;
    sex?: 'male' | 'female' | 'mixed' | null;
    sport_key?: string | null;
    competition_level?: string | null;
  };
  metric_key: string;
  bands: Array<{
    label: 'elite' | 'good' | 'average' | 'below';
    min_value?: number | null;
    max_value?: number | null;
  }>;
  percentile_table_ref?: string | null;
  sample_size?: number | null;
  citations: CitationRef[];
}

/** Normative reference profile. Path: `catalog/normative_references/{referenceId}`. */
export interface CatalogNormativeReference extends VersionedDocumentMeta {
  key: string;
  name: BilingualText;
  assessment_definition_key: string;
  current_version_id: string;
  active: boolean;
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

import type { BilingualText, DataSourceType, EvidenceTier, VersionedDocumentMeta } from '../common';

/** Evidence tier catalog entry. Path: `catalog/evidence_tiers/{tierId}`. */
export interface CatalogEvidenceTier extends VersionedDocumentMeta {
  tier: EvidenceTier;
  name: BilingualText;
  description: BilingualText;
  allowed_source_types: DataSourceType[];
  ai_disclaimer_key: string;
  requires_clinical_approval: boolean;
}

export type CatalogEvidenceTierInput = Omit<
  CatalogEvidenceTier,
  keyof VersionedDocumentMeta
>;

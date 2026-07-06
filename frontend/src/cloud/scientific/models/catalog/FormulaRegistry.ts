import type { BilingualText, EvidenceTier, VersionedDocumentMeta } from '../common';

/** Formula version. Path: `catalog/formulas/{formulaId}/versions/{versionId}`. */
export interface CatalogFormulaVersion extends VersionedDocumentMeta {
  formula_id: string;
  expression_key: string;
  input_keys: string[];
  output_key: string;
  output_unit: string;
  evidence_tier: EvidenceTier;
  citation_ids: string[];
  notes?: BilingualText | null;
}

/** Calculation registry entry. Path: `catalog/formulas/{formulaId}`. */
export interface CatalogFormula extends VersionedDocumentMeta {
  key: string;
  name: BilingualText;
  description: BilingualText;
  current_version_id: string;
  active: boolean;
}

export type CatalogFormulaInput = Omit<CatalogFormula, keyof VersionedDocumentMeta | 'active'> & {
  active?: boolean;
};

export type CatalogFormulaVersionInput = Omit<CatalogFormulaVersion, keyof VersionedDocumentMeta>;

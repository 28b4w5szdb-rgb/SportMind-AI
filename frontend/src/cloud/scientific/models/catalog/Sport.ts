import type { BilingualText, CloudDocumentMeta } from '../common';

/** Global sport taxonomy. Path: `catalog/sports/{sportId}`. */
export interface CatalogSport extends CloudDocumentMeta {
  key: string;
  name: BilingualText;
  category?: string | null;
  positions: string[];
  typical_assessment_definition_ids: string[];
  active: boolean;
}

export type CatalogSportInput = Omit<CatalogSport, keyof CloudDocumentMeta | 'active'> & {
  active?: boolean;
};

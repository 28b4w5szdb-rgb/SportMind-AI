import type { BilingualText, CloudDocumentMeta, ScientificCategoryCode } from '../common';

/** Assessment category (A–R taxonomy). Path: `catalog/assessment_categories/{categoryId}`. */
export interface CatalogAssessmentCategory extends CloudDocumentMeta {
  code: ScientificCategoryCode;
  key: string;
  name: BilingualText;
  description: BilingualText;
  sort_order: number;
  /** Optional bridge to Performance Lab category id (e.g. speed, strength). */
  performance_lab_category_id?: string | null;
  active: boolean;
}

export type CatalogAssessmentCategoryInput = Omit<
  CatalogAssessmentCategory,
  keyof CloudDocumentMeta | 'active'
> & {
  active?: boolean;
};

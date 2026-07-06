import type { BilingualText, CloudDocumentMeta } from '../common';

export type QuestionnaireMode = 'beginner' | 'professional' | 'research';

/** Questionnaire template catalog. Path: `catalog/questionnaire_templates/{templateId}`. */
export interface CatalogQuestionnaireTemplate extends CloudDocumentMeta {
  key: string;
  name: BilingualText;
  description: BilingualText;
  instrument_type: 'hooper' | 'ostrc' | 'scat6' | 'restq' | 'custom';
  supported_modes: QuestionnaireMode[];
  question_schema: Array<{
    key: string;
    label: BilingualText;
    type: 'scale' | 'boolean' | 'text' | 'choice';
    min?: number;
    max?: number;
    required: boolean;
    modes: QuestionnaireMode[];
  }>;
  scoring_rule_set_id?: string | null;
  active: boolean;
}

export type CatalogQuestionnaireTemplateInput = Omit<
  CatalogQuestionnaireTemplate,
  keyof CloudDocumentMeta | 'active'
> & {
  active?: boolean;
};

import type { CatalogQuestionnaireTemplate } from '../models/catalog/QuestionnaireTemplate';
import { bilingual, seedDocumentMeta } from './seedHelpers';

export const SEED_QUESTIONNAIRE_TEMPLATES: CatalogQuestionnaireTemplate[] = [
  {
    ...seedDocumentMeta('q_hooper'),
    key: 'hooper',
    name: bilingual('Hooper Index', 'مؤشر Hooper'),
    description: bilingual(
      'Daily wellness: sleep, stress, fatigue, soreness',
      'العافية اليومية: النوم، التوتر، الإجهاد، الألم'
    ),
    instrument_type: 'hooper',
    supported_modes: ['beginner', 'professional', 'research'],
    question_schema: [
      {
        key: 'sleep',
        label: bilingual('Sleep quality', 'جودة النوم'),
        type: 'scale',
        min: 1,
        max: 7,
        required: true,
        modes: ['beginner', 'professional', 'research'],
      },
      {
        key: 'fatigue',
        label: bilingual('Fatigue', 'الإجهاد'),
        type: 'scale',
        min: 1,
        max: 7,
        required: true,
        modes: ['beginner', 'professional', 'research'],
      },
      {
        key: 'stress',
        label: bilingual('Stress', 'التوتر'),
        type: 'scale',
        min: 1,
        max: 7,
        required: false,
        modes: ['professional', 'research'],
      },
      {
        key: 'soreness',
        label: bilingual('Muscle soreness', 'ألم العضلات'),
        type: 'scale',
        min: 1,
        max: 7,
        required: true,
        modes: ['beginner', 'professional', 'research'],
      },
    ],
    scoring_rule_set_id: 'hooper_v1',
    active: true,
  },
  {
    ...seedDocumentMeta('q_ostrc'),
    key: 'ostrc',
    name: bilingual('OSTRC-Full', 'OSTRC-Full'),
    description: bilingual(
      'Overuse injury surveillance questionnaire',
      'استبيان مراقبة إصابات الإفراط'
    ),
    instrument_type: 'ostrc',
    supported_modes: ['professional', 'research'],
    question_schema: [
      {
        key: 'pain',
        label: bilingual('Pain', 'الألم'),
        type: 'scale',
        min: 0,
        max: 100,
        required: true,
        modes: ['professional', 'research'],
      },
      {
        key: 'training_impact',
        label: bilingual('Training impact', 'تأثير على التدريب'),
        type: 'scale',
        min: 0,
        max: 100,
        required: true,
        modes: ['professional', 'research'],
      },
    ],
    scoring_rule_set_id: 'ostrc_full_v1',
    active: true,
  },
  {
    ...seedDocumentMeta('q_scat6'),
    key: 'scat6',
    name: bilingual('SCAT6', 'SCAT6'),
    description: bilingual(
      'Sport Concussion Assessment Tool',
      'أداة تقييم الارتجاج الرياضي'
    ),
    instrument_type: 'scat6',
    supported_modes: ['professional', 'research'],
    question_schema: [
      {
        key: 'symptoms',
        label: bilingual('Symptom score', 'درجة الأعراض'),
        type: 'scale',
        min: 0,
        max: 132,
        required: true,
        modes: ['professional', 'research'],
      },
    ],
    scoring_rule_set_id: 'scat6_v1',
    active: true,
  },
  {
    ...seedDocumentMeta('q_restq'),
    key: 'restq',
    name: bilingual('RESTQ-Sport', 'RESTQ-Sport'),
    description: bilingual(
      'Recovery-stress questionnaire for athletes',
      'استبيان التعافي والإجهاد للرياضيين'
    ),
    instrument_type: 'restq',
    supported_modes: ['research'],
    question_schema: [
      {
        key: 'general_stress',
        label: bilingual('General stress', 'الإجهاد العام'),
        type: 'scale',
        min: 0,
        max: 6,
        required: true,
        modes: ['research'],
      },
    ],
    scoring_rule_set_id: 'restq_sport_v1',
    active: true,
  },
];

import type { CatalogEvidenceTier } from '../models/catalog/EvidenceTier';
import { bilingual, seedDocumentMeta, seedVersionMeta } from './seedHelpers';

export const SEED_EVIDENCE_TIERS: CatalogEvidenceTier[] = [
  {
    ...seedDocumentMeta('tier_screening'),
    ...seedVersionMeta('1.0.0'),
    tier: 'screening',
    name: bilingual('Screening', 'فحص أولي'),
    description: bilingual(
      'Directional estimates for quick coaching decisions.',
      'تقديرات توجيهية لقرارات تدريب سريعة.'
    ),
    allowed_source_types: ['manual', 'calculated'],
    ai_disclaimer_key: 'scientific.disclaimer.screening',
    requires_clinical_approval: false,
  },
  {
    ...seedDocumentMeta('tier_field'),
    ...seedVersionMeta('1.0.0'),
    tier: 'field',
    name: bilingual('Field', 'ميدان'),
    description: bilingual(
      'Standardized field tests with published protocols.',
      'اختبارات ميدانية موحّدة ببروtokolات منشورة.'
    ),
    allowed_source_types: ['manual', 'calculated', 'questionnaire'],
    ai_disclaimer_key: 'scientific.disclaimer.field',
    requires_clinical_approval: false,
  },
  {
    ...seedDocumentMeta('tier_professional'),
    ...seedVersionMeta('1.0.0'),
    tier: 'professional',
    name: bilingual('Professional', 'احترافي'),
    description: bilingual(
      'Instrumented elite monitoring with validated devices.',
      'مراقبة احترافية بأجهزة مُعتمدة.'
    ),
    allowed_source_types: ['manual', 'wearable', 'gps', 'force_plate', 'bia', 'questionnaire'],
    ai_disclaimer_key: 'scientific.disclaimer.professional',
    requires_clinical_approval: false,
  },
  {
    ...seedDocumentMeta('tier_research'),
    ...seedVersionMeta('1.0.0'),
    tier: 'research',
    name: bilingual('Research', 'بحث'),
    description: bilingual(
      'Publication-grade methods with full provenance metadata.',
      'من methods بمستوى النشر مع بيانات مصدر كاملة.'
    ),
    allowed_source_types: ['manual', 'force_plate', 'gps', 'dexa', 'blood', 'spirometry', 'csv'],
    ai_disclaimer_key: 'scientific.disclaimer.research',
    requires_clinical_approval: false,
  },
  {
    ...seedDocumentMeta('tier_clinical'),
    ...seedVersionMeta('1.0.0'),
    tier: 'clinical',
    name: bilingual('Clinical', 'سريري'),
    description: bilingual(
      'Medical and sports medicine assessments requiring clinician oversight.',
      'تقييمات طبية وطب رياضي تتطلب إشرافًا سريريًا.'
    ),
    allowed_source_types: ['manual', 'blood', 'spirometry', 'dexa', 'questionnaire'],
    ai_disclaimer_key: 'scientific.disclaimer.clinical',
    requires_clinical_approval: true,
  },
];

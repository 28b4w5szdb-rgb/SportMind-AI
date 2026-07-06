import type { CatalogAssessmentCategory } from '../models/catalog/AssessmentCategory';
import type { ScientificCategoryCode } from '../models/common';
import { bilingual, seedDocumentMeta } from './seedHelpers';

function category(
  id: string,
  code: ScientificCategoryCode,
  en: string,
  ar: string,
  sortOrder: number,
  performanceLabId?: string
): CatalogAssessmentCategory {
  return {
    ...seedDocumentMeta(id),
    code,
    key: code,
    name: bilingual(en, ar),
    description: bilingual(`${en} assessments`, `تقييمات ${ar}`),
    sort_order: sortOrder,
    performance_lab_category_id: performanceLabId ?? null,
    active: true,
  };
}

/** Full A–R scientific taxonomy (Phase 6C.0.2). */
export const SEED_ASSESSMENT_CATEGORIES: CatalogAssessmentCategory[] = [
  category('cat_anthropometry', 'anthropometry', 'Anthropometry', 'القياسات الجسمية', 1),
  category('cat_body_composition', 'body_composition', 'Body Composition', 'تركيب الجسم', 2, 'body_composition'),
  category('cat_cardiorespiratory', 'cardiorespiratory', 'Cardiorespiratory Fitness', 'اللياقة القلبية التنفسية', 3, 'endurance'),
  category('cat_strength', 'strength', 'Strength', 'القوة', 4, 'strength'),
  category('cat_power', 'power', 'Power', 'القدرة', 5, 'power'),
  category('cat_speed', 'speed', 'Speed', 'السرعة', 6, 'speed'),
  category('cat_agility', 'agility', 'Agility', 'الرشاقة', 7, 'agility'),
  category('cat_neuromuscular', 'neuromuscular', 'Neuromuscular Performance', 'الأداء العصبي العضلي', 8, 'neuromuscular'),
  category('cat_recovery', 'recovery', 'Recovery', 'التعافي', 9),
  category('cat_training_load', 'training_load', 'Training Load', 'حمل التدريب', 10),
  category('cat_fatigue', 'fatigue', 'Fatigue', 'الإجهاد', 11),
  category('cat_hydration', 'hydration', 'Hydration', 'الترطيب', 12),
  category('cat_nutrition', 'nutrition', 'Nutrition', 'التغذية', 13),
  category('cat_sports_medicine', 'sports_medicine', 'Sports Medicine', 'الطب الرياضي', 14),
  category('cat_injury_risk', 'injury_risk', 'Injury Risk', 'مخاطر الإصابة', 15),
  category('cat_monitoring', 'monitoring', 'Monitoring', 'المراقبة', 16),
  category('cat_readiness', 'readiness', 'Readiness', 'الجاهزية', 17),
  category('cat_laboratory', 'laboratory', 'Laboratory Assessments', 'التقييمات المخبرية', 18),
];

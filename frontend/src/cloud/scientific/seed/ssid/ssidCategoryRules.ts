/**
 * SSID category rule templates — domain-specific Layer 2–4 modifiers for 18 categories.
 */

import type { BilingualText, ScientificCategoryCode } from '../../models/common';
import type { SsidClassificationId } from '../../models/interpretation/ScientificInterpretation';
import { bilingual } from '../seedHelpers';
import { getBandTemplate, type SsidBandTemplate } from './ssidBandTemplates';

export interface SsidCategoryRule {
  rule_id: string;
  category_code: ScientificCategoryCode;
  domain: BilingualText;
  version: string;
}

export const SSID_CATEGORY_RULES: SsidCategoryRule[] = [
  { rule_id: 'cat_anthropometry', category_code: 'anthropometry', domain: bilingual('body size and shape', 'حجم الجسم وشكله'), version: '1.0.0' },
  { rule_id: 'cat_body_composition', category_code: 'body_composition', domain: bilingual('fat and lean tissue distribution', 'توزيع الدهون والنسيج النحيل'), version: '1.0.0' },
  { rule_id: 'cat_cardiorespiratory', category_code: 'cardiorespiratory', domain: bilingual('aerobic and cardiovascular capacity', 'القدرة الهوائية والقلبية'), version: '1.0.0' },
  { rule_id: 'cat_strength', category_code: 'strength', domain: bilingual('maximal force production', 'إنتاج القوة القصوى'), version: '1.0.0' },
  { rule_id: 'cat_power', category_code: 'power', domain: bilingual('rate of force development', 'معدل تطور القوة'), version: '1.0.0' },
  { rule_id: 'cat_speed', category_code: 'speed', domain: bilingual('linear sprint velocity', 'سرعة Sprint خطية'), version: '1.0.0' },
  { rule_id: 'cat_agility', category_code: 'agility', domain: bilingual('change-of-direction ability', 'قدرة تغيير الاتجاه'), version: '1.0.0' },
  { rule_id: 'cat_neuromuscular', category_code: 'neuromuscular', domain: bilingual('neuromuscular control and balance', 'التحكم العصبي العضلي والتوازن'), version: '1.0.0' },
  { rule_id: 'cat_recovery', category_code: 'recovery', domain: bilingual('recovery and autonomic balance', 'التعافي والتوازن الذاتي'), version: '1.0.0' },
  { rule_id: 'cat_training_load', category_code: 'training_load', domain: bilingual('internal and external training load', 'حمل التدريب الداخلي والخارجي'), version: '1.0.0' },
  { rule_id: 'cat_fatigue', category_code: 'fatigue', domain: bilingual('fatigue and neuromuscular readiness', 'الإجهاد والجاهزية العصبية العضلية'), version: '1.0.0' },
  { rule_id: 'cat_hydration', category_code: 'hydration', domain: bilingual('hydration status', 'حالة الترطيب'), version: '1.0.0' },
  { rule_id: 'cat_nutrition', category_code: 'nutrition', domain: bilingual('nutritional status markers', 'مؤشرات الحالة الغذائية'), version: '1.0.0' },
  { rule_id: 'cat_sports_medicine', category_code: 'sports_medicine', domain: bilingual('clinical sports medicine screening', 'فحص الطب الرياضي'), version: '1.0.0' },
  { rule_id: 'cat_injury_risk', category_code: 'injury_risk', domain: bilingual('injury risk screening', 'فحص مخاطر الإصابة'), version: '1.0.0' },
  { rule_id: 'cat_monitoring', category_code: 'monitoring', domain: bilingual('ongoing athlete monitoring', 'مراقبة الرياضي المستمرة'), version: '1.0.0' },
  { rule_id: 'cat_readiness', category_code: 'readiness', domain: bilingual('daily readiness to train', 'الجاهزية اليومية للتدريب'), version: '1.0.0' },
  { rule_id: 'cat_laboratory', category_code: 'laboratory', domain: bilingual('laboratory-derived biomarker', 'مؤشر مخبري'), version: '1.0.0' },
];

const categoryIndex = new Map(SSID_CATEGORY_RULES.map((r) => [r.category_code, r]));

export function getCategoryRule(categoryCode: ScientificCategoryCode): SsidCategoryRule {
  return categoryIndex.get(categoryCode) ?? categoryIndex.get('monitoring')!;
}

export function applyCategoryContext(
  band: SsidBandTemplate,
  category: SsidCategoryRule,
  classificationId: SsidClassificationId
): Pick<SsidBandTemplate, 'scientific_meaning' | 'performance_meaning' | 'recommendation'> {
  const prefix = category.domain.en;
  const prefixAr = category.domain.ar;

  if (classificationId === 'unknown') {
    return {
      scientific_meaning: band.scientific_meaning,
      performance_meaning: band.performance_meaning,
      recommendation: band.recommendation,
    };
  }

  return {
    scientific_meaning: bilingual(
      `For ${prefix}, ${band.scientific_meaning.en.charAt(0).toLowerCase()}${band.scientific_meaning.en.slice(1)}`,
      `بالنسبة لـ${prefixAr}، ${band.scientific_meaning.ar}`
    ),
    performance_meaning: bilingual(
      `For ${prefix}, ${band.performance_meaning.en.charAt(0).toLowerCase()}${band.performance_meaning.en.slice(1)}`,
      `بالنسبة لـ${prefixAr}، ${band.performance_meaning.ar}`
    ),
    recommendation: band.recommendation,
  };
}

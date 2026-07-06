/**
 * SSID metric-specific rules — deterministic thresholds ported from feature SSID (cloud-only).
 */

import type { BilingualText } from '../../models/common';
import type {
  SsidClassificationId,
  SsidInterpretationInput,
  SsidRiskLevel,
} from '../../models/interpretation/ScientificInterpretation';
import { bilingual } from '../seedHelpers';
import { getBandTemplate } from './ssidBandTemplates';

export interface SsidMetricRule {
  rule_id: string;
  metric_template_id: string;
  version: string;
  evaluate: (input: SsidInterpretationInput) => SsidMetricRuleResult;
}

export interface SsidMetricRuleResult {
  classification_id: SsidClassificationId;
  classification: BilingualText;
  scientific_meaning: BilingualText;
  performance_meaning: BilingualText;
  risk_level: SsidRiskLevel;
  risk_label: BilingualText;
  recommendation: BilingualText;
  confidence: number;
}

function result(
  classificationId: SsidClassificationId,
  classification: BilingualText,
  scientific: BilingualText,
  performance: BilingualText,
  risk: SsidRiskLevel,
  recommendation: BilingualText,
  confidence: number
): SsidMetricRuleResult {
  const riskLabels: Record<SsidRiskLevel, BilingualText> = {
    low: bilingual('Low', 'منخفض'),
    moderate: bilingual('Moderate', 'متوسط'),
    high: bilingual('High', 'مرتفع'),
    unknown: bilingual('Unknown', 'غير معروف'),
  };
  return {
    classification_id: classificationId,
    classification,
    scientific_meaning: scientific,
    performance_meaning: performance,
    risk_level: risk,
    risk_label: riskLabels[risk],
    recommendation,
    confidence,
  };
}

function evaluateBmi(input: SsidInterpretationInput): SsidMetricRuleResult {
  const v = input.metric_value;
  if (v < 18.5) {
    return result(
      'below_average',
      bilingual('Underweight', 'نقص الوزن'),
      bilingual('Body mass is below healthy reference for height.', 'كتلة الجسم دون المرجع الصحي للطول.'),
      bilingual('May limit strength and energy availability.', 'قد يحد من القوة وتوفر الطاقة.'),
      'moderate',
      bilingual('Increase fueling', 'زِد التغذية'),
      88
    );
  }
  if (v < 25) {
    return result(
      'good',
      bilingual('Normal', 'طبيعي'),
      bilingual('Body mass is within healthy reference range.', 'كتلة الجسم ضمن النطاق الصحي.'),
      bilingual('Supports general training tolerance.', 'يدعم تحمل التدريب العام.'),
      'low',
      bilingual('Train normally', 'تدرب بشكل طبيعي'),
      88
    );
  }
  if (v < 30) {
    return result(
      'below_average',
      bilingual('Overweight', 'زيادة وزن'),
      bilingual('Elevated body mass may increase metabolic load.', 'كتلة الجسم المرتفعة قد تزيد الحمل الأيضي.'),
      bilingual('May reduce running economy and heat tolerance.', 'قد يقلل economy الجري وتحمل الحرارة.'),
      'moderate',
      bilingual('Reduce load', 'قلل الحمل'),
      86
    );
  }
  return result(
    'poor',
    bilingual('Obesity', 'سمنة'),
    bilingual('High body mass increases cardiometabolic strain.', 'كتلة الجسم العالية تزيد الض الإجهاد القلبي الأيضي.'),
    bilingual('Performance and injury risk may be elevated.', 'قد يرتفع خطر الأداء والإصابة.'),
    'high',
    bilingual('Medical review', 'مراجعة طبية'),
    85
  );
}

function evaluateBodyFat(input: SsidInterpretationInput): SsidMetricRuleResult {
  const female = input.sex === 'female';
  const v = input.metric_value;
  if (female) {
    if (v < 16) return result('elite', bilingual('Athlete', 'رياضي'), bilingual('Very low adiposity for female athlete.', 'دهون منخفضة جداً للرياضية.'), bilingual('High power-to-weight potential.', 'إمكانية عالي للقوة/الوزن.'), 'low', bilingual('Maintain plan', 'حافظ على الخطة'), 86);
    if (v < 20) return result('excellent', bilingual('Excellent', 'ممتاز'), bilingual('Low adiposity with good function.', 'دهون منخفضة مع وظيفة جيدة.'), bilingual('Strong body composition for sport.', 'تركيب جسم قوي للرياضة.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 86);
    if (v < 24) return result('good', bilingual('Good', 'جيد'), bilingual('Healthy adiposity range.', 'نطاق دهون صحي.'), bilingual('Supports performance goals.', 'يدعم أهداف الأداء.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 84);
    if (v < 28) return result('average', bilingual('Average', 'متوسط'), bilingual('Moderate adiposity.', 'دهون معتدلة.'), bilingual('Monitor load and nutrition.', 'راقب الحمل والتغذية.'), 'moderate', bilingual('Mobility focus', 'ركز على الحركة'), 82);
    return result('poor', bilingual('High', 'مرتفع'), bilingual('Elevated adiposity.', 'دهون مرتفعة.'), bilingual('May impair speed and endurance.', 'قد تضعف السرعة والتحمل.'), 'high', bilingual('Reduce load', 'قلل الحمل'), 80);
  }
  if (v < 8) return result('elite', bilingual('Athlete', 'رياضي'), bilingual('Very low adiposity for male athlete.', 'دهون منخفضة جداً للرياضي.'), bilingual('High power-to-weight potential.', 'إمكانية عالي للقوة/الوزن.'), 'low', bilingual('Maintain plan', 'حافظ على الخطة'), 86);
  if (v < 12) return result('excellent', bilingual('Excellent', 'ممتاز'), bilingual('Low adiposity with good function.', 'دهون منخفضة مع وظيفة جيدة.'), bilingual('Strong body composition for sport.', 'تركيب جسم قوي للرياضة.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 86);
  if (v < 16) return result('good', bilingual('Good', 'جيد'), bilingual('Healthy adiposity range.', 'نطاق دهون صحي.'), bilingual('Supports performance goals.', 'يدعم أهداف الأداء.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 84);
  if (v < 20) return result('average', bilingual('Average', 'متوسط'), bilingual('Moderate adiposity.', 'دهون معتدلة.'), bilingual('Monitor load and nutrition.', 'راقب الحمل والتغذية.'), 'moderate', bilingual('Mobility focus', 'ركز على الحركة'), 82);
  return result('poor', bilingual('High', 'مرتفع'), bilingual('Elevated adiposity.', 'دهون مرتفعة.'), bilingual('May impair speed and endurance.', 'قد تضعف السرعة والتحمل.'), 'high', bilingual('Reduce load', 'قلل الحمل'), 80);
}

function evaluateVo2Max(input: SsidInterpretationInput): SsidMetricRuleResult {
  const v = input.metric_value;
  if (v < 35) return result('poor', bilingual('Poor', 'ضعيف'), bilingual('Low aerobic capacity.', 'قدرة هوائية منخفضة.'), bilingual('Limits sustained performance.', 'يحد الأداء المستدام.'), 'high', bilingual('Aerobic base', 'قاعدة هوائية'), 84);
  if (v < 42) return result('below_average', bilingual('Fair', 'مقبول'), bilingual('Below average aerobic capacity.', 'قدرة هوائية دون المتوسط.'), bilingual('Endurance sessions may be taxing.', 'جلسات التحمل قد تكون مرهقة.'), 'moderate', bilingual('Build base', 'ابنِ القاعدة'), 84);
  if (v < 48) return result('good', bilingual('Good', 'جيد'), bilingual('Solid aerobic foundation.', 'أساس هوائي جيد.'), bilingual('Supports team-sport demands.', 'يدعم متطلبات رياضات الفريق.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 84);
  if (v < 55) return result('excellent', bilingual('Very Good', 'جيد جداً'), bilingual('High aerobic capacity.', 'قدرة هوائية عالية.'), bilingual('Strong repeat-sprint recovery.', 'تعافٍ قوي بين Sprint.'), 'low', bilingual('Progress load', 'تقدّم الحمل'), 85);
  if (v < 62) return result('excellent', bilingual('Excellent', 'ممتاز'), bilingual('Elite-range aerobic capacity.', 'قدرة هوائية بمستوى النخبة.'), bilingual('Competitive endurance advantage.', 'ميزة تحمل تنافسية.'), 'low', bilingual('Maintain plan', 'حافظ على الخطة'), 86);
  return result('elite', bilingual('Elite', 'نخبة'), bilingual('Exceptional aerobic capacity.', 'قدرة هوائية استثنائية.'), bilingual('Top-tier endurance performance.', 'أداء تحمل من الدرجة الأولى.'), 'low', bilingual('Maintain plan', 'حافظ على الخطة'), 87);
}

function evaluateAcwr(input: SsidInterpretationInput): SsidMetricRuleResult {
  const v = input.metric_value;
  if (v < 0.8) return result('below_average', bilingual('Under-training', 'تدريب غير كافٍ'), bilingual('Chronic load exceeds acute — detraining risk.', 'الحمل المزمن يتجاوز الحاد — خطر فقد اللياقة.'), bilingual('Fitness may decline if sustained.', 'قد تتراجع اللياقة إذا استمر.'), 'moderate', bilingual('Increase load', 'زِد الحمل'), 87);
  if (v <= 1.3) return result('good', bilingual('Optimal', 'مثالي'), bilingual('Acute:chronic ratio in safe training zone.', 'نسبة حاد:مزمن في منطقة تدريب آمنة.'), bilingual('Supports الحمل التدريبي التدريجي.', 'يدعم الحمل التدريبي التدريجي.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 87);
  if (v <= 1.5) return result('average', bilingual('Elevated', 'مرتفع'), bilingual('Workload spike above chronic خط الأساس.', 'ارتفاع الحمل فوق خط الأساس المزمن.'), bilingual('Injury risk may increase.', 'قد يزداد خطر الإصابة.'), 'moderate', bilingual('Reduce load', 'قلل الحمل'), 86);
  return result('poor', bilingual('Spike Risk', 'خطر Spike'), bilingual('Acute load يتجاوز بكثير chronic capacity.', 'الحمل الحاد ي يتجاوز بكثير القدرة المزمنة.'), bilingual('High soft-tissue injury risk.', 'خطر مرتفع لإصابة الأنسجة الرخوة.'), 'high', bilingual('Recovery focus', 'ركز على التعافي'), 87);
}

function evaluateTrainingLoad(input: SsidInterpretationInput): SsidMetricRuleResult {
  const v = input.metric_value;
  const ref = 450;
  const ratio = v / ref;
  if (ratio < 0.6) return result('below_average', bilingual('Low', 'منخفض'), bilingual('Session load below typical reference.', 'حمل الجلسة دون المرجع المعتاد.'), bilingual('May indicate منبه غير كافٍ.', 'قد يشير إلى منبه غير كافٍ.'), 'low', bilingual('Maintain or build', 'حافظ أو ابنِ'), 85);
  if (ratio < 1.0) return result('good', bilingual('Moderate', 'معتدل'), bilingual('Session load within normal range.', 'حمل الجلسة ضمن النطاق الطبيعي.'), bilingual('Appropriate training stimulus.', 'منبه تدريب مناسب.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 85);
  if (ratio < 1.4) return result('average', bilingual('High', 'مرتفع'), bilingual('Elevated session internal load.', 'حمل داخلي م elevated للجلسة.'), bilingual('Monitor recovery before next hard session.', 'راقب التعافي قبل الجلسة القادمة.'), 'moderate', bilingual('Recovery session', 'جلسة تعافي'), 84);
  return result('poor', bilingual('Very High', 'مرتفع جداً'), bilingual('Very high internal session load.', 'حمل داخلي مرتفع جداً للجلسة.'), bilingual('Fatigue and injury risk elevated.', 'الإجهاد وخطر الإصابة مرتفعان.'), 'high', bilingual('Reduce load', 'قلل الحمل'), 84);
}

function evaluateRecoveryScore(input: SsidInterpretationInput): SsidMetricRuleResult {
  const v = input.metric_value;
  if (v < 40) return result('poor', bilingual('Poor', 'ضعيف'), bilingual('Recovery markers indicate high fatigue.', 'مؤشرات التعافي تشير إلى إجهاد مرتفع.'), bilingual('Hard training قد يكون مضراً.', 'التدريب الشاق قد يكون مضراً.'), 'high', bilingual('Recovery focus', 'ركز على التعافي'), 86);
  if (v < 55) return result('below_average', bilingual('Needs Recovery', 'يحتاج تعافياً'), bilingual('Incomplete recovery from prior load.', 'تعافٍ غير مكتمل من الحمل السابق.'), bilingual('Reduce intensity today.', 'قلل الشدة اليوم.'), 'moderate', bilingual('Recovery session', 'جلسة تعافي'), 86);
  if (v < 70) return result('average', bilingual('Moderate', 'معتدل'), bilingual('Partial recovery achieved.', 'تعافٍ جزئي achieved.'), bilingual('Moderate training appropriate.', 'تدريب معتدل مناسب.'), 'moderate', bilingual('Reduce intensity', 'قلل الشدة'), 85);
  if (v < 85) return result('good', bilingual('Good', 'جيد'), bilingual('Adequate recovery for training.', 'تعافٍ كافٍ للتدريب.'), bilingual('Normal progression supported.', 'التقدم الطبيعي مدعوم.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 86);
  return result('excellent', bilingual('Excellent', 'ممتاز'), bilingual('Full recovery indicated.', 'تعافٍ كامل.'), bilingual('Ready for عالية الشدة work.', 'جاهز لعمل عالية الشدة.'), 'low', bilingual('Train normally', 'تدرب بشكل طبيعي'), 86);
}

function evaluateReadinessScore(input: SsidInterpretationInput): SsidMetricRuleResult {
  return evaluateRecoveryScore(input);
}

function evaluateRelativeMetric(
  input: SsidInterpretationInput,
  label: BilingualText
): SsidMetricRuleResult {
  const bandId = input.classification_id === 'unknown' ? 'average' : input.classification_id;
  const band = getBandTemplate(bandId);
  return {
    classification_id: bandId,
    classification: label,
    scientific_meaning: band.scientific_meaning,
    performance_meaning: band.performance_meaning,
    risk_level: band.risk_level,
    risk_label: band.risk_label,
    recommendation: band.recommendation,
    confidence: band.confidence,
  };
}

export const SSID_METRIC_RULES: SsidMetricRule[] = [
  { rule_id: 'metric_bmi', metric_template_id: 'bmi', version: '1.0.0', evaluate: evaluateBmi },
  { rule_id: 'metric_body_fat', metric_template_id: 'body_fat', version: '1.0.0', evaluate: evaluateBodyFat },
  { rule_id: 'metric_body_water', metric_template_id: 'body_water', version: '1.0.0', evaluate: (i) => evaluateRelativeMetric(i, bilingual('Body Water', 'ماء الجسم')) },
  { rule_id: 'metric_muscle_mass', metric_template_id: 'muscle_mass', version: '1.0.0', evaluate: (i) => evaluateRelativeMetric(i, bilingual('Muscle Mass', 'كتلة العضلات')) },
  { rule_id: 'metric_lean_mass', metric_template_id: 'lean_mass', version: '1.0.0', evaluate: (i) => evaluateRelativeMetric(i, bilingual('Lean Mass', 'الكتلة النحيلة')) },
  { rule_id: 'metric_vo2_max', metric_template_id: 'vo2_max', version: '1.0.0', evaluate: evaluateVo2Max },
  { rule_id: 'metric_hr_zones', metric_template_id: 'hr_zones', version: '1.0.0', evaluate: (i) => evaluateRelativeMetric(i, bilingual('Heart Rate Zone', 'منطقة ضربات القلب')) },
  { rule_id: 'metric_session_load', metric_template_id: 'session_load', version: '1.0.0', evaluate: evaluateTrainingLoad },
  { rule_id: 'metric_acwr', metric_template_id: 'acwr', version: '1.0.0', evaluate: evaluateAcwr },
  { rule_id: 'metric_recovery_score', metric_template_id: 'recovery_score', version: '1.0.0', evaluate: evaluateRecoveryScore },
  { rule_id: 'metric_readiness_score', metric_template_id: 'readiness_score', version: '1.0.0', evaluate: evaluateReadinessScore },
];

const metricIndex = new Map(SSID_METRIC_RULES.map((r) => [r.metric_template_id, r]));

export function getMetricRule(metricTemplateId: string): SsidMetricRule | null {
  return metricIndex.get(metricTemplateId) ?? null;
}

export const SSID_METRIC_RULE_COUNT = SSID_METRIC_RULES.length;

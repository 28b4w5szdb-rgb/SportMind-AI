/**
 * SSID normative band templates — Layer 1–5 bilingual content by classification band.
 */

import type { BilingualText } from '../../models/common';
import type { SsidClassificationId, SsidRiskLevel } from '../../models/interpretation/ScientificInterpretation';
import { bilingual } from '../seedHelpers';

export interface SsidBandTemplate {
  band_id: SsidClassificationId;
  classification: BilingualText;
  scientific_meaning: BilingualText;
  performance_meaning: BilingualText;
  risk_level: SsidRiskLevel;
  risk_label: BilingualText;
  recommendation: BilingualText;
  confidence: number;
}

export const SSID_BAND_TEMPLATES: SsidBandTemplate[] = [
  {
    band_id: 'elite',
    classification: bilingual('Elite', 'نخبة'),
    scientific_meaning: bilingual(
      'Result exceeds high-performance reference standards for this assessment.',
      'النتيجة تتجاوز معايير المرجعية للأداء العالي في هذا التقييم.'
    ),
    performance_meaning: bilingual(
      'Strong competitive advantage; maintain current training stimulus.',
      'ميزة تنافسية قوية؛ حافظ على منبه التدريب الحالي.'
    ),
    risk_level: 'low',
    risk_label: bilingual('Low', 'منخفض'),
    recommendation: bilingual('Maintain plan', 'حافظ على الخطة'),
    confidence: 88,
  },
  {
    band_id: 'excellent',
    classification: bilingual('Excellent', 'ممتاز'),
    scientific_meaning: bilingual(
      'Result is well above population average with robust physiological capacity.',
      'النتيجة أعلى بكثير من متوسط المجتمع مع قدرة فسيولوجية قوية.'
    ),
    performance_meaning: bilingual(
      'High readiness for demanding training and competition blocks.',
      'جاهزية عالية لكتل التدريب والمنافسة المتطلبة.'
    ),
    risk_level: 'low',
    risk_label: bilingual('Low', 'منخفض'),
    recommendation: bilingual('Progress load', 'تقدّم الحمل'),
    confidence: 86,
  },
  {
    band_id: 'good',
    classification: bilingual('Good', 'جيد'),
    scientific_meaning: bilingual(
      'Result is above average and within a healthy functional range.',
      'النتيجة فوق المتوسط وضمن نطاق وظيفي صحي.'
    ),
    performance_meaning: bilingual(
      'Supports normal progression with targeted weaknesses to address.',
      'يدعم التقدم الطبيعي مع نقاط ضعف محددة للمعالجة.'
    ),
    risk_level: 'low',
    risk_label: bilingual('Low', 'منخفض'),
    recommendation: bilingual('Train normally', 'تدرب بشكل طبيعي'),
    confidence: 84,
  },
  {
    band_id: 'average',
    classification: bilingual('Average', 'متوسط'),
    scientific_meaning: bilingual(
      'Result aligns with typical population reference for this metric.',
      'النتيجة تتماشى مع المرجع السكاني المعتاد لهذا المؤشر.'
    ),
    performance_meaning: bilingual(
      'Adequate baseline; improvement potential exists with structured work.',
      'خط أساس كافٍ؛ يوجد إمكانية للتحسين بعمل منظم.'
    ),
    risk_level: 'moderate',
    risk_label: bilingual('Moderate', 'متوسط'),
    recommendation: bilingual('Target weakness', 'استهدف نقطة الضعف'),
    confidence: 80,
  },
  {
    band_id: 'below_average',
    classification: bilingual('Below Average', 'أقل من المتوسط'),
    scientific_meaning: bilingual(
      'Result falls below typical reference — capacity may be limited.',
      'النتيجة دون المرجع المعتاد — قد تكون القدرة محدودة.'
    ),
    performance_meaning: bilingual(
      'May limit performance output until corrected or improved.',
      'قد يحد من الأداء حتى يتم التصحيح أو التحسين.'
    ),
    risk_level: 'moderate',
    risk_label: bilingual('Moderate', 'متوسط'),
    recommendation: bilingual('Reduce intensity', 'قلل الشدة'),
    confidence: 78,
  },
  {
    band_id: 'poor',
    classification: bilingual('Poor', 'ضعيف'),
    scientific_meaning: bilingual(
      'Result is substantially below reference — investigate limiting factors.',
      'النتيجة دون المرجع بشكل كبير — افحص العوامل المحدِّدة.'
    ),
    performance_meaning: bilingual(
      'High risk of underperformance and potential overuse if load is not adjusted.',
      'خطر مرتفع للأداء الضعيف والإفراط إذا لم يُعدّل الحمل.'
    ),
    risk_level: 'high',
    risk_label: bilingual('High', 'مرتفع'),
    recommendation: bilingual('Recovery focus', 'ركز على التعافي'),
    confidence: 76,
  },
  {
    band_id: 'unknown',
    classification: bilingual('Unknown', 'غير معروف'),
    scientific_meaning: bilingual(
      'Insufficient normative reference — interpret using raw value and trend only.',
      'مرجع معياري غير كافٍ — فسّر باستخدام القيمة الخام والاتجاه فقط.'
    ),
    performance_meaning: bilingual(
      'Track longitudinally before drawing performance conclusions.',
      'تتبع على مدى زمني قبل استنتاجات الأداء.'
    ),
    risk_level: 'unknown',
    risk_label: bilingual('Unknown', 'غير معروف'),
    recommendation: bilingual('Monitor trend', 'راقب الاتجاه'),
    confidence: 60,
  },
];

const bandIndex = new Map(SSID_BAND_TEMPLATES.map((t) => [t.band_id, t]));

export function getBandTemplate(bandId: SsidClassificationId): SsidBandTemplate {
  return bandIndex.get(bandId) ?? bandIndex.get('unknown')!;
}

export function normativeBandToClassification(
  band: string | null | undefined
): SsidClassificationId {
  if (!band) return 'unknown';
  const normalized = band.trim().toLowerCase();
  if (
    normalized === 'poor' ||
    normalized === 'below_average' ||
    normalized === 'average' ||
    normalized === 'good' ||
    normalized === 'excellent' ||
    normalized === 'elite'
  ) {
    return normalized;
  }
  return 'unknown';
}

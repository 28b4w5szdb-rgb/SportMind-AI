/**
 * SSDI safety layer — blocks medical diagnosis and medication advice (Phase 9.0).
 */

import type { ScientificRecommendation } from '../models/SdssRecommendation';

const MEDICAL_DISCLAIMER_EN =
  'This is decision support for sports science, not medical diagnosis. Consult a qualified clinician for medical decisions.';
const MEDICAL_DISCLAIMER_AR =
  'هذا دعم قرار علم رياضي وليس تشخيصاً طبياً. استشر مختصاً مؤهلاً للقرارات الطبية.';
const RESEARCH_DISCLAIMER_EN =
  'Research-grade interpretation — confirm with peer-reviewed sources before publication.';
const RESEARCH_DISCLAIMER_AR =
  'تفسير بمستوى بحثي — يُرجى التحقق من مصادر محكّمة قبل النشر.';

const BLOCKED_PATTERNS = [
  /\b(diagnos(e|is|ing)|prescrib(e|ing)|medication|antibiotic|surgery required)\b/i,
  /\b(تشخيص|وصف دواء|دواء|جرعة|عملية)\b/,
];

export interface SafetyCheckResult {
  safe: boolean;
  violations: string[];
  disclaimer: string;
}

export function checkQuerySafety(query: string, locale: 'en' | 'ar' | 'bilingual'): SafetyCheckResult {
  const violations: string[] = [];
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(query)) {
      violations.push(`blocked_pattern:${pattern.source}`);
    }
  }
  const disclaimer =
    locale === 'ar' ? MEDICAL_DISCLAIMER_AR : locale === 'bilingual' ? `${MEDICAL_DISCLAIMER_EN}\n${MEDICAL_DISCLAIMER_AR}` : MEDICAL_DISCLAIMER_EN;
  return { safe: violations.length === 0, violations, disclaimer };
}

export function applySafetyToRecommendations(
  recommendations: ScientificRecommendation[],
  viewerRole: import('../models/SdssRecommendation').SdssViewerRole,
  locale: 'en' | 'ar' | 'bilingual'
): ScientificRecommendation[] {
  return recommendations.map((rec) => {
    let disclaimer = rec.disclaimer ?? null;
    if (rec.category === 'sports_medicine' || viewerRole === 'doctor') {
      disclaimer = locale === 'ar' ? MEDICAL_DISCLAIMER_AR : MEDICAL_DISCLAIMER_EN;
    }
    if (rec.category === 'research_notes' || viewerRole === 'researcher') {
      disclaimer = locale === 'ar' ? RESEARCH_DISCLAIMER_AR : RESEARCH_DISCLAIMER_EN;
    }
    return { ...rec, disclaimer };
  });
}

export function globalSafetyDisclaimer(locale: 'en' | 'ar' | 'bilingual'): string {
  if (locale === 'ar') return MEDICAL_DISCLAIMER_AR;
  if (locale === 'bilingual') return `${MEDICAL_DISCLAIMER_EN}\n${MEDICAL_DISCLAIMER_AR}`;
  return MEDICAL_DISCLAIMER_EN;
}

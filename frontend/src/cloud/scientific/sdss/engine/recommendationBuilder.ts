/**
 * Recommendation builder — maps Scientific Core context to SSDI recommendations (Phase 9.0).
 * Deterministic; no LLM required.
 */

import type {
  ScientificRecommendation,
  SdssConfidenceLevel,
  SdssRecommendationBundle,
  SdssRecommendationCategory,
} from '../models/SdssRecommendation';
import { SDSS_VERSION as VERSION } from '../models/SdssRecommendation';
import type { SdssDecisionContext } from '../models/DecisionContext';
import { evidenceSummaryText } from '../context/evidenceCollector';
import { globalSafetyDisclaimer } from '../safety/safetyLayer';

function confidenceFromCompleteness(pct: number): SdssConfidenceLevel {
  if (pct >= 85) return 'very_high';
  if (pct >= 70) return 'high';
  if (pct >= 50) return 'moderate';
  if (pct >= 30) return 'low';
  return 'insufficient_evidence';
}

function baseRec(
  partial: Omit<ScientificRecommendation, 'version_metadata' | 'explainability'> & {
    explainability: Omit<ScientificRecommendation['explainability'], 'confidence'> & { confidence?: SdssConfidenceLevel };
  },
  providerId: string
): ScientificRecommendation {
  const confidence = partial.explainability.confidence ?? partial.confidence;
  return {
    ...partial,
    confidence,
    explainability: { ...partial.explainability, confidence },
    version_metadata: {
      sdss_version: VERSION,
      generated_at: new Date().toISOString(),
      provider_id: providerId,
      prompt_version: '1.0.0',
    },
  };
}

function buildReadinessRec(ctx: SdssDecisionContext, providerId: string): ScientificRecommendation | null {
  if (ctx.analytics_decision_level == null) return null;
  const conf = confidenceFromCompleteness(ctx.evidence_summary.overall_completeness_pct);
  const isAr = ctx.locale === 'ar';
  return baseRec(
    {
      id: 'sdss_readiness_1',
      category: 'readiness',
      title: isAr ? 'جاهزية التدريب' : 'Training Readiness',
      summary: isAr
        ? `مستوى القرار: ${ctx.analytics_decision_level}. النتيجة الإجمالية ${ctx.analytics_overall_score ?? '—'}.`
        : `Decision level: ${ctx.analytics_decision_level}. Overall score ${ctx.analytics_overall_score ?? '—'}.`,
      scientific_reasoning: isAr
        ? 'مشتق من محرك القرار التحليلي وSSID — لا حسابات ذكاء اصطناعي.'
        : 'Derived from analytics decision engine and SSID — no AI calculations performed.',
      recommended_action:
        ctx.analytics_decision_level === 'recovery_day'
          ? isAr
            ? 'جلسة تعافٍ خفيفة'
            : 'Light recovery session'
          : isAr
            ? 'تدريب حسب خطة الحمل'
            : 'Train per load plan',
      priority: ctx.analytics_decision_level.includes('medical') ? 'critical' : 'high',
      confidence: conf,
      evidence_level: 'field',
      affected_metrics: ['readiness', 'fatigue', 'recovery'],
      related_assessments: ctx.latest_assessments.map((a) => a.assessment_key),
      limitations: isAr ? ['لا بيانات مختبرية حديثة'] : ['No recent laboratory panel'],
      citations_placeholder: ['SportMind SSID v1', 'Analytics Decision Engine'],
      explainability: {
        why: isAr ? 'لأن مؤشرات الجاهزية والتعب تحدد تحمل الحمل اليوم.' : 'Because readiness and fatigue indicators determine today\'s load tolerance.',
        evidence_used: ctx.evidence_summary.available_sources,
        evidence_missing: ctx.evidence_summary.missing_sources,
        confidence_rationale: isAr ? `اكتمال الأدلة ${ctx.evidence_summary.overall_completeness_pct}%` : `Evidence completeness ${ctx.evidence_summary.overall_completeness_pct}%`,
        alternative_interpretation: isAr ? 'قد يتطلب تعديلاً إذا تحسنت HRV ليلاً.' : 'May shift if overnight HRV improves.',
      },
    },
    providerId
  );
}

function buildWorkloadRec(ctx: SdssDecisionContext, providerId: string): ScientificRecommendation | null {
  const acwr = ctx.training_load?.acwr;
  if (acwr == null) return null;
  const isAr = ctx.locale === 'ar';
  const elevated = acwr > 1.3;
  return baseRec(
    {
      id: 'sdss_workload_1',
      category: 'workload',
      title: isAr ? 'إدارة حمل ACWR' : 'ACWR Load Management',
      summary: isAr ? `ACWR الحالي ${acwr.toFixed(2)}` : `Current ACWR ${acwr.toFixed(2)}`,
      scientific_reasoning: isAr
        ? 'ACWR محسوب من Scientific Core — الذكاء الاصطناعي لا يعيد الحساب.'
        : 'ACWR computed by Scientific Core — AI does not recalculate.',
      recommended_action: elevated
        ? isAr
          ? 'خفّض شدة الجلسة القادمة'
          : 'Reduce next session intensity'
        : isAr
          ? 'حافظ على الحمل المخطط'
          : 'Maintain planned load',
      priority: elevated ? 'high' : 'medium',
      confidence: acwr > 0 ? 'high' : 'moderate',
      evidence_level: 'professional',
      affected_metrics: ['acwr', 'training_load'],
      related_assessments: [],
      limitations: [],
      citations_placeholder: ['Gabbett 2016 (placeholder)'],
      explainability: {
        why: elevated
          ? isAr
            ? 'ACWR فوق المنطقة الآمنة يزيد خطر الإصابة.'
            : 'ACWR above safe zone increases injury risk.'
          : isAr
            ? 'ACWR ضمن النطاق المثالي.'
            : 'ACWR within optimal range.',
        evidence_used: ['training_load'],
        evidence_missing: ctx.evidence_summary.missing_sources,
        confidence_rationale: 'ACWR from training snapshot',
      },
    },
    providerId
  );
}

function buildRecoveryRec(ctx: SdssDecisionContext, providerId: string): ScientificRecommendation | null {
  const score = ctx.recovery?.recovery_score;
  if (score == null) return null;
  const isAr = ctx.locale === 'ar';
  return baseRec(
    {
      id: 'sdss_recovery_1',
      category: 'recovery',
      title: isAr ? 'تعافٍ ونوم' : 'Recovery & Sleep',
      summary: isAr ? `درجة التعافي ${score}% · نوم ${ctx.recovery?.sleep_hours ?? '—'}h` : `Recovery score ${score}% · sleep ${ctx.recovery?.sleep_hours ?? '—'}h`,
      scientific_reasoning: isAr ? 'من سجل العافية اليومي وSSID.' : 'From daily wellness log and SSID context.',
      recommended_action:
        score < 55
          ? isAr
            ? 'جلسة تعافٍ نشط'
            : 'Active recovery session'
          : isAr
            ? 'استمر بالخطة'
            : 'Continue plan',
      priority: score < 40 ? 'high' : 'medium',
      confidence: 'moderate',
      evidence_level: 'field',
      affected_metrics: ['recovery_score', 'sleep'],
      related_assessments: [],
      limitations: [],
      citations_placeholder: [],
      explainability: {
        why: isAr ? 'التعافي المنخفض يحد من تحمل الحمل العالي.' : 'Low recovery limits high-load tolerance.',
        evidence_used: ['recovery'],
        evidence_missing: ctx.evidence_summary.missing_sources.filter((s) => s !== 'recovery'),
        confidence_rationale: 'Wellness check-in available',
      },
    },
    providerId
  );
}

function inferCategoriesFromQuery(query: string): SdssRecommendationCategory[] {
  const q = query.toLowerCase();
  const cats: SdssRecommendationCategory[] = [];
  if (/ready|readiness|جاهز/.test(q)) cats.push('readiness');
  if (/load|acwr|حمل/.test(q)) cats.push('workload', 'training');
  if (/recover|sleep|تعاف|نوم/.test(q)) cats.push('recovery', 'sleep');
  if (/injur|risk|إصاب/.test(q)) cats.push('injury_risk');
  if (/nutri|hydrat|تغذ|ماء/.test(q)) cats.push('nutrition', 'hydration');
  if (/test|assess|اختبار/.test(q)) cats.push('testing', 'monitoring');
  if (cats.length === 0) cats.push('readiness', 'training', 'monitoring');
  return cats;
}

/** Build deterministic recommendation bundle from decision context. */
export function buildRecommendationsFromContext(
  ctx: SdssDecisionContext,
  userQuery: string,
  providerId = 'mock'
): SdssRecommendationBundle {
  const categories = inferCategoriesFromQuery(userQuery);
  const candidates: (ScientificRecommendation | null)[] = [];

  if (categories.includes('readiness')) candidates.push(buildReadinessRec(ctx, providerId));
  if (categories.includes('workload') || categories.includes('training')) candidates.push(buildWorkloadRec(ctx, providerId));
  if (categories.includes('recovery') || categories.includes('sleep')) candidates.push(buildRecoveryRec(ctx, providerId));

  const recommendations = candidates.filter((r): r is ScientificRecommendation => r != null);

  if (recommendations.length === 0) {
    const isAr = ctx.locale === 'ar';
    const conf = confidenceFromCompleteness(ctx.evidence_summary.overall_completeness_pct);
    recommendations.push(
      baseRec(
        {
          id: 'sdss_monitor_1',
          category: 'monitoring',
          title: isAr ? 'متابعة المؤشرات' : 'Continue Monitoring',
          summary: isAr ? 'بيانات غير كافية لتوصية محددة.' : 'Insufficient data for a specific training change.',
          scientific_reasoning: isAr ? 'اكتمال الأدلة منخفض.' : 'Evidence completeness is limited.',
          recommended_action: isAr ? 'أكمل الفحص اليومي والاختبارات' : 'Complete daily check-in and scheduled tests',
          priority: 'medium',
          confidence: conf,
          evidence_level: 'screening',
          affected_metrics: ['evidence_completeness'],
          related_assessments: [],
          limitations: [isAr ? 'بيانات ناقصة' : 'Missing data sources'],
          citations_placeholder: [],
          explainability: {
            why: isAr ? 'لا توجد مصادر كافية لقرار دقيق.' : 'Not enough sources for a precise decision.',
            evidence_used: ctx.evidence_summary.available_sources,
            evidence_missing: ctx.evidence_summary.missing_sources,
            confidence_rationale: `Completeness ${ctx.evidence_summary.overall_completeness_pct}%`,
          },
        },
        providerId
      )
    );
  }

  return {
    recommendations,
    evidence_summary: evidenceSummaryText(ctx.evidence_summary, ctx.locale),
    safety_disclaimer: globalSafetyDisclaimer(ctx.locale),
    viewer_role: ctx.viewer_role,
    locale: ctx.locale,
  };
}

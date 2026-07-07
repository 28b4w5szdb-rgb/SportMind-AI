/**
 * Evidence-aware report language (Phase 7.0).
 *
 * Applies tier-appropriate phrasing — cautious for screening, operational for professional,
 * protocol-aware for research, clinical disclaimers for clinical tier.
 */

import type { BilingualText, EvidenceTier } from '../models/common';

const TIER_LABELS: Record<EvidenceTier, BilingualText> = {
  screening: { en: 'Screening', ar: 'فحص أولي' },
  field: { en: 'Field Assessment', ar: 'تقييم ميداني' },
  professional: { en: 'Professional Protocol', ar: 'بروتوكول احترافي' },
  research: { en: 'Research Grade', ar: 'درجة بحثية' },
  clinical: { en: 'Clinical', ar: 'سريري' },
};

const TIER_DISCLAIMERS: Record<EvidenceTier, BilingualText> = {
  screening: {
    en: 'Screening-level data — use for orientation only, not clinical or operational decisions.',
    ar: 'بيانات على مستوى الفحص الأولي — للتوجيه فقط، وليس للقرارات السريرية أو التشغيلية.',
  },
  field: {
    en: 'Field assessment data — suitable for coaching interpretation within training context.',
    ar: 'بيانات تقييم ميداني — مناسبة للتفسير التدريبي ضمن سياق التدريب.',
  },
  professional: {
    en: 'Professional protocol data — supports operational decision-making when combined with staff judgment.',
    ar: 'بيانات بروتوكول احترافي — تدعم اتخاذ القرار التشغيلي مع حكم الطاقم.',
  },
  research: {
    en: 'Research-grade evidence — includes protocol/version references; not for direct clinical application.',
    ar: 'أدلة بدرجة بحثية — تتضمن مراجع البروتوكول/الإصدار؛ غير مخصصة للتطبيق السريري المباشر.',
  },
  clinical: {
    en: 'Clinical data — for authorized medical personnel only. Not a substitute for clinical examination.',
    ar: 'بيانات سريرية — للكوادر الطبية المصرح لها فقط. لا تغني عن الفحص السريري.',
  },
};

const TIER_PREFIXES: Record<EvidenceTier, BilingualText> = {
  screening: {
    en: 'Preliminary indication:',
    ar: 'مؤشر أولي:',
  },
  field: {
    en: 'Coaching interpretation:',
    ar: 'تفسير تدريبي:',
  },
  professional: {
    en: 'Operational assessment:',
    ar: 'تقييم تشغيلي:',
  },
  research: {
    en: 'Research finding (protocol-referenced):',
    ar: 'نتيجة بحثية (مرجعية بروتوكول):',
  },
  clinical: {
    en: 'Clinical note (authorized view):',
    ar: 'ملاحظة سريرية (عرض مصرح):',
  },
};

export function evidenceTierLabel(tier: EvidenceTier): BilingualText {
  return TIER_LABELS[tier];
}

export function evidenceTierDisclaimer(tier: EvidenceTier): BilingualText {
  return TIER_DISCLAIMERS[tier];
}

export function evidenceTierPrefix(tier: EvidenceTier): BilingualText {
  return TIER_PREFIXES[tier];
}

/** Wrap statement with tier-appropriate prefix — no overclaiming. */
export function applyEvidenceLanguage(
  statement: BilingualText,
  tier: EvidenceTier
): BilingualText {
  const prefix = TIER_PREFIXES[tier];
  return {
    en: `${prefix.en} ${statement.en}`,
    ar: `${prefix.ar} ${statement.ar}`,
  };
}

/** Resolve dominant evidence tier from a list — uses highest rigor present. */
export function resolvePrimaryEvidenceTier(tiers: EvidenceTier[]): EvidenceTier {
  const order: EvidenceTier[] = ['clinical', 'research', 'professional', 'field', 'screening'];
  for (const tier of order) {
    if (tiers.includes(tier)) return tier;
  }
  return 'screening';
}

/** Build evidence summary block for report header/footer. */
export function buildEvidenceSummary(
  tiers: EvidenceTier[],
  sourceCount: number,
  protocolRefs: string[] = []
): import('../models/report').ReportEvidenceSummary {
  const primary = resolvePrimaryEvidenceTier(tiers);
  return {
    primary_tier: primary,
    tier_label: evidenceTierLabel(primary),
    disclaimer: evidenceTierDisclaimer(primary),
    source_count: sourceCount,
    protocol_refs: protocolRefs,
  };
}

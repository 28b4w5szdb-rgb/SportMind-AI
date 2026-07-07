/**
 * Map scientific report sections to legacy MockReportSections (Phase 7.0).
 */

import type { MockReportSections } from '@/src/data/mock/types';
import type { ScientificReport, ScientificReportSection } from '@/src/cloud/scientific/models/report';

function pickBody(section: ScientificReportSection | undefined, lang: 'en' | 'ar'): string {
  if (!section || section.is_empty) return '';
  return lang === 'ar' ? section.body.ar : section.body.en;
}

function findSection(report: ScientificReport, id: string): ScientificReportSection | undefined {
  return report.sections.find((s) => s.section_id === id);
}

/** Convert structured scientific report to legacy mock sections for backward-compatible save/preview. */
export function scientificReportToMockSections(
  report: ScientificReport,
  lang: 'en' | 'ar' = 'en'
): MockReportSections {
  const get = (id: string) => pickBody(findSection(report, id), lang);

  const exec = get('executive_summary');
  const profile = get('athlete_profile');
  const passport = get('passport_summary');
  const perf = get('performance_summary');
  const assessment = get('assessment_results');
  const normative = get('normative_comparison');
  const ssid = get('ssid_interpretation');
  const timeline = get('scientific_timeline');
  const recovery = get('recovery_summary');
  const load = get('training_load_summary');
  const injury = get('injury_medical_summary');
  const nutrition = get('nutrition_summary');
  const wearables = get('wearables_summary');
  const recs = get('recommendations');
  const evidence = get('evidence_limitations');
  const refs = get('references');

  return {
    athlete_summary: profile || passport || exec,
    performance_tests: [assessment, perf].filter(Boolean).join('\n\n'),
    ai_insights: [exec, timeline, evidence].filter(Boolean).join('\n\n'),
    recommendations: recs,
    overall_score: perf.split('\n')[0] ?? undefined,
    kpi_summary: passport || exec,
    ssid_interpretation: [normative, ssid].filter(Boolean).join('\n\n') || undefined,
    ssid_decision: ssid || undefined,
    ssid_recommendations: recs || undefined,
    ssid_reference: refs || undefined,
    injury_summary: injury || undefined,
    rtp_status: injury || undefined,
    training_summary: [recovery, load].filter(Boolean).join('\n\n') || undefined,
    training_compliance_summary: load || undefined,
    nutrition_summary: nutrition || undefined,
    wearable_summary: wearables || undefined,
    decision_support: recs || undefined,
  };
}

/** Executive summary text for report list card. */
export function scientificReportSummary(report: ScientificReport, lang: 'en' | 'ar' = 'en'): string {
  const exec = findSection(report, 'executive_summary');
  if (exec && !exec.is_empty) return pickBody(exec, lang).slice(0, 200);
  return lang === 'ar' ? report.title.ar : report.title.en;
}

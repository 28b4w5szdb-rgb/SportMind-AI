/**
 * Scientific Report builder (Phase 7.0).
 *
 * Deterministic assembly from passport, timeline, and assessment artifacts.
 * No AI text generation — all content derived from source summaries.
 */

import type { BilingualText, EvidenceTier } from '../models/common';
import type { AthletePassport, PassportSectionSummary } from '../models/passport/AthletePassport';
import type { AthleteScientificTimeline, ScientificTimelineEvent } from '../models/timeline/ScientificTimeline';
import type { AssessmentSession } from '../models/session';
import {
  DEFAULT_SECTIONS_BY_REPORT_TYPE,
  REPORT_BUILDER_VERSION,
  REPORT_SCHEMA_VERSION,
  type ReportBuildInput,
  type ReportSourceReference,
  type ReportViewerRole,
  type ScientificReport,
  type ScientificReportSection,
  type ScientificReportSectionId,
  type ScientificReportType,
} from '../models/report';

import {
  applyEvidenceLanguage,
  buildEvidenceSummary,
  evidenceTierDisclaimer,
  resolvePrimaryEvidenceTier,
} from './evidenceLanguage';

function bi(en: string, ar: string): BilingualText {
  return { en, ar };
}

function ref(collection: string, documentId?: string | null, label?: string): ReportSourceReference {
  return { collection, document_id: documentId ?? null, label: label ?? null };
}

function sectionTitle(id: ScientificReportSectionId): BilingualText {
  const titles: Record<ScientificReportSectionId, BilingualText> = {
    cover: bi('Cover', 'الغلاف'),
    executive_summary: bi('Executive Summary', 'الملخص التنفيذي'),
    athlete_profile: bi('Athlete Profile', 'ملف اللاعب'),
    passport_summary: bi('Scientific Passport Summary', 'ملخص الجواز العلمي'),
    performance_summary: bi('Performance Summary', 'ملخص الأداء'),
    assessment_results: bi('Assessment Results', 'نتائج التقييم'),
    normative_comparison: bi('Normative Comparison', 'المقارنة المعيارية'),
    ssid_interpretation: bi('SSID Interpretation', 'تفسير SSID'),
    scientific_timeline: bi('Scientific Timeline', 'الخط الزمني العلمي'),
    recovery_summary: bi('Recovery Summary', 'ملخص التعافي'),
    training_load_summary: bi('Training Load Summary', 'ملخص حمل التدريب'),
    injury_medical_summary: bi('Injury / Medical Summary', 'ملخص الإصابة / الطبي'),
    nutrition_summary: bi('Nutrition Summary', 'ملخص التغذية'),
    wearables_summary: bi('Wearables Summary', 'ملخص الأجهزة القابلة للارتداء'),
    recommendations: bi('Recommendations', 'التوصيات'),
    evidence_limitations: bi('Evidence & Limitations', 'الأدلة والقيود'),
    references: bi('References', 'المراجع'),
    signature: bi('Signature', 'التوقيع'),
  };
  return titles[id];
}

function passportFieldText(section: PassportSectionSummary | undefined, lang: 'en' | 'ar'): string {
  if (!section || section.is_missing) return '';
  return section.summary_fields
    .map((f) => `${f.label}: ${f.display_value ?? f.value ?? '—'}`)
    .join('\n');
}

function formatPassportSection(section: PassportSectionSummary | undefined): BilingualText {
  if (!section || section.is_missing) {
    return bi('No data available for this section.', 'لا تتوفر بيانات لهذا القسم.');
  }
  const lines = section.summary_fields.map(
    (f) => `${f.label}: ${f.display_value ?? f.value ?? '—'}${f.unit ? ` ${f.unit}` : ''}`
  );
  const body = lines.join('\n') || section.title;
  return bi(body, body);
}

function filterTimelineEvents(
  timeline: AthleteScientificTimeline | null | undefined,
  dateFrom: string,
  dateTo: string
): ScientificTimelineEvent[] {
  if (!timeline) return [];
  return timeline.events.filter((e) => {
    const d = e.occurred_at.slice(0, 10);
    return d >= dateFrom && d <= dateTo;
  });
}

function filterSessions(
  sessions: AssessmentSession[] | undefined,
  dateFrom: string,
  dateTo: string
): AssessmentSession[] {
  if (!sessions) return [];
  return sessions.filter((s) => {
    const d = (s.conducted_at ?? s.created_at ?? '').slice(0, 10);
    return d >= dateFrom && d <= dateTo;
  });
}

function roleVisibility(role: ReportViewerRole): import('../models/report').ReportVisibilityLevel {
  return role;
}

function shouldIncludeSection(
  sectionId: ScientificReportSectionId,
  role: ReportViewerRole,
  reportType: ScientificReportType
): boolean {
  const clinicalOnly: ScientificReportSectionId[] = ['injury_medical_summary'];
  const researchHidden: ScientificReportSectionId[] = ['athlete_profile'];
  const coachHidden: ScientificReportSectionId[] = ['normative_comparison', 'references'];

  if (role === 'coach' && coachHidden.includes(sectionId)) return false;
  if (role === 'research' && researchHidden.includes(sectionId) && reportType === 'research') return false;
  if (clinicalOnly.includes(sectionId) && role !== 'clinical' && role !== 'sports_scientist') {
    if (reportType !== 'sports_medicine') return false;
    return role === 'coach'; // coach gets limited injury summary in sports_medicine type
  }
  return true;
}

function buildCoverSection(
  input: ReportBuildInput,
  order: number,
  tier: EvidenceTier
): ScientificReportSection {
  const { context, sources } = input;
  const name = sources.athleteDisplayName ?? context.athleteId ?? 'Athlete';
  const typeLabel = context.reportType.replace('_', ' ');
  const body = bi(
    `${context.title?.en ?? 'Scientific Report'}\n${name}\n${context.dateRange.from} → ${context.dateRange.to}\nReport type: ${typeLabel}`,
    `${context.title?.ar ?? 'تقرير علمي'}\n${name}\n${context.dateRange.from} → ${context.dateRange.to}\nنوع التقرير: ${typeLabel}`
  );
  return {
    section_id: 'cover',
    title: sectionTitle('cover'),
    body,
    bullet_points: [],
    source_references: [ref('scientific_reports', context.athleteId, 'Report cover')],
    evidence_tier: tier,
    visibility: roleVisibility(context.viewerRole),
    is_empty: false,
    order,
  };
}

function buildExecutiveSummary(
  input: ReportBuildInput,
  passport: AthletePassport | null | undefined,
  timelineEvents: ScientificTimelineEvent[],
  order: number,
  tier: EvidenceTier
): ScientificReportSection {
  const perf = passport?.sections.performance;
  const readiness = passport?.sections.readiness;
  const scoreField = perf?.summary_fields.find((f) => f.key === 'overall_score');
  const readinessField = readiness?.summary_fields.find((f) => f.key === 'readiness_score');

  const score = scoreField?.display_value ?? scoreField?.value ?? '—';
  const readinessVal = readinessField?.display_value ?? readinessField?.value ?? '—';
  const eventCount = timelineEvents.length;

  const statement = bi(
    `Overall performance score: ${score}. Readiness: ${readinessVal}. ${eventCount} scientific events in the selected period.`,
    `درجة الأداء الإجمالية: ${score}. الجاهزية: ${readinessVal}. ${eventCount} حدث علمي في الفترة المحددة.`
  );

  const body = applyEvidenceLanguage(statement, tier);
  const isEmpty = !passport && timelineEvents.length === 0;

  return {
    section_id: 'executive_summary',
    title: sectionTitle('executive_summary'),
    body: isEmpty ? bi('Insufficient data for executive summary.', 'بيانات غير كافية للملخص التنفيذي.') : body,
    bullet_points: [],
    source_references: [
      ref('athlete_passports', passport?.passport_id),
      ref('scientific_timelines', input.sources.timeline?.timeline_id),
    ],
    evidence_tier: tier,
    visibility: roleVisibility(input.context.viewerRole),
    is_empty: isEmpty,
    order,
  };
}

function buildAthleteProfile(
  passport: AthletePassport | null | undefined,
  displayName: string | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const identity = passport?.sections.identity;
  const sport = passport?.sections.sport_profile;
  const isResearch = role === 'research';

  let body: BilingualText;
  if (isResearch) {
    body = bi(
      `De-identified athlete profile. Sport: ${sport?.summary_fields.find((f) => f.key === 'sport')?.display_value ?? '—'}.`,
      `ملف لاعب مجهول الهوية. الرياضة: ${sport?.summary_fields.find((f) => f.key === 'sport')?.display_value ?? '—'}.`
    );
  } else {
    const name = displayName ?? identity?.summary_fields.find((f) => f.key === 'full_name')?.display_value ?? '—';
    const position = sport?.summary_fields.find((f) => f.key === 'position')?.display_value ?? '—';
    body = bi(`${name}\nPosition: ${position}`, `${name}\nالمركز: ${position}`);
    if (identity && !identity.is_missing) {
      const extra = passportFieldText(identity, 'en');
      if (extra) body = bi(`${body.en}\n${extra}`, `${body.ar}\n${extra}`);
    }
  }

  return {
    section_id: 'athlete_profile',
    title: sectionTitle('athlete_profile'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'Identity')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: !passport && !displayName,
    order,
  };
}

function buildPassportSummary(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  if (!passport) {
    return emptySection('passport_summary', order, tier, role);
  }

  const sectionIds = ['identity', 'performance', 'readiness', 'recovery', 'training_load'] as const;
  const bullets: BilingualText[] = [];
  const refs: ReportSourceReference[] = [ref('athlete_passports', passport.passport_id)];

  for (const sid of sectionIds) {
    const sec = passport.sections[sid];
    if (!sec || sec.is_missing) continue;
    const headline = sec.summary_fields[0];
    if (headline) {
      bullets.push(
        bi(
          `${sec.title}: ${headline.display_value ?? headline.value ?? '—'}`,
          `${sec.title}: ${headline.display_value ?? headline.value ?? '—'}`
        )
      );
    }
  }

  const body = bi(
    bullets.map((b) => b.en).join('\n') || 'Passport sections summarized above.',
    bullets.map((b) => b.ar).join('\n') || 'أقسام الجواز موجزة أعلاه.'
  );

  return {
    section_id: 'passport_summary',
    title: sectionTitle('passport_summary'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: bullets,
    source_references: refs,
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: bullets.length === 0,
    order,
  };
}

function buildPerformanceSummary(
  passport: AthletePassport | null | undefined,
  sessions: AssessmentSession[],
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const perf = passport?.sections.performance;
  const lines: string[] = [];

  if (perf && !perf.is_missing) {
    for (const f of perf.summary_fields.slice(0, 6)) {
      lines.push(`${f.label}: ${f.display_value ?? f.value ?? '—'}`);
    }
  }
  if (sessions.length > 0) {
    lines.push(`Assessment sessions in period: ${sessions.length}`);
  }

  const bodyText = lines.join('\n') || 'No performance data in selected range.';
  const body = bi(bodyText, bodyText);

  return {
    section_id: 'performance_summary',
    title: sectionTitle('performance_summary'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [
      ref('athlete_passports', passport?.passport_id, 'Performance'),
      ...sessions.slice(0, 3).map((s) => ref('assessment_sessions', s.session_id)),
    ],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: lines.length === 0,
    order,
  };
}

function buildAssessmentResults(
  sessions: AssessmentSession[],
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const bullets: BilingualText[] = sessions.slice(0, 10).map((s) => {
    const label = s.assessment_definition_key ?? 'Assessment';
    const date = (s.conducted_at ?? s.created_at ?? '').slice(0, 10);
    return bi(`${date} — ${label} (${s.status})`, `${date} — ${label} (${s.status})`);
  });

  const body = bi(
    bullets.map((b) => b.en).join('\n') || 'No assessment sessions in selected date range.',
    bullets.map((b) => b.ar).join('\n') || 'لا توجد جلسات تقييم في النطاق الزمني المحدد.'
  );

  return {
    section_id: 'assessment_results',
    title: sectionTitle('assessment_results'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: bullets,
    source_references: sessions.map((s) => ref('assessment_sessions', s.session_id)),
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: sessions.length === 0,
    order,
  };
}

function buildNormativeComparison(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const ssid = passport?.sections.ssid_insights;
  const body = formatPassportSection(ssid);
  const isEmpty = !ssid || ssid.is_missing;

  return {
    section_id: 'normative_comparison',
    title: sectionTitle('normative_comparison'),
    body: isEmpty ? bi('Normative comparison data not available.', 'بيانات المقارنة المعيارية غير متوفرة.') : applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'SSID insights')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: isEmpty,
    order,
  };
}

function buildSsidInterpretation(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const ssid = passport?.sections.ssid_insights;
  const isEmpty = !ssid || ssid.is_missing;
  const body = isEmpty
    ? bi('SSID interpretation not available for this period.', 'تفسير SSID غير متوفر لهذه الفترة.')
    : formatPassportSection(ssid);

  return {
    section_id: 'ssid_interpretation',
    title: sectionTitle('ssid_interpretation'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'SSID')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: isEmpty,
    order,
  };
}

function buildScientificTimeline(
  events: ScientificTimelineEvent[],
  timeline: AthleteScientificTimeline | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const bullets: BilingualText[] = events.slice(0, 12).map((e) =>
    bi(`${e.occurred_at.slice(0, 10)} — ${e.title}: ${e.summary}`, `${e.occurred_at.slice(0, 10)} — ${e.title}: ${e.summary}`)
  );

  const body = bi(
    bullets.map((b) => b.en).join('\n') || 'No timeline events in selected range.',
    bullets.map((b) => b.ar).join('\n') || 'لا توجد أحداث في الخط الزمني للنطاق المحدد.'
  );

  return {
    section_id: 'scientific_timeline',
    title: sectionTitle('scientific_timeline'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: bullets,
    source_references: [ref('scientific_timelines', timeline?.timeline_id)],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: events.length === 0,
    order,
  };
}

function buildRecoverySummary(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const recovery = passport?.sections.recovery;
  const readiness = passport?.sections.readiness;
  const parts: BilingualText[] = [];
  if (recovery && !recovery.is_missing) parts.push(formatPassportSection(recovery));
  if (readiness && !readiness.is_missing) parts.push(formatPassportSection(readiness));

  const body = bi(
    parts.map((p) => p.en).join('\n\n') || 'Recovery data not available.',
    parts.map((p) => p.ar).join('\n\n') || 'بيانات التعافي غير متوفرة.'
  );

  return {
    section_id: 'recovery_summary',
    title: sectionTitle('recovery_summary'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'Recovery')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: parts.length === 0,
    order,
  };
}

function buildTrainingLoadSummary(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const load = passport?.sections.training_load;
  const isEmpty = !load || load.is_missing;
  const body = isEmpty ? bi('Training load data not available.', 'بيانات حمل التدريب غير متوفرة.') : formatPassportSection(load);

  return {
    section_id: 'training_load_summary',
    title: sectionTitle('training_load_summary'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'Training load')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: isEmpty,
    order,
  };
}

function buildInjuryMedicalSummary(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const injury = passport?.sections.injury;
  const medical = passport?.sections.medical;
  const isCoach = role === 'coach';

  let body: BilingualText;
  if (isCoach && injury && !injury.is_missing) {
    const safe = injury.summary_fields.filter((f) =>
      ['injury_status', 'availability', 'rtp_phase', 'active_injuries'].includes(f.key)
    );
    body = bi(
      safe.map((f) => `${f.label}: ${f.display_value ?? f.value}`).join('\n') || 'Limited injury status available.',
      safe.map((f) => `${f.label}: ${f.display_value ?? f.value}`).join('\n') || 'حالة إصابة محدودة متوفرة.'
    );
  } else if (!isCoach) {
    const parts: BilingualText[] = [];
    if (injury && !injury.is_missing) parts.push(formatPassportSection(injury));
    if (medical && !medical.is_missing) parts.push(formatPassportSection(medical));
    body = bi(
      parts.map((p) => p.en).join('\n\n') || 'No injury/medical data.',
      parts.map((p) => p.ar).join('\n\n') || 'لا توجد بيانات إصابة/طبية.'
    );
  } else {
    body = bi('Injury summary restricted for this role.', 'ملخص الإصابة مقيد لهذا الدور.');
  }

  const clinicalDisclaimer = evidenceTierDisclaimer('clinical');
  const finalBody: BilingualText = {
    en: `${body.en}\n\n${clinicalDisclaimer.en}`,
    ar: `${body.ar}\n\n${clinicalDisclaimer.ar}`,
  };

  return {
    section_id: 'injury_medical_summary',
    title: sectionTitle('injury_medical_summary'),
    body: applyEvidenceLanguage(finalBody, tier === 'screening' ? 'clinical' : tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'Injury/Medical')],
    evidence_tier: 'clinical',
    visibility: roleVisibility(role),
    is_empty: !injury && !medical,
    order,
  };
}

function buildNutritionSummary(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const nutrition = passport?.sections.nutrition;
  const isEmpty = !nutrition || nutrition.is_missing;
  const body = isEmpty ? bi('Nutrition data not available.', 'بيانات التغذية غير متوفرة.') : formatPassportSection(nutrition);

  return {
    section_id: 'nutrition_summary',
    title: sectionTitle('nutrition_summary'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'Nutrition')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: isEmpty,
    order,
  };
}

function buildWearablesSummary(
  passport: AthletePassport | null | undefined,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const wearable = passport?.sections.wearable;
  const isEmpty = !wearable || wearable.is_missing;
  const body = isEmpty ? bi('Wearables data not available.', 'بيانات الأجهزة غير متوفرة.') : formatPassportSection(wearable);

  return {
    section_id: 'wearables_summary',
    title: sectionTitle('wearables_summary'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: [],
    source_references: [ref('athlete_passports', passport?.passport_id, 'Wearables')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: isEmpty,
    order,
  };
}

function buildRecommendations(
  passport: AthletePassport | null | undefined,
  role: ReportViewerRole,
  order: number,
  tier: EvidenceTier
): ScientificReportSection {
  const isCoach = role === 'coach';
  const perf = passport?.sections.performance;
  const readiness = passport?.sections.readiness;

  const bullets: BilingualText[] = [];
  if (isCoach) {
    if (readiness && !readiness.is_missing) {
      bullets.push(bi('Monitor readiness trends before high-intensity sessions.', 'راقب اتجاهات الجاهزية قبل جلسات الشدة العالية.'));
    }
    bullets.push(bi('Review training load balance weekly with performance staff.', 'راجع توازن حمل التدريب أسبوعياً مع طاقم الأداء.'));
  } else {
    if (perf && !perf.is_missing) {
      bullets.push(bi('Continue structured testing cadence per passport performance metrics.', 'استمر في إيقاع الاختبار المنظم وفق مقاييس الأداء في الجواز.'));
    }
    bullets.push(bi('Cross-reference normative profiles before interpreting SSID outputs.', 'قارن مع الملفات المعيارية قبل تفسير مخرجات SSID.'));
    if (role === 'clinical') {
      bullets.push(bi('Coordinate RTP decisions with medical clearance protocols.', 'نسّق قرارات العودة للعب مع بروتوكولات التصريح الطبي.'));
    }
    if (role === 'research') {
      bullets.push(bi('Export de-identified datasets only through approved research pipeline.', 'صدّر مجموعات البيانات المجهولة الهوية فقط عبر مسار البحث المعتمد.'));
    }
  }

  const body = bi(bullets.map((b) => `• ${b.en}`).join('\n'), bullets.map((b) => `• ${b.ar}`).join('\n'));

  return {
    section_id: 'recommendations',
    title: sectionTitle('recommendations'),
    body: applyEvidenceLanguage(body, tier),
    bullet_points: bullets,
    source_references: [ref('athlete_passports', passport?.passport_id, 'Derived recommendations')],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: bullets.length === 0,
    order,
  };
}

function buildEvidenceLimitations(
  tiers: EvidenceTier[],
  order: number,
  role: ReportViewerRole
): ScientificReportSection {
  const primary = resolvePrimaryEvidenceTier(tiers);
  const disclaimer = evidenceTierDisclaimer(primary);
  const bullets: BilingualText[] = [
    disclaimer,
    bi(
      'This report is an output layer — source collections remain authoritative.',
      'هذا التقرير طبقة مخرجات — مجموعات المصدر تبقى المرجعية.'
    ),
    bi('PDF export is deferred — preview reflects structured scientific content only.', 'تصدير PDF مؤجل — المعاينة تعكس المحتوى العلمي المنظم فقط.'),
  ];

  const body = bi(bullets.map((b) => b.en).join('\n\n'), bullets.map((b) => b.ar).join('\n\n'));

  return {
    section_id: 'evidence_limitations',
    title: sectionTitle('evidence_limitations'),
    body,
    bullet_points: bullets,
    source_references: [ref('catalog/evidence_tiers', primary)],
    evidence_tier: primary,
    visibility: roleVisibility(role),
    is_empty: false,
    order,
  };
}

function buildReferences(
  passport: AthletePassport | null | undefined,
  sessions: AssessmentSession[],
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const refs: BilingualText[] = [];
  if (passport) {
    refs.push(bi(`Passport ${passport.passport_id} (schema ${passport.version_metadata.passport_schema_version})`, `جواز ${passport.passport_id}`));
  }
  for (const s of sessions.slice(0, 5)) {
    refs.push(bi(`Session ${s.session_id} — ${s.assessment_definition_key ?? 'assessment'}`, `جلسة ${s.session_id}`));
  }

  const body = bi(
    refs.map((r) => r.en).join('\n') || 'No references available.',
    refs.map((r) => r.ar).join('\n') || 'لا توجد مراجع.'
  );

  return {
    section_id: 'references',
    title: sectionTitle('references'),
    body,
    bullet_points: refs,
    source_references: sessions.map((s) => ref('assessment_sessions', s.session_id)),
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: refs.length === 0,
    order,
  };
}

function buildSignature(
  generatedBy: string,
  generatedAt: string,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  const body = bi(
    `Generated by: ${generatedBy}\nDate: ${generatedAt}\nSportMind AI Scientific Reporting Engine v${REPORT_BUILDER_VERSION}`,
    `أعده: ${generatedBy}\nالتاريخ: ${generatedAt}\nمحرك التقارير العلمية SportMind AI v${REPORT_BUILDER_VERSION}`
  );

  return {
    section_id: 'signature',
    title: sectionTitle('signature'),
    body,
    bullet_points: [],
    source_references: [],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: false,
    order,
  };
}

function emptySection(
  id: ScientificReportSectionId,
  order: number,
  tier: EvidenceTier,
  role: ReportViewerRole
): ScientificReportSection {
  return {
    section_id: id,
    title: sectionTitle(id),
    body: bi('Section not available.', 'القسم غير متوفر.'),
    bullet_points: [],
    source_references: [],
    evidence_tier: tier,
    visibility: roleVisibility(role),
    is_empty: true,
    order,
  };
}

function buildSection(
  sectionId: ScientificReportSectionId,
  input: ReportBuildInput,
  passport: AthletePassport | null | undefined,
  timelineEvents: ScientificTimelineEvent[],
  sessions: AssessmentSession[],
  order: number,
  tier: EvidenceTier
): ScientificReportSection | null {
  const { context, sources } = input;
  const role = context.viewerRole;

  if (!shouldIncludeSection(sectionId, role, context.reportType)) return null;

  switch (sectionId) {
    case 'cover':
      return buildCoverSection(input, order, tier);
    case 'executive_summary':
      return buildExecutiveSummary(input, passport, timelineEvents, order, tier);
    case 'athlete_profile':
      return buildAthleteProfile(passport, sources.athleteDisplayName, order, tier, role);
    case 'passport_summary':
      return buildPassportSummary(passport, order, tier, role);
    case 'performance_summary':
      return buildPerformanceSummary(passport, sessions, order, tier, role);
    case 'assessment_results':
      return buildAssessmentResults(sessions, order, tier, role);
    case 'normative_comparison':
      return buildNormativeComparison(passport, order, tier, role);
    case 'ssid_interpretation':
      return buildSsidInterpretation(passport, order, tier, role);
    case 'scientific_timeline':
      return buildScientificTimeline(timelineEvents, sources.timeline, order, tier, role);
    case 'recovery_summary':
      return buildRecoverySummary(passport, order, tier, role);
    case 'training_load_summary':
      return buildTrainingLoadSummary(passport, order, tier, role);
    case 'injury_medical_summary':
      return buildInjuryMedicalSummary(passport, order, tier, role);
    case 'nutrition_summary':
      return buildNutritionSummary(passport, order, tier, role);
    case 'wearables_summary':
      return buildWearablesSummary(passport, order, tier, role);
    case 'recommendations':
      return buildRecommendations(passport, role, order, tier);
    case 'evidence_limitations':
      return buildEvidenceLimitations([tier, ...timelineEvents.map((e) => e.evidence_tier)], order, role);
    case 'references':
      return buildReferences(passport, sessions, order, tier, role);
    case 'signature':
      return buildSignature(context.generatedBy, new Date().toISOString(), order, tier, role);
    default:
      return null;
  }
}

const DEFAULT_TITLES: Record<ScientificReportType, BilingualText> = {
  athlete: bi('Athlete Scientific Report', 'تقرير علمي للاعب'),
  team: bi('Team Scientific Report', 'تقرير علمي للفريق'),
  performance: bi('Performance Scientific Report', 'تقرير علمي للأداء'),
  recovery: bi('Recovery Scientific Report', 'تقرير علمي للتعافي'),
  sports_medicine: bi('Sports Medicine Scientific Report', 'تقرير علمي للطب الرياضي'),
  research: bi('Research Scientific Report', 'تقرير علمي للبحث'),
};

/** Map UI report builder type ids to scientific report types. */
export function mapBuilderTypeToScientificType(
  type: string
): ScientificReportType | null {
  const map: Record<string, ScientificReportType> = {
    athlete: 'athlete',
    team: 'team',
    performance: 'performance',
    recovery: 'recovery',
    sports_medicine: 'sports_medicine',
    research: 'research',
  };
  return map[type] ?? null;
}

/** Assemble a deterministic scientific report from workspace artifacts. */
export function buildScientificReport(input: ReportBuildInput): ScientificReport {
  const { context, sources } = input;
  const passport = sources.passport ?? null;
  const timelineEvents = filterTimelineEvents(sources.timeline, context.dateRange.from, context.dateRange.to);
  const sessions = filterSessions(sources.sessions, context.dateRange.from, context.dateRange.to);

  const tiers: EvidenceTier[] = [
    'field',
    ...timelineEvents.map((e) => e.evidence_tier),
  ];
  const primaryTier = resolvePrimaryEvidenceTier(tiers);

  const sectionOrder =
    context.sectionOrder ?? DEFAULT_SECTIONS_BY_REPORT_TYPE[context.reportType];

  const sections: ScientificReportSection[] = [];
  let order = 0;
  for (const sectionId of sectionOrder) {
    const built = buildSection(sectionId, input, passport, timelineEvents, sessions, order, primaryTier);
    if (built) {
      sections.push(built);
      order += 1;
    }
  }

  const allRefs: ReportSourceReference[] = [];
  for (const s of sections) {
    allRefs.push(...s.source_references);
  }

  const reportId = `report_${context.athleteId ?? context.teamId ?? 'org'}_${Date.now()}`;
  const title = context.title ?? DEFAULT_TITLES[context.reportType];

  return {
    report_id: reportId,
    report_type: context.reportType,
    organization_id: context.orgId,
    athlete_id: context.athleteId ?? null,
    team_id: context.teamId ?? null,
    date_range: context.dateRange,
    title,
    sections,
    visibility_profile: roleVisibility(context.viewerRole),
    evidence_summary: buildEvidenceSummary(tiers, allRefs.length, sessions.map((s) => s.assessment_definition_key ?? '').filter(Boolean)),
    source_references: allRefs,
    generated_at: new Date().toISOString(),
    generated_by: context.generatedBy,
    version_metadata: {
      report_schema_version: REPORT_SCHEMA_VERSION,
      builder_version: REPORT_BUILDER_VERSION,
      sections_included: sections.filter((s) => !s.is_empty).length,
      sections_empty: sections.filter((s) => s.is_empty).length,
      passport_builder_version: passport?.version_metadata.builder_version ?? null,
      timeline_builder_version: sources.timeline?.version_metadata.builder_version ?? null,
    },
    viewer_role: context.viewerRole,
  };
}

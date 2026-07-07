/**
 * Athlete Digital Passport builder (Phase 6D.1).
 *
 * Assembles summary sections from available source data.
 * Does not duplicate raw data — only summary values + source references.
 */

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockPerformanceTest } from '@/src/data/mock/types';

import {
  ALL_PASSPORT_SECTION_IDS,
  PASSPORT_BUILDER_VERSION,
  PASSPORT_SCHEMA_VERSION,
  type AthletePassport,
  type PassportDataConfidence,
  type PassportSectionId,
  type PassportSectionSummary,
  type PassportSourceReference,
  type PassportSummaryField,
  type PassportViewerRole,
  type PassportVisibilityLevel,
} from '../models/passport/AthletePassport';
import type { PassportBuildContext, PassportBuildSources } from '../models/passport/PassportBuildInput';

function field(
  key: string,
  label: string,
  value: string | number | boolean | null,
  options?: { unit?: string | null; display_value?: string | null }
): PassportSummaryField {
  return {
    key,
    label,
    value,
    unit: options?.unit ?? null,
    display_value: options?.display_value ?? (value != null ? String(value) : null),
  };
}

function ref(collection: string, documentId?: string | null, subcollection?: string | null, label?: string): PassportSourceReference {
  return { collection, document_id: documentId ?? null, subcollection: subcollection ?? null, label: label ?? null };
}

function missingSection(
  sectionId: PassportSectionId,
  title: string,
  visibility: PassportVisibilityLevel,
  reason: string
): PassportSectionSummary {
  return {
    section_id: sectionId,
    title,
    summary_fields: [],
    source_references: [],
    last_updated: null,
    confidence: 'unavailable',
    visibility,
    is_missing: true,
    missing_reason: reason,
    collapsed_by_default: true,
  };
}

function section(
  sectionId: PassportSectionId,
  title: string,
  summaryFields: PassportSummaryField[],
  sourceRefs: PassportSourceReference[],
  options: {
    lastUpdated?: string | null;
    confidence?: PassportDataConfidence;
    visibility?: PassportVisibilityLevel;
    collapsedByDefault?: boolean;
  } = {}
): PassportSectionSummary {
  const isMissing = summaryFields.length === 0;
  return {
    section_id: sectionId,
    title,
    summary_fields: summaryFields,
    source_references: sourceRefs,
    last_updated: options.lastUpdated ?? null,
    confidence: isMissing ? 'unavailable' : (options.confidence ?? 'medium'),
    visibility: options.visibility ?? 'coach',
    is_missing: isMissing,
    missing_reason: isMissing ? 'No source data available' : null,
    collapsed_by_default: options.collapsedByDefault ?? false,
  };
}

function latestTest(tests: MockPerformanceTest[]): MockPerformanceTest | undefined {
  return [...tests].sort((a, b) => b.date.localeCompare(a.date))[0];
}

function kpiValue(analytics: AthleteAnalyticsSnapshot | null | undefined, id: string): number | null {
  const kpi = analytics?.kpis.find((k) => k.id === id);
  if (!kpi) return null;
  const num = parseFloat(String(kpi.displayValue).replace(/[^\d.-]/g, ''));
  return Number.isFinite(num) ? num : null;
}

function moduleScore(analytics: AthleteAnalyticsSnapshot | null | undefined, moduleId: string): number | null {
  const mod = analytics?.overall.modules.find((m) => m.id === moduleId);
  return mod?.score ?? null;
}

function buildIdentitySection(sources: PassportBuildSources): PassportSectionSummary {
  const { athlete } = sources;
  const fields: PassportSummaryField[] = [
    field('full_name', 'Full name', `${athlete.first_name} ${athlete.last_name}`),
    field('position', 'Position', athlete.position ?? null),
    field('status', 'Status', athlete.status ?? null),
    field('nationality', 'Nationality', athlete.nationality ?? null),
  ];
  if (athlete.date_of_birth) {
    fields.push(field('date_of_birth', 'Date of birth', athlete.date_of_birth));
  }
  return section('identity', 'Identity', fields, [
    ref('athletes', athlete.id, null, 'Athlete profile'),
  ], {
    lastUpdated: null,
    confidence: 'high',
    visibility: 'coach',
  });
}

function buildSportProfileSection(sources: PassportBuildSources): PassportSectionSummary {
  const { athlete, teamSport } = sources;
  const fields: PassportSummaryField[] = [
    field('sport', 'Sport', teamSport ?? athlete.sport ?? null),
    field('position', 'Position', athlete.position ?? null),
    field('team', 'Team', athlete.team_name ?? null),
  ];
  if (athlete.jersey_number != null) {
    fields.push(field('jersey_number', 'Jersey', athlete.jersey_number));
  }
  return section('sport_profile', 'Sport profile', fields, [
    ref('athletes', athlete.id, null, 'Athlete profile'),
    ref('teams', null, null, 'Team assignment'),
  ], { confidence: athlete.sport || teamSport ? 'high' : 'low', visibility: 'coach' });
}

function buildAnthropometrySection(sources: PassportBuildSources): PassportSectionSummary {
  const { athlete } = sources;
  const fields: PassportSummaryField[] = [];
  if (athlete.height_cm != null) fields.push(field('height_cm', 'Height', athlete.height_cm, { unit: 'cm' }));
  if (athlete.weight_kg != null) fields.push(field('weight_kg', 'Weight', athlete.weight_kg, { unit: 'kg' }));
  if (athlete.height_cm && athlete.weight_kg) {
    const bmi = athlete.weight_kg / ((athlete.height_cm / 100) ** 2);
    fields.push(field('bmi', 'BMI', Math.round(bmi * 10) / 10));
  }
  if (fields.length === 0) {
    return missingSection('anthropometry', 'Anthropometry', 'coach', 'Height and weight not recorded');
  }
  return section('anthropometry', 'Anthropometry', fields, [
    ref('athletes', athlete.id, null, 'Athlete biometrics'),
  ], { confidence: 'high', visibility: 'coach' });
}

function buildBodyCompositionSection(sources: PassportBuildSources): PassportSectionSummary {
  const records = sources.bodyCompositionRecords ?? [];
  const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) {
    return missingSection('body_composition', 'Body composition', 'sports_scientist', 'No body composition records');
  }
  const fields: PassportSummaryField[] = [
    field('body_fat_pct', 'Body fat', latest.body_fat_percent ?? null, { unit: '%' }),
    field('lean_mass_kg', 'Lean mass', latest.lean_mass_kg ?? null, { unit: 'kg' }),
    field('muscle_mass_kg', 'Muscle mass', latest.muscle_mass_kg ?? null, { unit: 'kg' }),
  ].filter((f) => f.value != null);
  return section('body_composition', 'Body composition', fields, [
    ref('body_composition_records', latest.id, null, 'Latest body composition'),
  ], {
    lastUpdated: latest.date,
    confidence: 'medium',
    visibility: 'sports_scientist',
    collapsedByDefault: true,
  });
}

function buildPerformanceSection(sources: PassportBuildSources): PassportSectionSummary {
  const tests = sources.tests ?? [];
  const latest = latestTest(tests);
  const analytics = sources.analytics;
  const fields: PassportSummaryField[] = [];

  if (analytics) {
    fields.push(
      field('overall_score', 'Overall score', analytics.overall.score, {
        display_value: `${analytics.overall.score}/${analytics.overall.maxScore}`,
      })
    );
  }
  if (latest) {
    fields.push(
      field('latest_test', 'Latest test', latest.test_type, {
        display_value: `${latest.test_type}: ${latest.value} ${latest.unit}`,
      }),
      field('latest_test_date', 'Test date', latest.date)
    );
  }
  if (fields.length === 0) {
    return missingSection('performance', 'Performance', 'coach', 'No performance tests recorded');
  }
  const refs: PassportSourceReference[] = [ref('assessment_sessions', latest?.scientificSessionId ?? latest?.id ?? null)];
  if (latest && !latest.scientificSessionId) {
    refs.push(ref('performance_tests', latest.id, null, 'Mock performance test'));
  }
  return section('performance', 'Performance', fields, refs, {
    lastUpdated: latest?.date ?? null,
    confidence: latest ? 'high' : 'medium',
    visibility: 'coach',
  });
}

function buildReadinessSection(sources: PassportBuildSources): PassportSectionSummary {
  const analytics = sources.analytics;
  const readiness = kpiValue(analytics, 'readiness');
  const decision = analytics?.decision;
  const fields: PassportSummaryField[] = [];
  if (readiness != null) {
    fields.push(field('readiness_score', 'Readiness', readiness, { unit: '%' }));
  }
  if (decision) {
    fields.push(field('decision_level', 'Training decision', decision.level, { display_value: decision.titleKey }));
  }
  if (fields.length === 0) {
    return missingSection('readiness', 'Readiness', 'coach', 'No readiness data — add daily check-in');
  }
  return section('readiness', 'Readiness', fields, [
    ref('daily_check_ins', sources.checkIn?.id ?? null),
    ref('analytics', sources.athlete.id, null, 'Analytics engine'),
  ], {
    lastUpdated: sources.checkIn?.date ?? null,
    confidence: sources.checkIn ? 'high' : 'estimated',
    visibility: 'coach',
  });
}

function buildRecoverySection(sources: PassportBuildSources): PassportSectionSummary {
  const checkIn = sources.checkIn;
  const recovery = kpiValue(sources.analytics, 'recovery');
  const fields: PassportSummaryField[] = [];
  if (recovery != null) fields.push(field('recovery_score', 'Recovery score', recovery, { unit: '%' }));
  if (checkIn) {
    fields.push(
      field('sleep_hours', 'Sleep', checkIn.sleep_duration_hours ?? null, { unit: 'h' }),
      field('morning_hr', 'Morning HR', checkIn.morning_heart_rate ?? null, { unit: 'bpm' }),
      field('fatigue', 'Fatigue', checkIn.fatigue ?? null, { unit: '/10' }),
      field('mood', 'Mood', checkIn.mood ?? null, { unit: '/10' })
    );
  }
  const populated = fields.filter((f) => f.value != null);
  if (populated.length === 0) {
    return missingSection('recovery', 'Recovery', 'coach', 'No recovery check-in data');
  }
  return section('recovery', 'Recovery', populated, [
    ref('daily_check_ins', checkIn?.id ?? null),
  ], {
    lastUpdated: checkIn?.date ?? null,
    confidence: checkIn ? 'high' : 'estimated',
    visibility: 'coach',
  });
}

function buildInjurySection(sources: PassportBuildSources, viewerRole: PassportViewerRole): PassportSectionSummary {
  const injuries = sources.injuries ?? [];
  const active = injuries.filter((i) => i.status !== 'resolved');
  const latest = [...injuries].sort((a, b) => b.injury_date.localeCompare(a.injury_date))[0];
  const injuryRisk = kpiValue(sources.analytics, 'injury_risk');

  if (viewerRole === 'research') {
    return missingSection('injury', 'Injury', 'research', 'Injury details restricted in research view');
  }

  const fields: PassportSummaryField[] = [];
  if (injuryRisk != null) {
    fields.push(field('injury_risk_score', 'Injury risk', injuryRisk, { unit: '%' }));
  }

  const isClinical = viewerRole === 'clinical';
  if (active.length > 0) {
    fields.push(field('active_injuries', 'Active injuries', active.length));
    if (isClinical && latest) {
      fields.push(
        field('body_region', 'Latest region', latest.body_region),
        field('severity', 'Severity', latest.severity_grade),
        field('rtp_phase', 'RTP phase', latest.rtp_phase),
        field('pain_level', 'Pain level', latest.pain_level, { unit: '/10' })
      );
    } else if (latest) {
      fields.push(
        field('availability', 'Availability', sources.athlete.availability_status ?? 'modified'),
        field('rtp_phase', 'RTP phase', latest.rtp_phase)
      );
    }
  } else {
    fields.push(field('injury_status', 'Status', 'clear', { display_value: 'No active injuries' }));
  }

  return section('injury', 'Injury', fields, [
    ref('injury_records', latest?.id ?? null),
    ref('athletes', sources.athlete.id, null, 'Availability status'),
  ], {
    lastUpdated: latest?.injury_date ?? null,
    confidence: injuries.length > 0 ? 'high' : 'medium',
    visibility: isClinical ? 'clinical' : 'coach',
  });
}

function buildTrainingLoadSection(sources: PassportBuildSources): PassportSectionSummary {
  const summary = sources.trainingLoadSummary;
  const fields: PassportSummaryField[] = [];

  if (summary) {
    fields.push(
      field('compliance_pct', 'Compliance', summary.compliance_percent, { unit: '%' }),
      field('sessions_completed', 'Sessions completed', summary.completed_sessions)
    );
    if (summary.acwr != null) {
      fields.push(field('acwr', 'ACWR', Math.round(summary.acwr * 100) / 100));
    }
  }

  const loadScore = moduleScore(sources.analytics, 'training_load');
  if (loadScore != null) fields.push(field('load_score', 'Load score', loadScore));

  if (fields.length === 0) {
    return missingSection('training_load', 'Training load', 'coach', 'No training plan or load data');
  }
  const active = (sources.trainingPlans ?? []).find((p) => p.is_active) ?? sources.trainingPlans?.[0];
  return section('training_load', 'Training load', fields, [
    ref('training_plans', active?.id ?? null),
  ], {
    lastUpdated: summary?.last_updated ?? active?.created_at ?? null,
    confidence: summary ? 'high' : 'estimated',
    visibility: 'coach',
    collapsedByDefault: true,
  });
}

function buildNutritionSection(sources: PassportBuildSources): PassportSectionSummary {
  const summary = sources.nutritionSummary;
  const fields: PassportSummaryField[] = [];

  if (summary) {
    if (summary.calories != null) fields.push(field('calories', 'Calories', summary.calories, { unit: 'kcal' }));
    if (summary.protein_g != null) fields.push(field('protein_g', 'Protein', summary.protein_g, { unit: 'g' }));
    if (summary.hydration_liters != null) {
      fields.push(field('hydration_l', 'Hydration', summary.hydration_liters, { unit: 'L' }));
    }
  } else {
    const logs = sources.nutritionLogs ?? [];
    const athleteLogs = logs.filter((l) => l.athlete_id === sources.athlete.id);
    const latest = [...athleteLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
    if (latest) {
      const calories = latest.meals.reduce((sum, m) => sum + m.calories, 0);
      const protein = latest.meals.reduce((sum, m) => sum + m.protein_g, 0);
      fields.push(
        field('calories', 'Calories', calories, { unit: 'kcal' }),
        field('protein_g', 'Protein', protein, { unit: 'g' }),
        field('hydration_l', 'Hydration', latest.water_liters, { unit: 'L' })
      );
    }
  }

  if (fields.length === 0) {
    return missingSection('nutrition', 'Nutrition', 'coach', 'No nutrition logs recorded');
  }
  const date = summary?.date ?? sources.nutritionLogs?.[0]?.date ?? null;
  return section('nutrition', 'Nutrition', fields, [
    ref('nutrition_logs', null, null, 'Daily nutrition log'),
  ], {
    lastUpdated: date,
    confidence: 'medium',
    visibility: 'coach',
    collapsedByDefault: true,
  });
}

function buildWearableSection(sources: PassportBuildSources): PassportSectionSummary {
  const summary = sources.wearableSummary;
  if (!summary) {
    const records = (sources.wearableRecords ?? []).filter((r) => r.athlete_id === sources.athlete.id);
    const latest = [...records].sort((a, b) => b.recorded_at.localeCompare(a.recorded_at))[0];
    if (!latest) {
      return missingSection('wearable', 'Wearables', 'coach', 'No wearable data synced');
    }
    const m = latest.metrics;
    const fields: PassportSummaryField[] = [
      field('provider', 'Provider', latest.provider_id),
      field('hrv', 'HRV', typeof m.hrv === 'number' ? m.hrv : null, { unit: 'ms' }),
      field('resting_hr', 'Resting HR', typeof m.resting_heart_rate === 'number' ? m.resting_heart_rate : null, { unit: 'bpm' }),
      field('sleep_hours', 'Sleep', typeof m.sleep_duration === 'number' ? m.sleep_duration : null, { unit: 'h' }),
      field('recovery_score', 'Recovery score', typeof m.recovery_score === 'number' ? m.recovery_score : null),
    ].filter((f) => f.value != null);
    return section('wearable', 'Wearables', fields, [
      ref('wearable_records', latest.id, null, 'Latest wearable snapshot'),
    ], {
      lastUpdated: latest.recorded_at,
      confidence: 'high',
      visibility: 'coach',
      collapsedByDefault: true,
    });
  }

  const fields: PassportSummaryField[] = [
    field('provider', 'Provider', summary.provider),
    field('hrv', 'HRV', summary.hrv ?? null, { unit: 'ms' }),
    field('resting_hr', 'Resting HR', summary.resting_hr ?? null, { unit: 'bpm' }),
    field('sleep_hours', 'Sleep', summary.sleep_hours ?? null, { unit: 'h' }),
    field('recovery_score', 'Recovery score', summary.recovery_score ?? null),
  ].filter((f) => f.value != null);

  return section('wearable', 'Wearables', fields, [
    ref('wearable_records', null, null, 'Latest wearable snapshot'),
  ], {
    lastUpdated: summary.last_updated,
    confidence: 'high',
    visibility: 'coach',
    collapsedByDefault: true,
  });
}

function buildLaboratorySection(sources: PassportBuildSources): PassportSectionSummary {
  return missingSection('laboratory', 'Laboratory', 'clinical', 'Laboratory results not connected');
}

function buildMedicalSection(sources: PassportBuildSources, viewerRole: PassportViewerRole): PassportSectionSummary {
  if (viewerRole === 'research') {
    return missingSection('medical', 'Medical', 'research', 'Medical data excluded from research view');
  }
  const availability = sources.athlete.availability_status ?? 'available';
  const fields: PassportSummaryField[] = [
    field('availability_status', 'Availability', availability),
  ];
  if (viewerRole === 'clinical') {
    const injuries = sources.injuries ?? [];
    const active = injuries.filter((i) => i.status !== 'resolved');
    if (active.length > 0) {
      fields.push(field('active_conditions', 'Active conditions', active.length));
    }
  }
  return section('medical', 'Medical', fields, [
    ref('athletes', sources.athlete.id, null, 'Availability status'),
    ref('medical_records', null, null, 'Clinical records'),
  ], {
    confidence: 'medium',
    visibility: viewerRole === 'clinical' ? 'clinical' : 'coach',
    collapsedByDefault: viewerRole !== 'clinical',
  });
}

function buildResearchSection(sources: PassportBuildSources, viewerRole: PassportViewerRole): PassportSectionSummary {
  if (viewerRole !== 'research' && viewerRole !== 'sports_scientist') {
    return missingSection('research', 'Research', 'research', 'Research view only');
  }
  const fields: PassportSummaryField[] = [
    field('pseudonym_id', 'Pseudonym', sources.athlete.pseudonym_id ?? `pseudo_${sources.athlete.id}`),
    field('consent_status', 'Consent', sources.athlete.consent_status ?? 'unknown'),
  ];
  const perfScore = moduleScore(sources.analytics, 'speed');
  if (perfScore != null) {
    fields.push(field('deidentified_performance_index', 'Performance index', perfScore));
  }
  return section('research', 'Research', fields, [
    ref('research_datasets', null, null, 'De-identified datasets'),
  ], {
    confidence: 'medium',
    visibility: 'research',
    collapsedByDefault: true,
  });
}

function buildEquipmentSection(_sources: PassportBuildSources): PassportSectionSummary {
  return missingSection('equipment', 'Equipment', 'sports_scientist', 'Equipment registry not linked to athlete');
}

function buildSsidInsightsSection(sources: PassportBuildSources): PassportSectionSummary {
  const tests = sources.tests ?? [];
  const withSsid = tests.filter((t) => t.ssid);
  const latest = [...withSsid].sort((a, b) => b.date.localeCompare(a.date))[0];
  const analyticsSsid = sources.analytics?.ssid;

  const fields: PassportSummaryField[] = [];
  if (latest?.ssid) {
    fields.push(
      field('classification', 'Classification', latest.ssid.classificationId),
      field('coaching_decision', 'Decision', latest.ssid.coachingDecision),
      field('test_type', 'Test', latest.test_type)
    );
  } else if (analyticsSsid?.readinessScore) {
    fields.push(
      field('classification', 'Classification', analyticsSsid.readinessScore.classificationId),
      field('coaching_decision', 'Decision', analyticsSsid.readinessScore.coachingDecision)
    );
  }

  if (fields.length === 0) {
    return missingSection('ssid_insights', 'SSID insights', 'coach', 'No SSID interpretations available');
  }
  return section('ssid_insights', 'SSID insights', fields, [
    ref('assessment_sessions', latest?.scientificSessionId ?? null, 'interpretations', 'SSID interpretation'),
    ref('performance_tests', latest?.id ?? null, null, 'Test SSID'),
  ], {
    lastUpdated: latest?.date ?? null,
    confidence: 'high',
    visibility: 'coach',
  });
}

function buildPrivacySection(sources: PassportBuildSources, visibleIds: PassportSectionId[]): PassportSectionSummary {
  const fields: PassportSummaryField[] = [
    field('consent_status', 'Consent', sources.athlete.consent_status ?? 'unknown'),
    field('sections_visible', 'Visible sections', visibleIds.length),
  ];
  return section('privacy', 'Privacy', fields, [
    ref('athletes', sources.athlete.id, null, 'Consent metadata'),
  ], {
    confidence: 'high',
    visibility: 'public',
    collapsedByDefault: true,
  });
}

function buildVersionSection(sourceCount: number, available: number, missing: number): PassportSectionSummary {
  const fields: PassportSummaryField[] = [
    field('schema_version', 'Schema', PASSPORT_SCHEMA_VERSION),
    field('builder_version', 'Builder', PASSPORT_BUILDER_VERSION),
    field('data_sources', 'Data sources', sourceCount),
    field('sections_available', 'Sections available', available),
    field('sections_missing', 'Sections missing', missing),
  ];
  return section('version', 'Version', fields, [], {
    confidence: 'high',
    visibility: 'public',
    collapsedByDefault: true,
  });
}

/** Build all passport sections from available sources. */
export function buildPassportSections(
  context: PassportBuildContext
): Record<PassportSectionId, PassportSectionSummary> {
  const viewerRole = context.viewerRole ?? 'coach';
  const sources = context.sources;

  const sections: Record<PassportSectionId, PassportSectionSummary> = {
    identity: buildIdentitySection(sources),
    sport_profile: buildSportProfileSection(sources),
    anthropometry: buildAnthropometrySection(sources),
    body_composition: buildBodyCompositionSection(sources),
    performance: buildPerformanceSection(sources),
    readiness: buildReadinessSection(sources),
    recovery: buildRecoverySection(sources),
    injury: buildInjurySection(sources, viewerRole),
    training_load: buildTrainingLoadSection(sources),
    nutrition: buildNutritionSection(sources),
    wearable: buildWearableSection(sources),
    laboratory: buildLaboratorySection(sources),
    medical: buildMedicalSection(sources, viewerRole),
    research: buildResearchSection(sources, viewerRole),
    equipment: buildEquipmentSection(sources),
    ssid_insights: buildSsidInsightsSection(sources),
    privacy: buildPrivacySection(sources, []),
    version: buildVersionSection(0, 0, 0),
  };

  const visibleIds = ALL_PASSPORT_SECTION_IDS.filter((id) => !sections[id].is_missing);
  sections.privacy = buildPrivacySection(sources, visibleIds);

  const sourceCount = countDataSources(sources);
  const available = visibleIds.length;
  const missing = ALL_PASSPORT_SECTION_IDS.length - available;
  sections.version = buildVersionSection(sourceCount, available, missing);

  return sections;
}

function countDataSources(sources: PassportBuildSources): number {
  let count = 1;
  if ((sources.tests?.length ?? 0) > 0) count += 1;
  if (sources.analytics) count += 1;
  if (sources.checkIn) count += 1;
  if ((sources.injuries?.length ?? 0) > 0) count += 1;
  if ((sources.trainingPlans?.length ?? 0) > 0) count += 1;
  if ((sources.nutritionLogs?.length ?? 0) > 0) count += 1;
  if ((sources.bodyCompositionRecords?.length ?? 0) > 0) count += 1;
  if ((sources.wearableRecords?.length ?? 0) > 0) count += 1;
  if ((sources.sessions?.length ?? 0) > 0) count += 1;
  return count;
}

/** Assemble a full athlete passport from build context. */
export function buildAthletePassport(context: PassportBuildContext): AthletePassport {
  const viewerRole = context.viewerRole ?? 'coach';
  const sections = buildPassportSections(context);
  const visibleIds = ALL_PASSPORT_SECTION_IDS.filter((id) => !sections[id].is_missing);
  const sourceCount = countDataSources(context.sources);

  return {
    passport_id: `passport_${context.athleteId}_${context.asOf ?? new Date().toISOString().slice(0, 10)}`,
    athlete_id: context.athleteId,
    organization_id: context.orgId,
    viewer_role: viewerRole,
    built_at: new Date().toISOString(),
    sections,
    privacy_metadata: {
      consent_status: context.sources.athlete.consent_status ?? 'unknown',
      pii_redacted: viewerRole === 'research',
      clinical_restricted: viewerRole !== 'clinical',
      research_deidentified: viewerRole === 'research',
      visible_section_ids: visibleIds,
    },
    version_metadata: {
      passport_schema_version: PASSPORT_SCHEMA_VERSION,
      builder_version: PASSPORT_BUILDER_VERSION,
      data_sources_count: sourceCount,
      sections_available: visibleIds.length,
      sections_missing: ALL_PASSPORT_SECTION_IDS.length - visibleIds.length,
    },
  };
}

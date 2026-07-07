/**
 * Maps Performance Lab UI models ↔ Scientific Core session models.
 */

import type { AssessmentSession, CreateAssessmentSessionInput } from '@/src/cloud/scientific/models/session';
import { decisionForPerformanceLevel } from '@/src/cloud/scientific/bridge/decisionBridge';
import type { SsidInterpretation } from '@/src/features/ssid-engine';
import { buildTestInterpretation } from '@/src/features/ssid-engine/utils/buildTestInterpretation';
import {
  adjustReferenceValues,
  buildStoredReferenceProfile,
  type TestDemographicContext,
} from '@/src/features/testing-science';
import type { AgeBandId } from '@/src/features/testing-science/referenceTables';

import type { PerformanceLevel, TestDefinition } from '../types';
import { getTestName } from '../utils/copyHelpers';
import { performanceLevelFromTest } from '@/src/features/ssid-engine/engine/testInterpretationEngine';
import { PERFORMANCE_LAB_CONDUCTED_BY, PERFORMANCE_LAB_MOCK_ORG_ID } from './constants';

const AGE_BAND_YEARS: Record<AgeBandId, number> = {
  u17: 16,
  u20: 19,
  senior: 25,
  masters: 35,
};

export interface PerformanceLabRecordInput {
  definition: TestDefinition;
  athleteId: string;
  athleteName: string;
  value: number;
  date: string;
  notes?: string;
  demographicContext: TestDemographicContext;
  isRTL: boolean;
}

export interface PerformanceLabBridgeResult {
  sessionId: string;
  level: PerformanceLevel;
  ssid: SsidInterpretation;
  mockTest: Omit<
    import('@/src/data/mock/types').MockPerformanceTest,
    'id'
  >;
}

export function mapNormativeBandToPerformanceLevel(
  band: string | null | undefined
): PerformanceLevel {
  switch (band) {
    case 'elite':
    case 'excellent':
      return 'elite';
    case 'good':
      return 'good';
    case 'average':
      return 'average';
    case 'below_average':
    case 'poor':
      return 'below';
    default:
      return 'average';
  }
}

export function mapDemographicToNormativeContext(context: TestDemographicContext) {
  return {
    sport: context.sport === 'general' ? null : context.sport,
    age: AGE_BAND_YEARS[context.ageBandId] ?? 25,
    sex: context.gender,
    competition_level: context.level,
  };
}

export function mapToCreateSessionInput(input: PerformanceLabRecordInput): CreateAssessmentSessionInput {
  const conductedAt = `${input.date}T12:00:00.000Z`;
  return {
    athlete_id: input.athleteId,
    organization_id: PERFORMANCE_LAB_MOCK_ORG_ID,
    assessment_definition_key: input.definition.key,
    conducted_by: PERFORMANCE_LAB_CONDUCTED_BY,
    source_type: 'manual',
    conducted_at: conductedAt,
    session_context: {
      notes: input.notes?.trim() || null,
    },
    raw_measurements: [
      {
        metric_key: 'primary_value',
        trial: 1,
        value: input.value,
        unit: input.definition.unit,
        captured_at: conductedAt,
      },
    ],
    normative_context: mapDemographicToNormativeContext(input.demographicContext),
  };
}

export function mapSessionToBridgeResult(
  session: AssessmentSession,
  input: PerformanceLabRecordInput
): PerformanceLabBridgeResult {
  const adjustedRef = adjustReferenceValues(
    input.definition.referenceValues,
    input.definition.categoryId,
    input.demographicContext
  );

  const level = session.normative_comparison.performance_band
    ? mapNormativeBandToPerformanceLevel(session.normative_comparison.performance_band)
    : performanceLevelFromTest(input.definition, input.value, input.demographicContext);

  const ssid = buildTestInterpretation({
    categoryId: input.definition.categoryId,
    level,
    decision: decisionForPerformanceLevel(level),
    value: input.value,
    unit: input.definition.unit,
    testKey: input.definition.key,
    referenceValues: adjustedRef,
    context: input.demographicContext,
  });

  const referenceProfile = buildStoredReferenceProfile(
    input.demographicContext,
    input.definition.referenceValues,
    input.definition.categoryId
  );

  return {
    sessionId: session.session_id,
    level,
    ssid,
    mockTest: {
      athlete_id: input.athleteId,
      athlete_name: input.athleteName,
      test_type: getTestName(input.definition, input.isRTL),
      test_type_key: input.definition.key,
      value: input.value,
      unit: input.definition.unit,
      date: input.date,
      notes: input.notes?.trim() || undefined,
      demographicContext: input.demographicContext,
      referenceProfile,
      ssid,
    },
  };
}

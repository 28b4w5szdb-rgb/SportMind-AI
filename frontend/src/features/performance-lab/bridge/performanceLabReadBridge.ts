/**
 * Performance Lab read bridge — scientific sessions with legacy fallback (Phase 6C.9.1).
 */

import type { AssessmentSession } from '@/src/cloud/scientific/models/session';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { getTestDefinition } from '@/src/features/performance-lab/registry/tests';
import { buildTestInterpretation } from '@/src/features/ssid-engine/utils/buildTestInterpretation';
import { adjustReferenceValues, DEFAULT_DEMOGRAPHIC_CONTEXT } from '@/src/features/testing-science';
import { decisionForPerformanceLevel } from '@/src/cloud/scientific/bridge/decisionBridge';
import { getScientificRepositoryRegistry } from '@/src/cloud/scientific/repositories/registry';

import { PERFORMANCE_LAB_MOCK_ORG_ID } from './constants';
import {
  mapNormativeBandToPerformanceLevel,
} from './bridgeMappers';
import {
  buildHistoryDedupeKey,
  mapMockTestToResultViewModel,
  mapSessionToResultViewModel,
  mapViewModelToMockTest,
  resolveAthleteName,
  type PerformanceLabResultViewModel,
} from './readMappers';
import { getTestName } from '../utils/copyHelpers';
import { performanceLevelFromTest } from '@/src/features/ssid-engine/engine/testInterpretationEngine';

function extractSessionValue(session: AssessmentSession): number {
  const primary = session.calculated_metrics[0] ?? session.raw_measurements[0];
  return primary?.value ?? 0;
}

function extractSessionUnit(session: AssessmentSession): string {
  const primary = session.calculated_metrics[0] ?? session.raw_measurements[0];
  return primary?.unit ?? '';
}

function buildSsidFromSession(session: AssessmentSession, isRTL = false) {
  const definition = getTestDefinition(session.assessment_definition_key);
  if (!definition) return undefined;

  const demographicContext = DEFAULT_DEMOGRAPHIC_CONTEXT;
  const value = extractSessionValue(session);
  const adjustedRef = adjustReferenceValues(
    definition.referenceValues,
    definition.categoryId,
    demographicContext
  );

  const level = session.normative_comparison.performance_band
    ? mapNormativeBandToPerformanceLevel(session.normative_comparison.performance_band)
    : performanceLevelFromTest(definition, value, demographicContext);

  return buildTestInterpretation({
    categoryId: definition.categoryId,
    level,
    decision: decisionForPerformanceLevel(level),
    value,
    unit: extractSessionUnit(session),
    testKey: definition.key,
    referenceValues: adjustedRef,
    context: demographicContext,
  });
}

export async function loadScientificSession(sessionId: string): Promise<AssessmentSession | null> {
  try {
    const registry = getScientificRepositoryRegistry();
    return registry.persistence.getSession(PERFORMANCE_LAB_MOCK_ORG_ID, sessionId);
  } catch {
    return null;
  }
}

export async function listScientificSessionsForLab(): Promise<AssessmentSession[]> {
  try {
    const registry = getScientificRepositoryRegistry();
    return registry.sessions.listByOrganization(PERFORMANCE_LAB_MOCK_ORG_ID);
  } catch {
    return [];
  }
}

export function mapSessionToLabResultViewModel(
  session: AssessmentSession,
  athletes: MockAthlete[],
  isRTL = false
): PerformanceLabResultViewModel {
  const definition = getTestDefinition(session.assessment_definition_key);
  const athleteName = resolveAthleteName(athletes, session.athlete_id) || session.athlete_id;
  const assessmentName = definition
    ? getTestName(definition, isRTL)
    : session.assessment_definition_key;
  const ssid = buildSsidFromSession(session, isRTL);
  const level = session.normative_comparison.performance_band
    ? mapNormativeBandToPerformanceLevel(session.normative_comparison.performance_band)
    : definition
      ? performanceLevelFromTest(definition, extractSessionValue(session), DEFAULT_DEMOGRAPHIC_CONTEXT)
      : 'average';

  return mapSessionToResultViewModel(session, {
    athleteName,
    assessmentName,
    performanceLevel: level,
    ssid,
    demographicContext: DEFAULT_DEMOGRAPHIC_CONTEXT,
  });
}

export async function loadPerformanceLabResultById(
  resultId: string,
  athletes: MockAthlete[],
  isRTL = false
): Promise<PerformanceLabResultViewModel | null> {
  const session = await loadScientificSession(resultId);
  if (session) {
    return mapSessionToLabResultViewModel(session, athletes, isRTL);
  }
  return null;
}

export function mergePerformanceLabHistory(
  scientificSessions: AssessmentSession[],
  mockTests: MockPerformanceTest[],
  athletes: MockAthlete[],
  isRTL = false
): MockPerformanceTest[] {
  const scientificViewModels = scientificSessions.map((session) =>
    mapSessionToLabResultViewModel(session, athletes, isRTL)
  );
  const scientificTests = scientificViewModels.map(mapViewModelToMockTest);

  const scientificIds = new Set(scientificSessions.map((session) => session.session_id));
  const scientificDedupeKeys = new Set(scientificTests.map(buildHistoryDedupeKey));

  const legacyOnly = mockTests.filter((test) => {
    if (scientificIds.has(test.id)) return false;
    if (test.scientificSessionId && scientificIds.has(test.scientificSessionId)) return false;
    return !scientificDedupeKeys.has(buildHistoryDedupeKey(test));
  });

  return [...scientificTests, ...legacyOnly].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
  );
}

export async function loadMergedPerformanceLabHistory(
  mockTests: MockPerformanceTest[],
  athletes: MockAthlete[],
  isRTL = false
): Promise<MockPerformanceTest[]> {
  const sessions = await listScientificSessionsForLab();
  return mergePerformanceLabHistory(sessions, mockTests, athletes, isRTL);
}

export function resolvePerformanceLabResult(
  scientific: PerformanceLabResultViewModel | null,
  mockTest: MockPerformanceTest | null | undefined
): PerformanceLabResultViewModel | null {
  if (scientific) return scientific;
  if (mockTest) return mapMockTestToResultViewModel(mockTest);
  return null;
}

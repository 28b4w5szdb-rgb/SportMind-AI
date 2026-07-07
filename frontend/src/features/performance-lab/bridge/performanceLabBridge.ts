/**
 * Performance Lab Bridge — Legacy UI → Scientific Core adapter (Phase 6C.9).
 *
 * Assessment Definition → Calculation → Normative → SSID → Session → Persistence
 */

import type { AssessmentSessionEngine } from '@/src/cloud/scientific/engine/assessmentSessionEngine';
import { createAssessmentSessionEngine } from '@/src/cloud/scientific/engine/assessmentSessionEngine';
import { createScientificCalculationEngine } from '@/src/cloud/scientific/engine/scientificCalculationEngine';
import { createSsidInterpretationEngine } from '@/src/cloud/scientific/engine/ssidInterpretationEngine';
import {
  createAssessmentSessionEngineFromRegistry,
  getScientificRepositoryRegistry,
} from '@/src/cloud/scientific/repositories/registry';

import type { TestDefinition } from '../types';
import { getTestName } from '../utils/copyHelpers';
import { interpretTestWithSsid } from '../utils/testInterpretation';
import type { TestDemographicContext } from '@/src/features/testing-science';
import {
  mapSessionToBridgeResult,
  mapToCreateSessionInput,
  type PerformanceLabBridgeResult,
  type PerformanceLabRecordInput,
} from './bridgeMappers';
import { getCachedCatalogDefinition } from './scientificCatalogCache';
import { canUseScientificCustomPipeline } from './customAssessmentBridge';

let previewEngine: AssessmentSessionEngine | undefined;
let persistEngine: AssessmentSessionEngine | undefined;

function getPreviewEngine(): AssessmentSessionEngine {
  if (previewEngine) return previewEngine;
  const registry = getScientificRepositoryRegistry();
  previewEngine = createAssessmentSessionEngine({
    catalog: registry.catalog,
    sessions: registry.sessions,
    calculation: createScientificCalculationEngine(registry.catalog),
    ssid: createSsidInterpretationEngine(registry.catalog),
  });
  return previewEngine;
}

function getPersistEngine(): AssessmentSessionEngine {
  if (!persistEngine) {
    persistEngine = createAssessmentSessionEngineFromRegistry({ includeSsid: true });
  }
  return persistEngine;
}

function canUseScientificPipeline(definition: TestDefinition): boolean {
  if (definition.key === 'custom_test') return false;
  return canUseScientificCustomPipeline(definition);
}

function legacyBridgeResult(input: PerformanceLabRecordInput): PerformanceLabBridgeResult {
  const { level, ssid } = interpretTestWithSsid(
    input.definition,
    input.value,
    input.demographicContext
  );
  return {
    sessionId: `legacy_${Date.now()}`,
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
      notes: input.notes,
      demographicContext: input.demographicContext,
      ssid,
    },
  };
}

async function runScientificPipeline(
  input: PerformanceLabRecordInput,
  persist: boolean
): Promise<PerformanceLabBridgeResult> {
  if (!canUseScientificPipeline(input.definition)) {
    return legacyBridgeResult(input);
  }

  const catalogDefinition = await getCachedCatalogDefinition(input.definition.key);
  if (!catalogDefinition) {
    return legacyBridgeResult(input);
  }

  const engine = persist ? getPersistEngine() : getPreviewEngine();
  const session = await engine.createAssessmentSession(mapToCreateSessionInput(input));
  return mapSessionToBridgeResult(session, input);
}

export async function previewPerformanceLabAssessment(
  input: PerformanceLabRecordInput
): Promise<PerformanceLabBridgeResult> {
  return runScientificPipeline(input, false);
}

export async function recordPerformanceLabAssessment(
  input: PerformanceLabRecordInput
): Promise<PerformanceLabBridgeResult> {
  return runScientificPipeline(input, true);
}

export function resetPerformanceLabBridgeEngines(): void {
  previewEngine = undefined;
  persistEngine = undefined;
}

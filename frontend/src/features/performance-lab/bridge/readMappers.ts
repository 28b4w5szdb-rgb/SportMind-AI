/**
 * Performance Lab result view model — scientific session read path (Phase 6C.9.1).
 */

import type { DataSourceType, EvidenceTier } from '@/src/cloud/scientific/models/common';
import type {
  AssessmentSession,
  CalculatedMetric,
} from '@/src/cloud/scientific/models/session';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import type { SsidInterpretation } from '@/src/features/ssid-engine';
import type { TestDemographicContext } from '@/src/features/testing-science';

import type { PerformanceLevel } from '../types';

export type PerformanceLabResultSource = 'scientific' | 'legacy';

export interface PerformanceLabResultViewModel {
  id: string;
  source: PerformanceLabResultSource;
  scientificSessionId?: string;
  athlete: {
    id: string;
    name: string;
  };
  assessmentKey: string;
  assessmentName: string;
  rawResult: {
    value: number;
    unit: string;
  };
  calculatedMetrics: CalculatedMetric[];
  normativeBand: string | null;
  performanceLevel: PerformanceLevel;
  ssid?: SsidInterpretation;
  date: string;
  evidenceTier: EvidenceTier | null;
  sourceType: DataSourceType | null;
  notes?: string;
  demographicContext?: TestDemographicContext;
}

export interface MapSessionReadOptions {
  athleteName: string;
  assessmentName: string;
  performanceLevel: PerformanceLevel;
  ssid?: SsidInterpretation;
  demographicContext?: TestDemographicContext;
}

function extractPrimaryMetric(session: AssessmentSession): { value: number; unit: string } {
  const primary = session.calculated_metrics[0] ?? session.raw_measurements[0];
  return {
    value: primary?.value ?? 0,
    unit: primary?.unit ?? '',
  };
}

export function mapSessionToResultViewModel(
  session: AssessmentSession,
  options: MapSessionReadOptions
): PerformanceLabResultViewModel {
  const rawResult = extractPrimaryMetric(session);

  return {
    id: session.session_id,
    source: 'scientific',
    scientificSessionId: session.session_id,
    athlete: {
      id: session.athlete_id,
      name: options.athleteName,
    },
    assessmentKey: session.assessment_definition_key,
    assessmentName: options.assessmentName,
    rawResult,
    calculatedMetrics: session.calculated_metrics,
    normativeBand: session.normative_comparison.performance_band ?? null,
    performanceLevel: options.performanceLevel,
    ssid: options.ssid,
    date: session.conducted_at.slice(0, 10),
    evidenceTier: session.evidence_tier_snapshot,
    sourceType: session.source_type,
    notes: session.session_context.notes ?? undefined,
    demographicContext: options.demographicContext,
  };
}

export function mapViewModelToMockTest(viewModel: PerformanceLabResultViewModel): MockPerformanceTest {
  return {
    id: viewModel.id,
    athlete_id: viewModel.athlete.id,
    athlete_name: viewModel.athlete.name,
    test_type: viewModel.assessmentName,
    test_type_key: viewModel.assessmentKey,
    value: viewModel.rawResult.value,
    unit: viewModel.rawResult.unit,
    date: viewModel.date,
    notes: viewModel.notes,
    ssid: viewModel.ssid,
    demographicContext: viewModel.demographicContext,
    scientificSessionId: viewModel.scientificSessionId,
  };
}

export function mapMockTestToResultViewModel(test: MockPerformanceTest): PerformanceLabResultViewModel {
  return {
    id: test.id,
    source: 'legacy',
    scientificSessionId: test.scientificSessionId,
    athlete: {
      id: test.athlete_id,
      name: test.athlete_name,
    },
    assessmentKey: test.test_type_key,
    assessmentName: test.test_type,
    rawResult: {
      value: test.value,
      unit: test.unit,
    },
    calculatedMetrics: [],
    normativeBand: null,
    performanceLevel: test.ssid?.performanceLevel ?? 'average',
    ssid: test.ssid,
    date: test.date,
    evidenceTier: null,
    sourceType: null,
    notes: test.notes,
    demographicContext: test.demographicContext,
  };
}

export function resolveAthleteName(athletes: MockAthlete[], athleteId: string): string {
  const athlete = athletes.find((item) => item.id === athleteId);
  if (!athlete) return '';
  return `${athlete.first_name} ${athlete.last_name}`.trim();
}

export function buildHistoryDedupeKey(test: Pick<MockPerformanceTest, 'athlete_id' | 'test_type_key' | 'date' | 'value'>): string {
  return `${test.athlete_id}::${test.test_type_key}::${test.date}::${test.value}`;
}

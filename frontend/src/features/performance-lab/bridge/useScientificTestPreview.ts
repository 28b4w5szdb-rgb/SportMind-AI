/**
 * Async scientific preview hook for Performance Lab test entry — falls back to legacy SSID.
 * Phase 8.3 — debounced value input to avoid pipeline runs on every keystroke.
 */

import { useEffect, useState } from 'react';

import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import type { TestDemographicContext } from '@/src/features/testing-science';
import type { SsidInterpretation } from '@/src/features/ssid-engine';

import type { PerformanceLevel, TestDefinition } from '../types';
import { interpretTestWithSsid } from '../utils/testInterpretation';
import { previewPerformanceLabAssessment } from './performanceLabBridge';
import type { PerformanceLabRecordInput } from './bridgeMappers';

const PREVIEW_DEBOUNCE_MS = 400;

export interface ScientificTestPreview {
  level: PerformanceLevel;
  ssid: SsidInterpretation;
}

export function useScientificTestPreview(
  definition: TestDefinition | undefined,
  athleteId: string,
  athleteName: string,
  value: string,
  date: string,
  demographicContext: TestDemographicContext,
  isRTL: boolean
): ScientificTestPreview | null {
  const [preview, setPreview] = useState<ScientificTestPreview | null>(null);
  const debouncedValue = useDebouncedValue(value, PREVIEW_DEBOUNCE_MS);

  useEffect(() => {
    if (!definition || !debouncedValue.trim() || Number.isNaN(Number(debouncedValue))) {
      setPreview(null);
      return;
    }

    let cancelled = false;
    const numericValue = Number(debouncedValue);

    const input: PerformanceLabRecordInput = {
      definition,
      athleteId,
      athleteName,
      value: numericValue,
      date,
      demographicContext,
      isRTL,
    };

    previewPerformanceLabAssessment(input)
      .then((result) => {
        if (!cancelled) {
          setPreview({ level: result.level, ssid: result.ssid });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPreview(interpretTestWithSsid(definition, numericValue, demographicContext));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [definition, athleteId, athleteName, debouncedValue, date, demographicContext, isRTL]);

  return preview;
}

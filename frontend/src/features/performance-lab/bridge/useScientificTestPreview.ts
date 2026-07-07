/**
 * Async scientific preview hook for Performance Lab test entry — falls back to legacy SSID.
 */

import { useEffect, useState } from 'react';

import type { TestDemographicContext } from '@/src/features/testing-science';
import type { SsidInterpretation } from '@/src/features/ssid-engine';

import type { PerformanceLevel, TestDefinition } from '../types';
import { interpretTestWithSsid } from '../utils/testInterpretation';
import { previewPerformanceLabAssessment } from './performanceLabBridge';
import type { PerformanceLabRecordInput } from './bridgeMappers';

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

  useEffect(() => {
    if (!definition || !value.trim() || Number.isNaN(Number(value))) {
      setPreview(null);
      return;
    }

    let cancelled = false;
    const numericValue = Number(value);

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
  }, [definition, athleteId, athleteName, value, date, demographicContext, isRTL]);

  return preview;
}

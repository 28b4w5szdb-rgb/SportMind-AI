import type { TestDefinition } from '../types';
import type { TestInterpretationContext } from '@/src/features/ssid-engine/engine/testInterpretationEngine';
import { interpretPerformanceTest, performanceLevelFromTest } from '@/src/features/ssid-engine/engine/testInterpretationEngine';
import type { SsidInterpretation } from '@/src/features/ssid-engine';
import type { PerformanceLevel } from '../types';

export function interpretTestWithSsid(
  test: TestDefinition,
  value: number,
  context: TestInterpretationContext = {}
): { level: PerformanceLevel; ssid: SsidInterpretation } {
  const level = performanceLevelFromTest(test, value, context);
  const ssid = interpretPerformanceTest(test, value, context);
  return { level, ssid };
}

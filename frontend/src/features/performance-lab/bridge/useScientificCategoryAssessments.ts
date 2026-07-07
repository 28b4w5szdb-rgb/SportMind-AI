/**
 * Category assessments from Scientific catalog with legacy fallback.
 */

import { useEffect, useMemo, useState } from 'react';

import type { MockPerformanceTest } from '@/src/data/mock/types';
import type { TestCategoryId, TestDefinition } from '../types';
import { getTestsByCategory } from '../registry/tests';
import { useCustomTestDefinitions } from '../hooks/useTestLibrary';
import { loadCategoryAssessments } from './scientificCatalogCache';
import { usePerformanceLabHistory } from './usePerformanceLabHistory';

export function useScientificCategoryAssessments(categoryId: TestCategoryId | string) {
  const customTests = useCustomTestDefinitions();
  const { tests: recordedTests, loading: historyLoading } = usePerformanceLabHistory();
  const [assessments, setAssessments] = useState<TestDefinition[]>(() =>
    getTestsByCategory(categoryId, customTests)
  );
  const [loading, setLoading] = useState(true);
  const [readErrorKey, setReadErrorKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setReadErrorKey(null);

    loadCategoryAssessments(categoryId as TestCategoryId, customTests)
      .then((items) => {
        if (!cancelled) setAssessments(items);
      })
      .catch(() => {
        if (!cancelled) {
          setReadErrorKey('testingCenter.bridge.readFailed');
          setAssessments(getTestsByCategory(categoryId, customTests));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, customTests]);

  const recorded = useMemo(() => {
    const keys = new Set(assessments.map((item) => item.key));
    return recordedTests.filter((test) => keys.has(test.test_type_key));
  }, [assessments, recordedTests]);

  return {
    assessments,
    recorded,
    loading: loading || historyLoading,
    readErrorKey,
  };
}

export function filterRecordedForCategory(
  tests: MockPerformanceTest[],
  assessmentKeys: string[]
): MockPerformanceTest[] {
  const keys = new Set(assessmentKeys);
  return tests.filter((test) => keys.has(test.test_type_key));
}

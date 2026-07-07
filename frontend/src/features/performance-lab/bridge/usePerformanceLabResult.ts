/**
 * Loads a Performance Lab result — scientific session first, legacy mock fallback.
 */

import { useEffect, useMemo, useState } from 'react';

import { useTestById } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { useDirection } from '@/src/providers/DirectionProvider';

import {
  loadPerformanceLabResultById,
  resolvePerformanceLabResult,
} from './performanceLabReadBridge';
import { mapViewModelToMockTest, type PerformanceLabResultViewModel } from './readMappers';

export interface UsePerformanceLabResultState {
  loading: boolean;
  readErrorKey: string | null;
  viewModel: PerformanceLabResultViewModel | null;
  test: ReturnType<typeof mapViewModelToMockTest> | null;
}

export function usePerformanceLabResult(resultId: string | undefined): UsePerformanceLabResultState {
  const mockTest = useTestById(resultId);
  const athletes = useMockStore((state) => state.athletes);
  const { isRTL } = useDirection();
  const [scientificViewModel, setScientificViewModel] = useState<PerformanceLabResultViewModel | null>(null);
  const [loading, setLoading] = useState(Boolean(resultId));
  const [readErrorKey, setReadErrorKey] = useState<string | null>(null);

  useEffect(() => {
    if (!resultId) {
      setScientificViewModel(null);
      setLoading(false);
      setReadErrorKey(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setReadErrorKey(null);

    loadPerformanceLabResultById(resultId, athletes, isRTL)
      .then((viewModel) => {
        if (!cancelled) {
          setScientificViewModel(viewModel);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReadErrorKey('testingCenter.bridge.readFailed');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [resultId, athletes, isRTL]);

  const viewModel = useMemo(
    () => resolvePerformanceLabResult(scientificViewModel, mockTest),
    [scientificViewModel, mockTest]
  );

  const test = useMemo(() => (viewModel ? mapViewModelToMockTest(viewModel) : null), [viewModel]);

  return {
    loading,
    readErrorKey,
    viewModel,
    test,
  };
}

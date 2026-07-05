export { TESTING_CATEGORIES, getCategoryById } from './registry/categories';
export { TEST_OBJECTIVES, getObjectiveLabelKey } from './registry/objectives';
export {
  TEST_REGISTRY,
  getTestDefinition,
  getTestsByCategory,
  getFeaturedTestForCategory,
  countTestsInCategory,
  buildModuleImpactMap,
  getMergedRegistry,
  getTotalTestCount,
} from './registry/tests';
export { TEST_SIGNAL_ALIASES, resolveSignalKey } from './registry/signalAliases';
export { rateTestResult, benchmarkRating, PERFORMANCE_LEVEL_COLORS, getBenchmarkNormsFromRegistry } from './utils/benchmark';
export { computeTestAnalyticsImpact, computeResultAnalyticsSnapshot } from './utils/analyticsImpact';
export { getTestText, getTestName, matchesLibraryQuery } from './utils/copyHelpers';
export { CategoryCard } from './components/CategoryCard';
export { TestResultCard } from './components/TestResultCard';
export { TestLibraryListItem } from './components/TestLibraryListItem';
export { TestLibraryFiltersBar } from './components/TestLibraryFiltersBar';
export {
  useTestDefinition,
  useTestLibrary,
  useTestLibraryActions,
  useCustomTestDefinitions,
} from './hooks/useTestLibrary';
export type {
  TestCategoryId,
  TestDefinition,
  TestingCategoryDefinition,
  TestReferenceValues,
  PerformanceLevel,
  TestAnalyticsImpact,
  TestObjective,
  TestLibraryFilters,
  CustomTestInput,
  BilingualText,
  TestCopyBundle,
} from './types';

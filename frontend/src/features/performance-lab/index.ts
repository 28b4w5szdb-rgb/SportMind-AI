export { TESTING_CATEGORIES, getCategoryById } from './registry/categories';
export {
  TEST_REGISTRY,
  getTestDefinition,
  getTestsByCategory,
  getFeaturedTestForCategory,
  countTestsInCategory,
  buildModuleImpactMap,
} from './registry/tests';
export { rateTestResult, benchmarkRating, PERFORMANCE_LEVEL_COLORS, getBenchmarkNormsFromRegistry } from './utils/benchmark';
export { computeTestAnalyticsImpact, computeResultAnalyticsSnapshot } from './utils/analyticsImpact';
export { CategoryCard } from './components/CategoryCard';
export { TestResultCard } from './components/TestResultCard';
export type {
  TestCategoryId,
  TestDefinition,
  TestingCategoryDefinition,
  TestReferenceValues,
  PerformanceLevel,
  TestAnalyticsImpact,
} from './types';

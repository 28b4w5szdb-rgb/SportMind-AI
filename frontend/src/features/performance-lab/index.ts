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
export { TestKnowledgePanel } from './components/TestKnowledgePanel';
export { TestReferencePanel } from './components/TestReferencePanel';
export { DemographicSelector } from './components/DemographicSelector';
export { DemographicContextCard } from './components/DemographicContextCard';
export { interpretTestWithSsid } from './utils/testInterpretation';
export { getTestProtocolMeta, levelToPercentile } from './utils/labPresentation';
export { useLabDashboardPresentation, buildTestHistoryTrend } from './hooks/useLabDashboardPresentation';
export { LabDashboard } from './components/lab/LabDashboard';
export { LabProtocolCard } from './components/lab/LabProtocolCard';
export { LabResultPremiumView } from './components/lab/LabResultPremiumView';
export { LabKnowledgePremiumPanel } from './components/lab/LabKnowledgePremiumPanel';
export { LabBenchmarkComparison } from './components/lab/LabBenchmarkComparison';
export { LabTimeline } from './components/lab/LabTimeline';
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
  TestKnowledgeBundle,
} from './types';

export * from './types';
export {
  interpretMetric,
  registerMetricInterpreter,
  listRegisteredMetrics,
  mapCalculatorTypeToMetric,
  classificationDisplayLabel,
} from './registry/metricRegistry';
export {
  formatSsidForAI,
  formatSsidBundleForAI,
  formatSsidReportSections,
  buildBodyCompositionSsidBundle,
  buildTrainingLoadSsidBundle,
  buildAnalyticsSsidBundle,
  buildWorkspaceSsidEntries,
  buildCalculatorSsidEntries,
  interpretCalculatorResult,
} from './engine/ssidEngine';
export {
  interpretPerformanceTest,
  performanceLevelFromTest,
} from './engine/testInterpretationEngine';
export type { TestInterpretationContext } from './engine/testInterpretationEngine';
export type { SsidDisplayEntry, SsidReportContent } from './engine/ssidEngine';
export {
  ScientificResultCard,
  InterpretationPanel,
  CoachingDecisionCard,
  RecommendationStack,
  ReferenceConfidenceFooter,
  SsidInterpretationView,
  SsidBundleSection,
} from './components';

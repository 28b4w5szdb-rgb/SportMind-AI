export * from './types';
export { PerformanceAnalyticsEngine, computeAthleteAnalytics } from './engine/performanceAnalyticsEngine';
export type { PerformanceAnalyticsInput } from './engine/performanceAnalyticsEngine';
export { ANALYTICS_MODULES } from './registry/modules';
export { useAthleteAnalytics } from './hooks/useAthleteAnalytics';
export { useTeamAnalyticsOverview } from './hooks/useTeamAnalyticsOverview';
export {
  computeTeamOverview,
  buildAiSummaryFromAnalytics,
  buildAnalyticsReportSections,
  formatAthleteAnalyticsForAI,
} from './summary/teamOverview';
export type { TeamAnalyticsOverview } from './summary/teamOverview';
export { getAffectedModules, TEST_MODULE_IMPACT_MAP } from './summary/testImpact';

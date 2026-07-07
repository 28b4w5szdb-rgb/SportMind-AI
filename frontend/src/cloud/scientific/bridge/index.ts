/**
 * Scientific Core bridges — sync entry points for UI/feature layers (Phase 8.2).
 */

export {
  calculateFromCalculator,
  calculateFormulaSync,
  type SyncCalculationResult,
} from './calculationBridge';

export { interpretMetricViaScientificCore } from './ssidMetricBridge';

export { decisionForPerformanceLevel, decisionForRiskLevel } from './decisionBridge';

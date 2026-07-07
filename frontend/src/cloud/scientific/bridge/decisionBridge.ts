/**
 * Shared coaching decision mapping — single source for normative-level → decision (Phase 8.2).
 */

import type { PerformanceLevel } from '@/src/features/performance-lab/types';
import type { SsidCoachingDecisionId } from '@/src/features/ssid-engine';
import type { SsidRiskLevel } from '../models/interpretation/ScientificInterpretation';

/** Map performance lab normative level to coaching decision. */
export function decisionForPerformanceLevel(level: PerformanceLevel): SsidCoachingDecisionId {
  switch (level) {
    case 'elite':
    case 'good':
      return 'train_normally';
    case 'average':
      return 'maintain';
    case 'below':
      return 'reduce_load';
    default:
      return 'maintain';
  }
}

/** Fallback when only SSID risk level is available. */
export function decisionForRiskLevel(risk: SsidRiskLevel): SsidCoachingDecisionId {
  switch (risk) {
    case 'high':
      return 'reduce_load';
    case 'moderate':
      return 'recovery_session';
    case 'low':
      return 'train_normally';
    default:
      return 'maintain';
  }
}

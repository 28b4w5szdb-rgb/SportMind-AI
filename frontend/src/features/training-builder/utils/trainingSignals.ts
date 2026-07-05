import type { TrainingPlan } from '../types';
import type { AnalyticsRawSignals } from '@/src/analytics/types';
import {
  computeAcuteChronicLoad,
  computeCompliance,
  computeWeeklyActualLoad,
  computeWeeklyPlannedLoad,
  todayDateKey,
} from '../engine/trainingBuilderEngine';

export function buildTrainingSignals(
  plans: TrainingPlan[],
  athleteId: string,
  referenceDate: string = todayDateKey()
): AnalyticsRawSignals['training'] {
  const athletePlans = plans.filter((p) => p.athlete_id === athleteId);
  const activePlan = athletePlans.find((p) => p.is_active) ?? athletePlans[0];
  const allSessions = athletePlans.flatMap((p) => p.sessions);
  const compliance = computeCompliance(activePlan, referenceDate);
  const weeklyPlannedLoad = activePlan ? computeWeeklyPlannedLoad(activePlan.sessions) : 0;
  const weeklyActualLoad = activePlan ? computeWeeklyActualLoad(activePlan.sessions) : 0;
  const { acuteLoad, chronicLoad, acwr } = computeAcuteChronicLoad(allSessions, referenceDate);

  const executed = allSessions.filter((s) => s.execution);
  const avgSessionRpe =
    executed.length > 0
      ? executed.reduce((sum, s) => sum + (s.execution?.actual_rpe ?? 0), 0) / executed.length
      : undefined;
  const avgPostFatigue =
    executed.length > 0
      ? executed.reduce((sum, s) => sum + (s.execution?.post_session_fatigue ?? 0), 0) / executed.length
      : undefined;
  const avgPostPain =
    executed.length > 0
      ? executed.reduce((sum, s) => sum + (s.execution?.post_session_pain ?? 0), 0) / executed.length
      : undefined;

  return {
    compliancePercent: compliance.compliancePercent,
    plannedSessions: compliance.planned,
    completedSessions: compliance.completed,
    skippedSessions: compliance.skipped,
    modifiedSessions: compliance.modified,
    weeklyPlannedLoad,
    weeklyActualLoad,
    acuteLoad,
    chronicLoad,
    acwr,
    avgSessionRpe,
    avgPostFatigue,
    avgPostPain,
  };
}

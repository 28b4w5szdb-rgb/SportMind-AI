import { useMemo } from 'react';

import type { MockAthlete } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';
import { useTeamById, useTeamRoster } from '@/src/data/mock/hooks';
import { useDirection } from '@/src/providers/DirectionProvider';

import { computeTeamIntelligence } from '../engine/teamIntelligenceEngine';
import type { TeamIntelligenceSnapshot } from '../types';

export function useTeamIntelligenceForAthletes(athletes: MockAthlete[]): TeamIntelligenceSnapshot {
  const tests = useMockStore((s) => s.tests);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const { isRTL } = useDirection();

  return useMemo(
    () =>
      computeTeamIntelligence(
        {
          athletes,
          tests,
          dailyCheckIns,
          injuries: injuryRecords,
          trainingPlans,
          nutritionLogs,
          bodyCompositionRecords,
          nutritionGoalSettings,
        },
        isRTL
      ),
    [
      athletes,
      tests,
      dailyCheckIns,
      injuryRecords,
      trainingPlans,
      nutritionLogs,
      bodyCompositionRecords,
      nutritionGoalSettings,
      isRTL,
    ]
  );
}

export function useTeamIntelligence(teamId?: string): TeamIntelligenceSnapshot {
  const team = useTeamById(teamId);
  const roster = useTeamRoster(team);
  const allAthletes = useMockStore((s) => s.athletes);
  const athletes = teamId ? roster : allAthletes;

  const snapshot = useTeamIntelligenceForAthletes(athletes);

  return useMemo(
    () => ({
      ...snapshot,
      teamId: team?.id,
      teamName: team?.name,
    }),
    [snapshot, team?.id, team?.name]
  );
}

export function useSquadIntelligence(): TeamIntelligenceSnapshot {
  const athletes = useMockStore((s) => s.athletes);
  return useTeamIntelligenceForAthletes(athletes);
}

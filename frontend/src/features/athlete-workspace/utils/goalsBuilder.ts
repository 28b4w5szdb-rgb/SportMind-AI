import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete } from '@/src/data/mock/types';
import type { AthleteGoal } from '../types';

function moduleScore(analytics: AthleteAnalyticsSnapshot, id: string): number {
  return analytics.overall.modules.find((m) => m.id === id)?.score ?? 50;
}

export function buildAthleteGoals(_athlete: MockAthlete, analytics: AthleteAnalyticsSnapshot): AthleteGoal[] {
  const injuryScore = moduleScore(analytics, 'injury_risk');
  const injuryProgress = Math.max(0, Math.min(100, 100 - injuryScore));

  return [
    {
      id: 'goal_sprint',
      titleKey: 'athleteWorkspace.goals.sprint30',
      moduleId: 'speed',
      progress: moduleScore(analytics, 'speed'),
      target: 85,
    },
    {
      id: 'goal_strength',
      titleKey: 'athleteWorkspace.goals.strength',
      moduleId: 'strength',
      progress: moduleScore(analytics, 'strength'),
      target: 80,
    },
    {
      id: 'goal_recovery',
      titleKey: 'athleteWorkspace.goals.recovery',
      moduleId: 'recovery',
      progress: moduleScore(analytics, 'recovery'),
      target: 75,
    },
    {
      id: 'goal_injury',
      titleKey: 'athleteWorkspace.goals.injuryRisk',
      moduleId: 'injury_risk',
      progress: injuryProgress,
      target: 80,
      invert: true,
    },
    {
      id: 'goal_flexibility',
      titleKey: 'athleteWorkspace.goals.flexibility',
      moduleId: 'flexibility',
      progress: moduleScore(analytics, 'flexibility'),
      target: 70,
    },
  ];
}

import React from 'react';
import { View } from 'react-native';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useAthleteWorkspace } from '../hooks/useAthleteWorkspace';
import { AthleteHeroCard } from './AthleteHeroCard';
import { WorkspaceQuickActions } from './WorkspaceQuickActions';
import { WorkspaceKpiGrid } from './WorkspaceKpiGrid';
import { WorkspaceLatestStrip } from './WorkspaceLatestStrip';
import { BodyMuscleMapPlaceholder } from './BodyMuscleMapPlaceholder';
import { WorkspaceAnalyticsPanel } from './WorkspaceAnalyticsPanel';
import { AthleteTimelineSection } from './AthleteTimelineSection';
import { WorkspaceGoalsSection } from './WorkspaceGoalsSection';
import { WorkspacePlaceholderSummaries } from './WorkspacePlaceholderSummaries';
import { AthleteProfileDetails } from './AthleteProfileDetails';

interface AthleteIntelligenceWorkspaceProps {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics: AthleteAnalyticsSnapshot;
}

export function AthleteIntelligenceWorkspace({ athlete, tests, analytics }: AthleteIntelligenceWorkspaceProps) {
  const workspace = useAthleteWorkspace(athlete, tests, analytics);

  return (
    <View>
      <AthleteHeroCard athlete={athlete} />
      <WorkspaceQuickActions athlete={athlete} />
      <WorkspaceKpiGrid kpis={analytics.kpis} />
      <WorkspaceLatestStrip
        latestTest={workspace.latestTest}
        latestRecommendation={workspace.latestRecommendation}
        daysSinceInjury={workspace.daysSinceInjury}
      />
      <BodyMuscleMapPlaceholder modules={analytics.overall.modules} />
      <WorkspaceAnalyticsPanel analytics={analytics} />
      <AthleteTimelineSection events={workspace.timeline} />
      <WorkspaceGoalsSection goals={workspace.goals} />
      <WorkspacePlaceholderSummaries athlete={athlete} />
      <AthleteProfileDetails athlete={athlete} />
    </View>
  );
}

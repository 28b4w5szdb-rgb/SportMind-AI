import React, { useMemo } from 'react';
import { View } from 'react-native';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { useSportsMedicineSnapshot, attentionRegions, regionsWithHistory } from '@/src/features/sports-medicine';
import { useTrainingBuilderSnapshot, WorkspaceTrainingSection } from '@/src/features/training-builder';
import { useNutritionSnapshot, WorkspaceNutritionSection } from '@/src/features/nutrition';
import { buildWorkspaceSsidEntries, SsidBundleSection } from '@/src/features/ssid-engine';
import { useAthleteWorkspace } from '../hooks/useAthleteWorkspace';
import { AthleteHeroCard } from './AthleteHeroCard';
import { WorkspaceQuickActions } from './WorkspaceQuickActions';
import { WorkspaceKpiGrid } from './WorkspaceKpiGrid';
import { WorkspaceLatestStrip } from './WorkspaceLatestStrip';
import { BodyMuscleMapPlaceholder } from './BodyMuscleMapPlaceholder';
import { WorkspaceCheckInStrip } from './WorkspaceCheckInStrip';
import { WorkspaceRecoverySection } from './WorkspaceRecoverySection';
import { WorkspaceSportsMedicineSection } from './WorkspaceSportsMedicineSection';
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
  const latestCheckIn = useLatestCheckInForAthlete(athlete.id);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const sportsMedicine = useSportsMedicineSnapshot(athlete, tests, latestCheckIn);
  const trainingSnapshot = useTrainingBuilderSnapshot(athlete, tests);
  const nutritionSnapshot = useNutritionSnapshot(athlete);

  const ssidEntries = useMemo(
    () => buildWorkspaceSsidEntries(analytics, nutritionSnapshot?.bodyCompositionAnalysis?.ssid),
    [analytics, nutritionSnapshot?.bodyCompositionAnalysis?.ssid]
  );

  const injuryRegions = useMemo(() => regionsWithHistory(injuryRecords, athlete.id), [injuryRecords, athlete.id]);
  const attention = useMemo(
    () => (sportsMedicine ? attentionRegions(sportsMedicine.profile) : []),
    [sportsMedicine]
  );

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
      <WorkspaceCheckInStrip athleteId={athlete.id} checkIn={workspace.latestCheckIn} />
      <WorkspaceRecoverySection athleteId={athlete.id} checkIn={workspace.latestCheckIn} />
      {sportsMedicine ? <WorkspaceSportsMedicineSection athleteId={athlete.id} snapshot={sportsMedicine} /> : null}
      {trainingSnapshot ? <WorkspaceTrainingSection athleteId={athlete.id} snapshot={trainingSnapshot} /> : null}
      {nutritionSnapshot ? <WorkspaceNutritionSection athleteId={athlete.id} snapshot={nutritionSnapshot} /> : null}
      <BodyMuscleMapPlaceholder
        modules={analytics.overall.modules}
        regionRisks={sportsMedicine?.profile.regional}
        injuryRegions={injuryRegions}
        attentionRegions={attention}
      />
      <WorkspaceAnalyticsPanel analytics={analytics} />
      <SsidBundleSection entries={ssidEntries} compact />
      <AthleteTimelineSection events={workspace.timeline} />
      <WorkspaceGoalsSection goals={workspace.goals} />
      <WorkspacePlaceholderSummaries athlete={athlete} />
      <AthleteProfileDetails athlete={athlete} />
    </View>
  );
}

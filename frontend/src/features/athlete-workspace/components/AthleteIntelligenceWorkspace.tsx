import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme } from '@/src/core/theme';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';
import { useSportsMedicineSnapshot, attentionRegions, regionsWithHistory } from '@/src/features/sports-medicine';
import { useTrainingBuilderSnapshot, WorkspaceTrainingSection } from '@/src/features/training-builder';
import { useNutritionSnapshot, WorkspaceNutritionSection } from '@/src/features/nutrition';
import { useWearablesSnapshot, WorkspaceWearablesSection } from '@/src/features/wearables';
import { buildWorkspaceSsidEntries, SsidBundleSection } from '@/src/features/ssid-engine';

import { useAthleteWorkspace } from '../hooks/useAthleteWorkspace';
import { useAthleteCockpitPresentation } from '../hooks/useAthleteCockpitPresentation';
import type { CockpitSectionId } from '../constants/cockpitSections';
import { COCKPIT_NAV_ITEMS } from '../constants/cockpitSections';
import { WorkspaceQuickActions } from './WorkspaceQuickActions';
import { WorkspaceCheckInStrip } from './WorkspaceCheckInStrip';
import { WorkspaceRecoverySection } from './WorkspaceRecoverySection';
import { WorkspaceSportsMedicineSection } from './WorkspaceSportsMedicineSection';
import { WorkspaceGoalsSection } from './WorkspaceGoalsSection';
import { AthleteProfileDetails } from './AthleteProfileDetails';
import { CockpitStickyNav } from './cockpit/CockpitStickyNav';
import { CockpitHero } from './cockpit/CockpitHero';
import { CockpitKpiGrid } from './cockpit/CockpitKpiGrid';
import { CockpitPerformanceSnapshot } from './cockpit/CockpitPerformanceSnapshot';
import { CockpitAiSummary } from './cockpit/CockpitAiSummary';
import { CockpitChartsPanel } from './cockpit/CockpitChartsPanel';
import { CockpitBodyIntelligence } from './cockpit/CockpitBodyIntelligence';
import { CockpitTimeline } from './cockpit/CockpitTimeline';
import { CockpitCollapsibleSection } from './cockpit/CockpitCollapsibleSection';

interface AthleteIntelligenceWorkspaceProps {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics: AthleteAnalyticsSnapshot;
}

export function AthleteIntelligenceWorkspace({ athlete, tests, analytics }: AthleteIntelligenceWorkspaceProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { horizontalPadding } = useResponsiveLayout();
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Partial<Record<CockpitSectionId, number>>>({});
  const [activeSection, setActiveSection] = useState<CockpitSectionId>('overview');

  const workspace = useAthleteWorkspace(athlete, tests, analytics);
  const latestCheckIn = useLatestCheckInForAthlete(athlete.id);
  const reports = useMockStore((s) => s.reports);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const sportsMedicine = useSportsMedicineSnapshot(athlete, tests, latestCheckIn);
  const trainingSnapshot = useTrainingBuilderSnapshot(athlete, tests);
  const nutritionSnapshot = useNutritionSnapshot(athlete);
  const wearableSnapshot = useWearablesSnapshot(athlete);

  const latestReport = useMemo(
    () =>
      [...reports]
        .filter((r) => r.athlete_id === athlete.id)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0],
    [reports, athlete.id]
  );

  const { team, snapshotItems } = useAthleteCockpitPresentation({
    athlete,
    tests,
    analytics,
    trainingSnapshot,
    nutritionSnapshot,
    wearableSnapshot,
    latestTest: workspace.latestTest,
    latestReport,
    latestCheckInDate: workspace.latestCheckIn?.date,
  });

  const ssidEntries = useMemo(
    () => buildWorkspaceSsidEntries(analytics, nutritionSnapshot?.bodyCompositionAnalysis?.ssid),
    [analytics, nutritionSnapshot?.bodyCompositionAnalysis?.ssid]
  );

  const timelineEvents = useMemo(() => {
    const base = workspace.timeline;
    if (!wearableSnapshot?.lastSyncAt) return base;
    const wearableEvent = {
      id: `wearable_${athlete.id}`,
      athleteId: athlete.id,
      type: 'wearables' as const,
      titleEn: 'Wearable device synced',
      titleAr: 'تمت مزامنة الجهاز',
      subtitleEn: wearableSnapshot.hrv ? `HRV ${wearableSnapshot.hrv} ms · Sleep ${wearableSnapshot.sleepDurationHours ?? '—'}h` : undefined,
      subtitleAr: wearableSnapshot.hrv ? `HRV ${wearableSnapshot.hrv} ms · نوم ${wearableSnapshot.sleepDurationHours ?? '—'} س` : undefined,
      date: wearableSnapshot.lastSyncAt.slice(0, 10),
    };
    return [wearableEvent, ...base];
  }, [athlete.id, wearableSnapshot, workspace.timeline]);

  const injuryRegions = useMemo(() => regionsWithHistory(injuryRecords, athlete.id), [injuryRecords, athlete.id]);
  const attention = useMemo(
    () => (sportsMedicine ? attentionRegions(sportsMedicine.profile) : []),
    [sportsMedicine]
  );

  const registerSection = useCallback(
    (id: CockpitSectionId) => (event: LayoutChangeEvent) => {
      sectionOffsets.current[id] = event.nativeEvent.layout.y;
    },
    []
  );

  const scrollToSection = useCallback((id: CockpitSectionId) => {
    setActiveSection(id);
    const y = sectionOffsets.current[id] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
  }, []);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y + 60;
    let current: CockpitSectionId = 'overview';
    for (const item of COCKPIT_NAV_ITEMS) {
      const offset = sectionOffsets.current[item.id];
      if (offset !== undefined && y >= offset) {
        current = item.id;
      }
    }
    setActiveSection(current);
  }, []);

  return (
    <View style={styles.root}>
      <CockpitStickyNav activeSection={activeSection} onSelect={scrollToSection} />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: theme.spacing['2xl'] }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        <View onLayout={registerSection('overview')}>
          <CockpitHero athlete={athlete} team={team} analytics={analytics} />
          <CockpitKpiGrid kpis={analytics.kpis} />
          <CockpitPerformanceSnapshot items={snapshotItems} />
          <View style={{ marginTop: theme.spacing.lg }}>
            <WorkspaceQuickActions athlete={athlete} />
          </View>
        </View>

        <View onLayout={registerSection('performance')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.cockpit.nav.performance')} subtitle={t('athleteWorkspace.analyticsSubtitle')}>
            <CockpitChartsPanel analytics={analytics} />
            <View style={{ marginTop: theme.spacing.lg }}>
              <SsidBundleSection entries={ssidEntries} compact />
            </View>
          </CockpitCollapsibleSection>
        </View>

        <View onLayout={registerSection('training')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.cockpit.nav.training')} subtitle={t('trainingBuilder.title')}>
            {trainingSnapshot ? <WorkspaceTrainingSection athleteId={athlete.id} snapshot={trainingSnapshot} /> : null}
          </CockpitCollapsibleSection>
        </View>

        <View onLayout={registerSection('recovery')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.cockpit.nav.recovery')} subtitle={t('athleteWorkspace.checkInSubtitle')}>
            <WorkspaceCheckInStrip athleteId={athlete.id} checkIn={workspace.latestCheckIn} />
            <View style={{ marginTop: theme.spacing.md }}>
              <WorkspaceRecoverySection athleteId={athlete.id} checkIn={workspace.latestCheckIn} />
            </View>
          </CockpitCollapsibleSection>
        </View>

        <View onLayout={registerSection('nutrition')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.cockpit.nav.nutrition')} subtitle={t('nutrition.title')}>
            {nutritionSnapshot ? <WorkspaceNutritionSection athleteId={athlete.id} snapshot={nutritionSnapshot} /> : null}
          </CockpitCollapsibleSection>
        </View>

        <View onLayout={registerSection('medical')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.cockpit.nav.medical')} subtitle={t('sportsMedicine.title')}>
            {sportsMedicine ? <WorkspaceSportsMedicineSection athleteId={athlete.id} snapshot={sportsMedicine} /> : null}
            <View style={{ marginTop: theme.spacing.lg }}>
              <CockpitBodyIntelligence
                modules={analytics.overall.modules}
                regionRisks={sportsMedicine?.profile.regional}
                injuryRegions={injuryRegions}
                attentionRegions={attention}
              />
            </View>
          </CockpitCollapsibleSection>
        </View>

        <View onLayout={registerSection('wearables')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.cockpit.nav.wearables')} subtitle={t('wearables.title')}>
            {wearableSnapshot ? <WorkspaceWearablesSection athleteId={athlete.id} snapshot={wearableSnapshot} /> : null}
          </CockpitCollapsibleSection>
        </View>

        <View onLayout={registerSection('ai')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.cockpit.nav.ai')} subtitle={t('athleteWorkspace.cockpit.aiSubtitle')}>
            <CockpitAiSummary analytics={analytics} />
            <View style={{ marginTop: theme.spacing.lg }}>
              <WorkspaceGoalsSection goals={workspace.goals} />
            </View>
          </CockpitCollapsibleSection>
        </View>

        <View onLayout={registerSection('timeline')}>
          <CockpitCollapsibleSection title={t('athleteWorkspace.timelineTitle')} subtitle={t('athleteWorkspace.timelineSubtitle')}>
            <CockpitTimeline events={timelineEvents} />
            <View style={{ marginTop: theme.spacing.lg }}>
              <AthleteProfileDetails athlete={athlete} />
            </View>
          </CockpitCollapsibleSection>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});

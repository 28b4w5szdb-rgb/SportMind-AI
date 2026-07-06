import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest, MockReport } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';
import type { TrainingBuilderSnapshot } from '@/src/features/training-builder/types';
import type { NutritionSnapshot } from '@/src/features/nutrition/types';
import type { WearableDailySnapshot } from '@/src/features/wearables/types';

import type { PerformanceSnapshotItem } from '../components/cockpit/CockpitPerformanceSnapshot';

interface CockpitPresentationInput {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics: AthleteAnalyticsSnapshot;
  trainingSnapshot: TrainingBuilderSnapshot | null;
  nutritionSnapshot: NutritionSnapshot | null;
  wearableSnapshot: WearableDailySnapshot | null;
  latestTest?: MockPerformanceTest;
  latestReport?: MockReport;
  latestCheckInDate?: string;
}

export function useAthleteCockpitPresentation({
  athlete,
  tests,
  analytics,
  trainingSnapshot,
  nutritionSnapshot,
  wearableSnapshot,
  latestTest,
  latestReport,
  latestCheckInDate,
}: CockpitPresentationInput) {
  const { t } = useTranslation();
  const teams = useMockStore((s) => s.teams);

  const team = useMemo(() => teams.find((tm) => tm.athlete_ids.includes(athlete.id)), [teams, athlete.id]);

  const latestSession = useMemo(() => {
    const sessions = trainingSnapshot?.plan?.sessions ?? [];
    return [...sessions]
      .filter((s) => s.status !== 'planned')
      .sort((a, b) => (b.execution?.logged_at ?? b.date).localeCompare(a.execution?.logged_at ?? a.date))[0];
  }, [trainingSnapshot]);

  const snapshotItems: PerformanceSnapshotItem[] = useMemo(
    () => [
      {
        id: 'test',
        icon: 'flask',
        color: '#0066FF',
        labelKey: 'athleteWorkspace.cockpit.snapshot.test',
        title: latestTest?.test_type ?? '',
        meta: latestTest ? `${latestTest.value} ${latestTest.unit} · ${latestTest.date}` : undefined,
        emptyKey: 'athleteWorkspace.noLatestTest',
      },
      {
        id: 'session',
        icon: 'barbell',
        color: '#8B5CF6',
        labelKey: 'athleteWorkspace.cockpit.snapshot.session',
        title: latestSession ? t(latestSession.titleKey) : '',
        meta: latestSession ? `${latestSession.date} · ${latestSession.status}` : undefined,
        emptyKey: 'athleteWorkspace.cockpit.snapshot.noSession',
      },
      {
        id: 'nutrition',
        icon: 'nutrition',
        color: '#F97316',
        labelKey: 'athleteWorkspace.cockpit.snapshot.nutrition',
        title: nutritionSnapshot?.log ? t('athleteWorkspace.cockpit.snapshot.nutritionLogged') : '',
        meta: nutritionSnapshot?.log
          ? `${nutritionSnapshot.log.meals.reduce((s, m) => s + m.calories, 0)} kcal`
          : undefined,
        emptyKey: 'athleteWorkspace.cockpit.snapshot.noNutrition',
      },
      {
        id: 'recovery',
        icon: 'heart',
        color: '#10B981',
        labelKey: 'athleteWorkspace.cockpit.snapshot.recovery',
        title: latestCheckInDate ? t('athleteWorkspace.latestCheckIn') : '',
        meta: latestCheckInDate,
        emptyKey: 'athleteWorkspace.noCheckIn',
      },
      {
        id: 'wearable',
        icon: 'watch',
        color: '#0EA5E9',
        labelKey: 'athleteWorkspace.cockpit.snapshot.wearable',
        title: wearableSnapshot?.lastSyncAt ? t('athleteWorkspace.cockpit.snapshot.synced') : '',
        meta: wearableSnapshot?.lastSyncAt?.slice(0, 16).replace('T', ' '),
        emptyKey: 'athleteWorkspace.cockpit.snapshot.noWearable',
      },
      {
        id: 'report',
        icon: 'document-text',
        color: '#64748B',
        labelKey: 'athleteWorkspace.cockpit.snapshot.report',
        title: latestReport?.title ?? '',
        meta: latestReport?.created_at.slice(0, 10),
        emptyKey: 'athleteWorkspace.cockpit.snapshot.noReport',
      },
    ],
    [latestCheckInDate, latestReport, latestSession, latestTest, nutritionSnapshot, t, wearableSnapshot]
  );

  return { team, snapshotItems };
}

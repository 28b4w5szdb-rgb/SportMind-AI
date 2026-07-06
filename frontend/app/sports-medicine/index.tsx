import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { SportsMedicinePanel, useSportsMedicineSnapshot } from '@/src/features/sports-medicine';
import { injuryHistoryForAthlete } from '@/src/features/sports-medicine/utils/sportsMedicineHelpers';
import { useLatestCheckInForAthlete, useTestsForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';

export default function SportsMedicineScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athletes = useMockStore((s) => s.athletes);
  const injuryRecords = useMockStore((s) => s.injuryRecords);

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const athlete = athletes.find((a) => a.id === selectedAthleteId);
  const tests = useTestsForAthlete(selectedAthleteId);
  const checkIn = useLatestCheckInForAthlete(selectedAthleteId);
  const snapshot = useSportsMedicineSnapshot(athlete, tests, checkIn);
  const history = injuryHistoryForAthlete(injuryRecords, selectedAthleteId);

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('sportsMedicine.title')}>
        <EmptyState icon="medkit-outline" title={t('athletes.emptyRoster.title')} description={t('athletes.emptyRoster.description')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen
      title={t('sportsMedicine.title')}
      subtitle={t('sportsMedicine.subtitle')}
      rightAction={{ icon: 'add-circle-outline', onPress: () => router.push(APP_ROUTES.addInjury(selectedAthleteId)) }}
    >
      <View style={{ marginBottom: theme.spacing.lg }}>
        <SectionHeader title={t('dailyCheckIn.selectAthlete')} titleSize="label" style={{ marginBottom: theme.spacing[2], marginTop: 0 }} />
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>

      {snapshot ? <SportsMedicinePanel snapshot={snapshot} /> : null}

      {history.length > 0 ? (
        <View style={{ marginTop: theme.spacing.lg }}>
          <SectionHeader title={t('sportsMedicine.injuryHistory')} titleSize="h5" style={{ marginTop: 0 }} />
          {history.map((inj) => (
            <TouchableOpacity key={inj.id} activeOpacity={0.85}>
              <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600' }]}>
                  {t(`sportsMedicine.regions.${inj.body_region}`)} · {inj.injury_date}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                  {t(`sportsMedicine.status.${inj.status}`)} · {t(`sportsMedicine.severity.${inj.severity_grade}`)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </FeatureScrollScreen>
  );
}

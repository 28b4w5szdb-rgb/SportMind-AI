import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { TeamIntelligencePanel, useTeamIntelligence } from '@/src/features/team-intelligence';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function TeamIntelligenceScreen() {
  const { teamId: teamIdParam } = useLocalSearchParams<{ teamId?: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const teams = useMockStore((s) => s.teams);

  const [filterTeamId, setFilterTeamId] = useState<string | undefined>(undefined);
  const activeTeamId = teamIdParam ?? filterTeamId;
  const snapshot = useTeamIntelligence(activeTeamId);

  const subtitle = snapshot.teamName ?? t('teamIntelligence.allAthletes');

  return (
    <FeatureScrollScreen title={t('teamIntelligence.title')} subtitle={subtitle}>
      {teams.length > 0 && !teamIdParam ? (
        <View style={{ flexDirection: flexRow(true), gap: 12, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
          <Text
            onPress={() => setFilterTeamId(undefined)}
            style={[type.bodySm, { color: !activeTeamId ? theme.colors.primary : theme.colors.textSecondary, fontWeight: !activeTeamId ? '700' : '400', textAlign: textAlign('start') }]}
          >
            {t('teamIntelligence.allAthletes')}
          </Text>
          {teams.map((team) => (
            <Text
              key={team.id}
              onPress={() => setFilterTeamId(team.id)}
              style={[type.bodySm, { color: activeTeamId === team.id ? theme.colors.primary : theme.colors.textSecondary, fontWeight: activeTeamId === team.id ? '700' : '400', textAlign: textAlign('start') }]}
            >
              {team.name}
            </Text>
          ))}
        </View>
      ) : null}

      <TeamIntelligencePanel snapshot={snapshot} showOpenLink={false} />
    </FeatureScrollScreen>
  );
}

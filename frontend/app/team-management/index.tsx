/**
 * SportMind AI - Team Management
 */

import React from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/src/components/common/Button';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function TeamManagementScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const teams = useMockStore((s) => s.teams);

  return (
    <FeatureScrollScreen
      title={t('features.team.title')}
      rightAction={{
        icon: 'add',
        onPress: () => router.push(APP_ROUTES.teamNew),
      }}
    >
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('features.team.subtitle')}
      </Text>

      {teams.length === 0 ? (
        <EmptyState
          icon="people-circle"
          title={t('features.team.emptyTitle')}
          description={t('features.team.emptyDesc')}
          actionLabel={t('features.team.createTeam')}
          onAction={() => router.push(APP_ROUTES.teamNew)}
        />
      ) : (
        <>
          <Button
            title={t('features.team.createTeam')}
            onPress={() => router.push(APP_ROUTES.teamNew)}
            icon="add"
            fullWidth
            style={{ marginBottom: theme.spacing.lg }}
          />
          {teams.map((team) => (
            <TouchableOpacity
              key={team.id}
              activeOpacity={0.85}
              onPress={() => {
                const names = team.athlete_ids
                  .map((id) => athletes.find((a) => a.id === id))
                  .filter(Boolean)
                  .map((a) => `${a!.first_name} ${a!.last_name}`)
                  .join(', ');
                Alert.alert(team.name, names || (isRTL ? 'لا يوجد لاعبون' : 'No athletes assigned'));
              }}
            >
            <Card key={team.id} variant="elevated" padding="lg" style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius['2xl'] }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: theme.borderRadius.xl,
                    backgroundColor: theme.colors.primary + '18',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="shield" size={26} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                  <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{team.name}</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                    {team.sport}
                    {team.head_coach ? ` · ${team.head_coach}` : ''}
                  </Text>
                  <Text style={[type.bodySm, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                    {t('features.team.members', { count: team.athlete_ids.length })}
                  </Text>
                </View>
              </View>
            </Card>
            </TouchableOpacity>
          ))}
        </>
      )}
    </FeatureScrollScreen>
  );
}

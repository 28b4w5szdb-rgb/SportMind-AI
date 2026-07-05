/**
 * SportMind AI - Team Management
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  const { flexRow, textAlign, chevronIcon } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const teams = useMockStore((s) => s.teams);

  const stats = useMemo(
    () => ({
      teams: teams.length,
      rosterSlots: teams.reduce((n, team) => n + team.athlete_ids.length, 0),
      avgRoster: teams.length ? Math.round(teams.reduce((n, team) => n + team.athlete_ids.length, 0) / teams.length) : 0,
    }),
    [teams]
  );

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

      {teams.length > 0 && (
        <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
          {[
            { label: t('features.team.statsTeams'), value: stats.teams },
            { label: t('features.team.statsRoster'), value: stats.rosterSlots },
            { label: t('features.team.statsAvg'), value: stats.avgRoster },
          ].map((s) => (
            <Card key={s.label} variant="filled" padding="md" style={{ flex: 1, borderRadius: theme.borderRadius.xl }}>
              <Text style={[type.numberSm, { color: theme.colors.primary }]}>{s.value}</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]} numberOfLines={2}>
                {s.label}
              </Text>
            </Card>
          ))}
        </View>
      )}

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
          {teams.map((team) => {
            const rosterPreview = team.athlete_ids
              .slice(0, 3)
              .map((aid) => athletes.find((a) => a.id === aid))
              .filter(Boolean)
              .map((a) => a!.first_name)
              .join(', ');
            return (
              <TouchableOpacity key={team.id} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.teamDetail(team.id))}>
                <Card variant="elevated" padding="lg" style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius['2xl'], ...theme.shadows.sm }}>
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
                        {rosterPreview ? ` · ${rosterPreview}` : ''}
                      </Text>
                    </View>
                    <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </FeatureScrollScreen>
  );
}

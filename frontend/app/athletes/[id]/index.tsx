import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const athlete = useMockStore((s) => s.getAthlete(id ?? ''));

  if (!athlete) {
    return (
      <FeatureScrollScreen title={t('features.athletes.detailTitle')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
          {t('states.empty.defaultDescription')}
        </Text>
      </FeatureScrollScreen>
    );
  }

  const fullName = `${athlete.first_name} ${athlete.last_name}`;
  const trendColor = athlete.trend_percent >= 0 ? theme.colors.success : theme.colors.warning;

  return (
    <FeatureScrollScreen
      title={t('features.athletes.detailTitle')}
      rightAction={{
        icon: 'create-outline',
        onPress: () => router.push(APP_ROUTES.athleteEdit(athlete.id)),
      }}
    >
      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg }}>
        <View style={[styles.header, { flexDirection: flexRow(true), alignItems: 'center' }]}>
          <LinearGradient
            colors={['#0066FF', '#0D9488']}
            style={[styles.avatar, { borderRadius: theme.borderRadius['2xl'] }]}
          >
            <Text style={[type.h3, { color: '#FFF' }]}>
              {athlete.first_name[0]}
              {athlete.last_name[0]}
            </Text>
          </LinearGradient>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h3, { color: theme.colors.text, textAlign: textAlign('start') }]}>{fullName}</Text>
            <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
              {athlete.position}
            </Text>
            <Badge
              label={t(`features.athletes.status.${athlete.status}`)}
              variant={athlete.status === 'active' ? 'success' : athlete.status === 'injured' ? 'warning' : 'info'}
              style={{ marginTop: theme.spacing.sm, alignSelf: 'flex-start' }}
            />
          </View>
        </View>
      </Card>

      <View style={[styles.statsRow, { flexDirection: flexRow(true), gap: theme.spacing.md }]}>
        <Card variant="filled" padding="md" style={{ flex: 1, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('features.athletes.testsCount', { count: athlete.tests_count })}</Text>
          <Text style={[type.numberSm, { color: theme.colors.text, marginTop: 4 }]}>{athlete.tests_count}</Text>
        </Card>
        <Card variant="filled" padding="md" style={{ flex: 1, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('features.athletes.trend')}</Text>
          <Text style={[type.numberSm, { color: trendColor, marginTop: 4 }]}>
            {athlete.trend_percent > 0 ? '+' : ''}
            {athlete.trend_percent}%
          </Text>
        </Card>
      </View>

      <Card variant="outlined" padding="lg" style={{ marginTop: theme.spacing.lg, borderRadius: theme.borderRadius.xl }}>
        {[
          { label: t('features.athletes.fields.jerseyNumber'), value: athlete.jersey_number ?? '—' },
          { label: t('features.athletes.fields.height'), value: athlete.height_cm ? `${athlete.height_cm} cm` : '—' },
          { label: t('features.athletes.fields.weight'), value: athlete.weight_kg ? `${athlete.weight_kg} kg` : '—' },
          { label: t('features.athletes.fields.dateOfBirth'), value: athlete.date_of_birth ?? '—' },
          { label: t('features.athletes.fields.nationality'), value: athlete.nationality ?? '—' },
        ].map((row) => (
          <View key={row.label} style={[styles.detailRow, { flexDirection: flexRow(true), borderBottomColor: theme.colors.border }]}>
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, flex: 1 }]}>{row.label}</Text>
            <Text style={[type.body, { color: theme.colors.text }]}>{String(row.value)}</Text>
          </View>
        ))}
      </Card>

      <Button
        title={t('common.edit')}
        onPress={() => router.push(APP_ROUTES.athleteEdit(athlete.id))}
        variant="outline"
        fullWidth
        icon="create-outline"
        style={{ marginTop: theme.spacing.xl }}
      />
    </FeatureScrollScreen>
  );
}

const styles = StyleSheet.create({
  header: {},
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {},
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

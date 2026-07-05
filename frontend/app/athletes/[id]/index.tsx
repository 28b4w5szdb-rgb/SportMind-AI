import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Badge } from '@/src/components/common/Badge';
import { ReadinessScore } from '@/src/components/features/ReadinessScore';
import { AthleteAnalyticsSection } from '@/src/components/analytics';
import { useAthleteAnalytics } from '@/src/analytics';
import { useAthleteById, useTestsForAthlete } from '@/src/data/mock/hooks';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { computeReadinessScore, injuryRisk, readinessLabel } from '@/src/utils/athleteMetrics';

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const athlete = useAthleteById(id);
  const tests = useTestsForAthlete(id);
  const analytics = useAthleteAnalytics(athlete, tests);

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
  const readiness = computeReadinessScore(athlete);
  const injury = injuryRisk(athlete);
  const injuryVariant = injury === 'high' ? 'error' : injury === 'medium' ? 'warning' : 'success';

  return (
    <FeatureScrollScreen
      title={t('features.athletes.detailTitle')}
      rightAction={{ icon: 'create-outline', onPress: () => router.push(APP_ROUTES.athleteEdit(athlete.id)) }}
    >
      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, ...theme.shadows.md }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <LinearGradient colors={['#0066FF', '#0D9488']} style={{ width: 72, height: 72, borderRadius: theme.borderRadius['2xl'], alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[type.h3, { color: '#FFF' }]}>{athlete.first_name[0]}{athlete.last_name[0]}</Text>
          </LinearGradient>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h3, { color: theme.colors.text, textAlign: textAlign('start') }]}>{fullName}</Text>
            <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{athlete.position}</Text>
            <View style={{ flexDirection: flexRow(true), gap: 8, marginTop: theme.spacing.sm, flexWrap: 'wrap' }}>
              <Badge label={t(`features.athletes.status.${athlete.status}`)} variant={athlete.status === 'active' ? 'success' : athlete.status === 'injured' ? 'warning' : 'info'} />
              <Badge label={isRTL ? `خطر: ${injury}` : `Injury: ${injury}`} variant={injuryVariant} />
            </View>
          </View>
          <ReadinessScore score={readiness} label={readinessLabel(readiness, isRTL)} size="lg" />
        </View>
      </Card>

      <View style={{ flexDirection: flexRow(true), gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <Card variant="filled" padding="md" style={{ flex: 1, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('features.athletes.testsCount', { count: athlete.tests_count })}</Text>
          <Text style={[type.numberSm, { color: theme.colors.text, marginTop: 4 }]}>{athlete.tests_count}</Text>
        </Card>
        <Card variant="filled" padding="md" style={{ flex: 1, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('features.athletes.trend')}</Text>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginTop: 4 }}>
            <Ionicons name={athlete.trend_percent >= 0 ? 'trending-up' : 'trending-down'} size={18} color={trendColor} />
            <Text style={[type.numberSm, { color: trendColor, marginStart: 4 }]}>
              {athlete.trend_percent > 0 ? '+' : ''}{athlete.trend_percent}%
            </Text>
          </View>
        </Card>
      </View>

      {analytics ? <AthleteAnalyticsSection analytics={analytics} /> : null}

      {tests.length > 0 && (
        <Card variant="outlined" padding="lg" style={{ marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.h5, { color: theme.colors.text, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
            {isRTL ? 'سجل الاختبارات' : 'Test history'}
          </Text>
          {tests.map((test) => (
            <View key={test.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
              <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>{test.test_type}</Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                {test.value} {test.unit} · {test.date}
              </Text>
            </View>
          ))}
        </Card>
      )}

      <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl }}>
        {[
          { label: t('features.athletes.fields.jerseyNumber'), value: athlete.jersey_number ?? '—' },
          { label: t('features.athletes.fields.height'), value: athlete.height_cm ? `${athlete.height_cm} cm` : '—' },
          { label: t('features.athletes.fields.weight'), value: athlete.weight_kg ? `${athlete.weight_kg} kg` : '—' },
          { label: t('features.athletes.fields.dateOfBirth'), value: athlete.date_of_birth ?? '—' },
          { label: t('features.athletes.fields.nationality'), value: athlete.nationality ?? '—' },
        ].map((row) => (
          <View key={row.label} style={{ flexDirection: flexRow(true), paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border, justifyContent: 'space-between' }}>
            <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{row.label}</Text>
            <Text style={[type.body, { color: theme.colors.text }]}>{String(row.value)}</Text>
          </View>
        ))}
      </Card>

      <Button title={t('common.edit')} onPress={() => router.push(APP_ROUTES.athleteEdit(athlete.id))} variant="outline" fullWidth icon="create-outline" style={{ marginTop: theme.spacing.xl }} />
      <Button title={isRTL ? 'تسجيل اختبار' : 'Record test'} onPress={() => router.push(APP_ROUTES.performanceLabEntry)} variant="primary" fullWidth icon="analytics" style={{ marginTop: theme.spacing.md }} />
    </FeatureScrollScreen>
  );
}

/**
 * SportMind AI — Executive Dashboard (Phase 5B)
 * Premium sports science command center.
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { LanguageToggle } from '@/src/components/common/LanguageToggle';
import { ReadinessScore } from '@/src/components/features/ReadinessScore';
import { Card } from '@/src/components/common/Card';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { computeReadinessScore, readinessLabel } from '@/src/utils/athleteMetrics';
import {
  useDashboardPresentation,
  DashboardHero,
  DashboardKpiGrid,
  DashboardChartsPanel,
  DashboardTodayCenter,
  DashboardTeamIntelligence,
  DashboardQuickActions,
} from '@/src/features/dashboard';

export default function DashboardScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { width: windowWidth } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const data = useDashboardPresentation();

  const kpiColumns = isDesktop ? 4 : 2;
  const quickColumns = isDesktop ? 3 : 2;
  const chartWidth = isDesktop ? 320 : Math.min(windowWidth - 64, 300);
  const contentMaxWidth = isDesktop ? 1400 : undefined;

  const todayItems = useMemo(
    () => [
      {
        id: 'training',
        icon: 'barbell' as const,
        title: t('dashboard.today.training'),
        value:
          data.trainingDashboard.sessionsToday > 0
            ? t('dashboard.today.trainingValue', {
                logged: data.trainingDashboard.loggedToday,
                total: data.trainingDashboard.sessionsToday,
              })
            : t('dashboard.today.noSessions'),
        meta: `${t('trainingBuilder.complianceTitle')}: ${data.trainingDashboard.avgCompliance}%`,
        color: '#0066FF',
        route: APP_ROUTES.trainingBuilder() as string,
      },
      {
        id: 'checkin',
        icon: 'clipboard-outline' as const,
        title: t('dashboard.today.checkIn'),
        value: t('dashboard.today.checkInValue', { count: data.checkInsToday, total: data.athletes.length }),
        meta: t('dashboard.today.checkInMeta'),
        color: '#10B981',
        route: APP_ROUTES.dailyCheckIn() as string,
      },
      {
        id: 'recovery',
        icon: 'heart' as const,
        title: t('dashboard.today.recovery'),
        value: `${data.teamAnalytics.avgRecovery}%`,
        meta: t('dashboard.today.recoveryMeta'),
        color: '#0D9488',
        route: APP_ROUTES.recoveryCenter() as string,
      },
      {
        id: 'nutrition',
        icon: 'nutrition' as const,
        title: t('dashboard.today.nutrition'),
        value: t('dashboard.today.nutritionValue', {
          logged: data.nutritionDashboard.logsToday,
          total: data.athletes.length,
        }),
        meta: `${t('nutrition.complianceLabel')}: ${data.nutritionDashboard.avgCompliance}%`,
        color: '#F97316',
        route: APP_ROUTES.nutritionCenter() as string,
      },
      {
        id: 'wearables',
        icon: 'watch' as const,
        title: t('dashboard.today.wearables'),
        value: t('dashboard.today.wearablesValue', {
          synced: data.wearablesDashboard.syncedToday,
          connected: data.wearablesDashboard.connectedAthletes,
          total: data.wearablesDashboard.totalAthletes,
        }),
        meta: t('wearables.dashboardMeta', {
          synced: data.wearablesDashboard.syncedToday,
          hrv: data.wearablesDashboard.avgHrv || '—',
          sleep: data.wearablesDashboard.avgSleep || '—',
        }),
        color: '#0EA5E9',
        route: APP_ROUTES.wearables() as string,
      },
    ],
    [data, t]
  );

  const sectionStyle = { maxWidth: contentMaxWidth, marginHorizontal: isDesktop ? ('auto' as const) : undefined, width: '100%' as const };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: theme.spacing[20],
          paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerRow, sectionStyle, { paddingTop: isDesktop ? theme.spacing[8] : theme.spacing[5], paddingBottom: theme.spacing[2] }]}>
          <View style={{ flex: 1 }} />
          <LanguageToggle />
        </View>

        <View style={[styles.section, sectionStyle]}>
          <DashboardHero
            greetingKey={data.greetingKey}
            formattedDate={data.formattedDate}
            teamAnalytics={data.teamAnalytics}
            squadIntelligence={data.squadIntelligence}
            aiSummary={data.aiSummary}
            isDesktop={isDesktop}
          />
        </View>

        <View style={[styles.section, sectionStyle]}>
          <DashboardKpiGrid kpis={data.kpis} columns={kpiColumns} />
        </View>

        <View style={[styles.section, sectionStyle]}>
          <DashboardChartsPanel
            performanceTrend={data.performanceTrend}
            readinessTrend={data.readinessTrend}
            trainingLoadBars={data.trainingLoadBars}
            riskDistribution={data.riskDistribution}
            chartWidth={chartWidth}
            isDesktop={isDesktop || isTablet}
          />
        </View>

        <View style={[styles.section, sectionStyle]}>
          <DashboardTodayCenter items={todayItems} isDesktop={isDesktop} />
        </View>

        {data.teamAnalytics.snapshots.length > 0 ? (
          <View style={[styles.section, sectionStyle]}>
            <SectionHeader title={t('dashboard.readinessStrip')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing[3] }}>
              {data.teamAnalytics.snapshots.slice(0, 8).map(({ athlete: a, analytics }) => {
                const readiness = analytics.kpis.find((k) => k.id === 'readiness');
                const score = readiness?.value ?? computeReadinessScore(a);
                return (
                  <TouchableOpacity key={a.id} activeOpacity={theme.tokens.interaction.activeOpacity} onPress={() => router.push(APP_ROUTES.athleteDetail(a.id))}>
                    <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius[theme.tokens.radius.card], minWidth: 120, alignItems: 'center' }}>
                      <ReadinessScore score={score} label={readinessLabel(score, isRTL)} size="md" />
                      <Text style={[type.caption, { color: theme.colors.text, marginTop: theme.spacing[2], textAlign: 'center' }]} numberOfLines={1}>
                        {a.first_name}
                      </Text>
                      <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: 'center' }]}>
                        {analytics.overall.score}/1000
                      </Text>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        <View style={[styles.section, sectionStyle]}>
          <DashboardTeamIntelligence squadIntelligence={data.squadIntelligence} weeklyFocus={data.weeklyFocus} isDesktop={isDesktop} />
        </View>

        <View style={[styles.section, sectionStyle]}>
          <DashboardQuickActions actions={data.quickActions} columns={quickColumns} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  section: { marginTop: 24 },
});

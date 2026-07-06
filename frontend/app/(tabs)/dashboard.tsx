/**
 * SportMind AI - Dashboard Screen
 * Premium bilingual (AR/EN) dashboard with RTL-aware layout,
 * responsive design for web/tablet/mobile, and modern card designs.
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { LanguageToggle } from '@/src/components/common/LanguageToggle';
import { ReadinessScore } from '@/src/components/features/ReadinessScore';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { computeReadinessScore, readinessLabel } from '@/src/utils/athleteMetrics';
import { useTeamAnalyticsOverview, buildAiSummaryFromAnalytics } from '@/src/analytics';
import { computeCompliance, findTodaySession, todayDateKey } from '@/src/features/training-builder';
import { buildAthleteNutritionSnapshot } from '@/src/features/nutrition/utils/nutritionHelpers';
import { computeAthleteAnalytics } from '@/src/analytics';
import { ProgressRingChart } from '@/src/components/charts';

function getGreetingKey(): string {
  const h = new Date().getHours();
  if (h < 12) return 'dashboard.greetingMorning';
  if (h < 18) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
}

const quickActions = [
  { id: '1', key: 'actions.aiCoach', icon: 'sparkles' as const, color: '#0066FF', route: '/(tabs)/ai-coach' },
  { id: '2', key: 'actions.calculator', icon: 'calculator' as const, color: '#F97316', route: '/calculator' },
  { id: '3', key: 'actions.reports', icon: 'document-text' as const, color: '#10B981', route: '/reports' },
  { id: '4', key: 'actions.research', icon: 'book' as const, color: '#8B5CF6', route: '/research' },
] as const;

const statsMeta = [
  { id: 'overall', icon: 'trophy' as const, key: 'analytics.overallScore', color: '#0066FF' },
  { id: 'readiness', icon: 'flash' as const, key: 'analytics.kpi.readiness', color: '#10B981' },
  { id: 'fatigue', icon: 'battery-dead' as const, key: 'analytics.kpi.fatigue', color: '#F97316' },
  { id: 'recovery', icon: 'heart' as const, key: 'analytics.kpi.recovery', color: '#0D9488' },
  { id: 'load', icon: 'barbell' as const, key: 'analytics.kpi.trainingLoad', color: '#8B5CF6' },
  { id: 'injury', icon: 'medkit' as const, key: 'analytics.kpi.injuryRisk', color: '#EF4444' },
];


const recentActivities = [
  { id: '1', icon: 'fitness', title: 'Training Session', subtitle: '2 hours ago', color: '#F97316' },
  { id: '2', icon: 'analytics', title: 'New Test Results', subtitle: 'Yesterday', color: '#0066FF' },
  { id: '3', icon: 'people', title: 'Athlete Added', subtitle: '2 days ago', color: '#10B981' },
];

export default function DashboardScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { width: windowWidth } = useWindowDimensions();

  // Responsive breakpoints
  const isWeb = Platform.OS === 'web';
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const teamAnalytics = useTeamAnalyticsOverview();

  const injuredCount = useMemo(() => athletes.filter((a) => a.status === 'injured').length, [athletes]);

  const trainingDashboard = useMemo(() => {
    const today = todayDateKey();
    let sessionsToday = 0;
    let loggedToday = 0;
    let complianceTotal = 0;
    let complianceCount = 0;
    for (const athlete of athletes) {
      const plan = trainingPlans.find((p) => p.athlete_id === athlete.id && p.is_active) ?? trainingPlans.find((p) => p.athlete_id === athlete.id);
      if (!plan) continue;
      const compliance = computeCompliance(plan, today);
      complianceTotal += compliance.compliancePercent;
      complianceCount += 1;
      const session = findTodaySession(plan, today);
      if (session) {
        sessionsToday += 1;
        if (session.status !== 'planned') loggedToday += 1;
      }
    }
    return {
      sessionsToday,
      loggedToday,
      avgCompliance: complianceCount > 0 ? Math.round(complianceTotal / complianceCount) : 0,
    };
  }, [athletes, trainingPlans]);

  const nutritionDashboard = useMemo(() => {
    const today = todayDateKey();
    let logsToday = 0;
    let complianceTotal = 0;
    let complianceCount = 0;
    let hydrationTotal = 0;

    for (const athlete of athletes) {
      const log = nutritionLogs.find((l) => l.athlete_id === athlete.id && l.date === today);
      if (log) logsToday += 1;
      const checkIn = dailyCheckIns
        .filter((c) => c.athlete_id === athlete.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      const analytics = computeAthleteAnalytics({
        athlete,
        tests: tests.filter((t) => t.athlete_id === athlete.id),
        checkIn,
        injuries: injuryRecords.filter((i) => i.athlete_id === athlete.id),
        trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      });
      const snapshot = buildAthleteNutritionSnapshot({
        athlete,
        analytics,
        logs: nutritionLogs,
        bodyRecords: bodyCompositionRecords,
        goalSettings: nutritionGoalSettings,
        checkIn,
        trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
        dateKey: today,
      });
      complianceTotal += snapshot.compliancePercent;
      hydrationTotal += snapshot.hydration.hydrationPercent;
      complianceCount += 1;
    }

    return {
      logsToday,
      avgCompliance: complianceCount > 0 ? Math.round(complianceTotal / complianceCount) : 0,
      avgHydration: complianceCount > 0 ? Math.round(hydrationTotal / complianceCount) : 0,
    };
  }, [athletes, tests, trainingPlans, dailyCheckIns, injuryRecords, nutritionLogs, bodyCompositionRecords, nutritionGoalSettings]);

  const statsData = useMemo(
    () =>
      statsMeta.map((stat) => {
        let value = '0';
        let trend = '—';
        if (stat.id === 'overall') {
          value = String(teamAnalytics.avgOverallScore);
          trend = teamAnalytics.avgOverallScore >= 600 ? '+↑' : '→';
        } else if (stat.id === 'readiness') {
          value = `${teamAnalytics.avgReadiness}%`;
          trend = teamAnalytics.avgReadiness >= 70 ? '+↑' : '↓';
        } else if (stat.id === 'fatigue') {
          value = `${teamAnalytics.avgFatigue}%`;
          trend = teamAnalytics.avgFatigue <= 40 ? '↓' : '↑';
        } else if (stat.id === 'recovery') {
          value = `${teamAnalytics.avgRecovery}%`;
          trend = '+';
        } else if (stat.id === 'load') {
          value = `${teamAnalytics.avgTrainingLoad}%`;
          trend = '→';
        } else if (stat.id === 'injury') {
          value = `${teamAnalytics.avgInjuryRisk}%`;
          trend = teamAnalytics.avgInjuryRisk <= 30 ? '↓' : '↑';
        }
        return { ...stat, value, trend };
      }),
    [teamAnalytics]
  );

  const aiSummary = useMemo(() => buildAiSummaryFromAnalytics(teamAnalytics, isRTL), [teamAnalytics, isRTL]);

  const trendBars = useMemo(() => {
    const weekly = teamAnalytics.snapshots[0]?.analytics.trends.find((tr) => tr.period === 'weekly');
    if (!weekly || weekly.points.length === 0) {
      return [
        { labelEn: 'Mon', labelAr: 'إث', value: 65, color: '#0066FF' },
        { labelEn: 'Tue', labelAr: 'ثل', value: 78, color: '#0066FF' },
        { labelEn: 'Wed', labelAr: 'أر', value: 55, color: '#10B981' },
        { labelEn: 'Thu', labelAr: 'خم', value: 82, color: '#0066FF' },
        { labelEn: 'Fri', labelAr: 'جم', value: 70, color: '#F97316' },
        { labelEn: 'Sat', labelAr: 'سب', value: 45, color: '#10B981' },
        { labelEn: 'Sun', labelAr: 'أح', value: 30, color: '#8B5CF6' },
      ];
    }
    const labels = [
      { en: 'Mon', ar: 'إث' },
      { en: 'Tue', ar: 'ثل' },
      { en: 'Wed', ar: 'أر' },
      { en: 'Thu', ar: 'خم' },
      { en: 'Fri', ar: 'جم' },
      { en: 'Sat', ar: 'سب' },
      { en: 'Sun', ar: 'أح' },
    ];
    return weekly.points.slice(0, 7).map((p, i) => ({
      labelEn: labels[i]?.en ?? `D${i + 1}`,
      labelAr: labels[i]?.ar ?? `${i + 1}`,
      value: Math.max(20, Math.min(100, p.value)),
      color: i % 2 === 0 ? '#0066FF' : '#10B981',
    }));
  }, [teamAnalytics.snapshots]);

  const todayItems = useMemo(
    () => [
      {
        id: '1',
        icon: 'fitness' as const,
        titleEn: `${tests.length} tests logged`,
        titleAr: `${tests.length} اختبار مسجل`,
        subEn: 'Performance Lab',
        subAr: 'مختبر الأداء',
        color: '#0066FF',
        route: '/performance-lab/entry' as const,
      },
      {
        id: '2',
        icon: 'people' as const,
        titleEn: `${athletes.filter((a) => a.status === 'active').length} active athletes`,
        titleAr: `${athletes.filter((a) => a.status === 'active').length} لاعب نشط`,
        subEn: 'Roster status',
        subAr: 'حالة التشكيلة',
        color: '#10B981',
        route: '/(tabs)/athletes' as const,
      },
      {
        id: '3',
        icon: 'sparkles' as const,
        titleEn: 'AI insight ready',
        titleAr: 'رؤية ذكية جاهزة',
        subEn: 'Open AI Coach',
        subAr: 'افتح المدرب الذكي',
        color: '#8B5CF6',
        route: '/(tabs)/ai-coach' as const,
      },
    ],
    [athletes, tests.length]
  );

  const gridConfig = useMemo(() => {
    if (isDesktop) return { columns: 4, cardWidth: 260, gap: 16 };
    if (isTablet) return { columns: 2, cardWidth: 280, gap: 14 };
    return { columns: 2, cardWidth: (windowWidth - 40) / 2, gap: 10 };
  }, [windowWidth, isDesktop, isTablet]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          paddingBottom: theme.spacing[20],
          paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={[
            styles.headerRow,
            {
              flexDirection: flexRow(true),
              paddingTop: isDesktop ? theme.spacing[8] : theme.spacing[5],
              paddingBottom: theme.spacing[4],
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                type.overline,
                {
                  color: theme.colors.textSecondary,
                  textAlign: textAlign('start'),
                  letterSpacing: 2,
                },
              ]}
            >
              {t(getGreetingKey()).toUpperCase()}
            </Text>
            <Text
              style={[
                type.displayMedium,
                {
                  color: theme.colors.text,
                  textAlign: textAlign('start'),
                  marginTop: theme.spacing[1],
                },
              ]}
            >
              {t('dashboard.title')}
            </Text>
            <Text
              style={[
                type.body,
                {
                  color: theme.colors.textSecondary,
                  textAlign: textAlign('start'),
                  marginTop: theme.spacing[2],
                },
              ]}
            >
              {t('dashboard.welcome')}
            </Text>
          </View>
          <LanguageToggle />
        </View>

        {/* Stats Overview */}
        <View
          style={[
            styles.section,
            {
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            },
          ]}
        >
          <Text
            style={[
              type.h4,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing[3],
                textAlign: textAlign('start'),
              },
            ]}
          >
            {t('dashboard.overview')}
          </Text>
          <View
            style={[
              styles.statsGrid,
              {
                flexDirection: flexRow(true),
                gap: gridConfig.gap,
              },
            ]}
          >
            {statsData.map((stat) => (
              <TouchableOpacity key={stat.id} activeOpacity={0.85} style={{ flex: 1, minWidth: isDesktop ? 200 : '45%' }}>
                <Card
                  variant="elevated"
                  padding="none"
                  style={{ borderRadius: theme.borderRadius['2xl'] }}
                >
                  <LinearGradient
                    colors={[stat.color + '15', stat.color + '05']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      padding: theme.spacing[5],
                      minHeight: isDesktop ? 160 : 130,
                    }}
                  >
                    <View style={[styles.statsHeader, { flexDirection: flexRow(true) }]}>
                      <View
                        style={[
                          styles.statIcon,
                          {
                            backgroundColor: stat.color + '20',
                            borderRadius: theme.borderRadius.lg,
                          },
                        ]}
                      >
                        <Ionicons name={stat.icon} size={22} color={stat.color} />
                      </View>
                      <View style={[styles.statTrend, { backgroundColor: stat.color + '15', borderRadius: theme.borderRadius.full }]}>
                        <Text style={[type.captionMd, { color: stat.color, fontWeight: '600' }]}>
                          {stat.trend}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        type.numberDisplay,
                        {
                          color: theme.colors.text,
                          marginTop: theme.spacing[3],
                          fontSize: isDesktop ? 48 : 40,
                        },
                      ]}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={[
                        type.label,
                        { color: theme.colors.textSecondary, marginTop: theme.spacing[1] },
                      ]}
                    >
                      {t(stat.key)}
                    </Text>
                  </LinearGradient>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Training today */}
        {trainingDashboard.sessionsToday > 0 && (
          <View style={[styles.section, { maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }]}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.trainingBuilder() as never)}>
              <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'] }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing.md }}>
                  <View style={[styles.statIcon, { backgroundColor: '#0066FF20', borderRadius: theme.borderRadius.lg }]}>
                    <Ionicons name="barbell" size={22} color="#0066FF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.label, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                      {t('trainingBuilder.dashboardTitle')}
                    </Text>
                    <Text style={[type.h4, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>
                      {isRTL
                        ? `${trainingDashboard.loggedToday}/${trainingDashboard.sessionsToday} جلسات مسجلة اليوم`
                        : `${trainingDashboard.loggedToday}/${trainingDashboard.sessionsToday} sessions logged today`}
                    </Text>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                      {t('trainingBuilder.complianceTitle')}: {trainingDashboard.avgCompliance}%
                    </Text>
                  </View>
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* Nutrition overview */}
        {athletes.length > 0 && (
          <View style={[styles.section, { maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }]}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.nutritionCenter() as never)}>
              <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'] }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing.md }}>
                  <View style={[styles.statIcon, { backgroundColor: '#F9731620', borderRadius: theme.borderRadius.lg }]}>
                    <Ionicons name="nutrition" size={22} color="#F97316" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.label, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                      {t('nutrition.dashboardTitle')}
                    </Text>
                    <Text style={[type.h4, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>
                      {isRTL
                        ? `${nutritionDashboard.logsToday}/${athletes.length} سجلات تغذية اليوم`
                        : `${nutritionDashboard.logsToday}/${athletes.length} nutrition logs today`}
                    </Text>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                      {t('nutrition.complianceLabel')}: {nutritionDashboard.avgCompliance}% · {t('nutrition.hydrationPercent')}: {nutritionDashboard.avgHydration}%
                    </Text>
                  </View>
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* Overall score summary */}
        {teamAnalytics.athleteCount > 0 && (
          <View style={[styles.section, { maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }]}>
            <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'] }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing[4] }}>
                <ProgressRingChart
                  value={teamAnalytics.avgOverallScore}
                  max={1000}
                  size={isDesktop ? 120 : 100}
                  color={theme.colors.primary}
                >
                  <Text style={[type.h5, { color: theme.colors.text }]}>{teamAnalytics.avgOverallScore}</Text>
                </ProgressRingChart>
                <View style={{ flex: 1 }}>
                  <Text style={[type.overline, { color: theme.colors.textTertiary, letterSpacing: 1.5, textAlign: textAlign('start') }]}>
                    {t('analytics.overallScore').toUpperCase()}
                  </Text>
                  <Text style={[type.h4, { color: theme.colors.text, marginTop: theme.spacing[1], textAlign: textAlign('start') }]}>
                    {isRTL ? `متوسط الفريق: ${teamAnalytics.avgOverallScore}/1000` : `Squad average: ${teamAnalytics.avgOverallScore}/1000`}
                  </Text>
                  <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing[2], textAlign: textAlign('start') }]}>
                    {t(teamAnalytics.decisionTitleKey)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Athlete readiness summary */}
        {teamAnalytics.snapshots.length > 0 && (
          <View style={[styles.section, { maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }]}>
            <Text style={[type.h4, { color: theme.colors.text, marginBottom: theme.spacing[3], textAlign: textAlign('start') }]}>
              {isRTL ? 'جاهزية اللاعبين' : 'Athlete readiness'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing[3] }}>
              {teamAnalytics.snapshots.slice(0, 6).map(({ athlete: a, analytics }) => {
                const readiness = analytics.kpis.find((k) => k.id === 'readiness');
                const score = readiness?.value ?? computeReadinessScore(a);
                return (
                  <TouchableOpacity key={a.id} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.athleteDetail(a.id))}>
                    <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius['2xl'], minWidth: 120, alignItems: 'center', ...theme.shadows.md }}>
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
        )}

        {/* Strengths & weaknesses */}
        {teamAnalytics.athleteCount > 0 && (
          <View style={[styles.section, { maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }]}>
            <View style={{ flexDirection: flexRow(true), gap: theme.spacing[3] }}>
              <Card variant="elevated" padding="md" style={{ flex: 1, borderRadius: theme.borderRadius.xl }}>
                <Text style={[type.label, { color: theme.colors.success, marginBottom: theme.spacing[2], textAlign: textAlign('start') }]}>
                  {t('analytics.strengths')}
                </Text>
                {teamAnalytics.aggregatedStrengths.slice(0, 3).map((m) => (
                  <Text key={m.id} style={[type.bodySm, { color: theme.colors.text, marginBottom: 4, textAlign: textAlign('start') }]}>
                    • {t(m.labelKey)} ({m.score})
                  </Text>
                ))}
              </Card>
              <Card variant="elevated" padding="md" style={{ flex: 1, borderRadius: theme.borderRadius.xl }}>
                <Text style={[type.label, { color: theme.colors.warning, marginBottom: theme.spacing[2], textAlign: textAlign('start') }]}>
                  {t('analytics.weaknesses')}
                </Text>
                {teamAnalytics.aggregatedWeaknesses.slice(0, 3).map((m) => (
                  <Text key={m.id} style={[type.bodySm, { color: theme.colors.text, marginBottom: 4, textAlign: textAlign('start') }]}>
                    • {t(m.labelKey)} ({m.score})
                  </Text>
                ))}
              </Card>
            </View>
          </View>
        )}

        {/* Team overview */}
        {teamAnalytics.snapshots.length > 0 && (
          <View style={[styles.section, { maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }]}>
            <Text style={[type.h4, { color: theme.colors.text, marginBottom: theme.spacing[3], textAlign: textAlign('start') }]}>
              {isRTL ? 'نظرة الفريق' : 'Team overview'}
            </Text>
            {teamAnalytics.snapshots.map(({ athlete: a, analytics }) => (
              <TouchableOpacity key={a.id} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.athleteDetail(a.id))}>
                <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing[2] }}>
                  <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                        {a.first_name} {a.last_name}
                      </Text>
                      <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
                        {a.position} · {analytics.overall.score}/1000
                      </Text>
                    </View>
                    <Text style={[type.label, { color: theme.colors.primary }]}>
                      {analytics.kpis.find((k) => k.id === 'readiness')?.displayValue ?? '—'}
                    </Text>
                    <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.colors.textTertiary} style={{ marginStart: 8 }} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Weekly insight */}
        <View style={[styles.section, { maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }]}>
          <Card variant="gradient" padding="lg" gradientColors={['#0066FF', '#0D9488']} style={{ borderRadius: theme.borderRadius['2xl'] }}>
            <Text style={[type.overline, { color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }]}>
              {(isRTL ? 'رؤية التحليلات' : 'ANALYTICS INSIGHT').toUpperCase()}
            </Text>
            <Text style={[type.h4, { color: '#FFF', marginTop: theme.spacing[2], textAlign: textAlign('start') }]}>
              {teamAnalytics.athleteCount > 0
                ? isRTL
                  ? `متوسط الجاهزية: ${teamAnalytics.avgReadiness}%`
                  : `Avg readiness: ${teamAnalytics.avgReadiness}%`
                : isRTL
                  ? 'أضف لاعبين للتحليلات'
                  : 'Add athletes for analytics'}
            </Text>
            <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.85)', marginTop: theme.spacing[2], textAlign: textAlign('start') }]}>
              {aiSummary}
            </Text>
          </Card>
        </View>

        {/* Today Overview */}
        <View
          style={[
            styles.section,
            {
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            },
          ]}
        >
          <Text style={[type.h4, { color: theme.colors.text, marginBottom: theme.spacing[3], textAlign: textAlign('start') }]}>
            {isRTL ? 'نظرة اليوم' : 'Today'}
          </Text>
          {todayItems.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.85} onPress={() => router.push(item.route as never)}>
              <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing[2] }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                  <View style={[styles.activityIcon, { backgroundColor: item.color + '15', borderRadius: theme.borderRadius.lg }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
                    <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                      {isRTL ? item.titleAr : item.titleEn}
                    </Text>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2, textAlign: textAlign('start') }]}>
                      {isRTL ? item.subAr : item.subEn}
                    </Text>
                  </View>
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Trends */}
        <View
          style={[
            styles.section,
            {
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            },
          ]}
        >
          <Text style={[type.h4, { color: theme.colors.text, marginBottom: theme.spacing[3], textAlign: textAlign('start') }]}>
            {isRTL ? 'اتجاه الأداء' : 'Performance trend'}
          </Text>
          <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'] }}>
            <View style={[styles.trendRow, { flexDirection: flexRow(true), justifyContent: 'space-between', alignItems: 'flex-end', height: 120 }]}>
              {trendBars.map((bar) => (
                <View key={bar.labelEn} style={{ alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      width: isDesktop ? 28 : 22,
                      height: bar.value,
                      backgroundColor: bar.color,
                      borderRadius: theme.borderRadius.md,
                      opacity: 0.85,
                    }}
                  />
                  <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6 }]}>
                    {isRTL ? bar.labelAr : bar.labelEn}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View
          style={[
            styles.section,
            {
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            },
          ]}
        >
          <Text
            style={[
              type.h4,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing[3],
                textAlign: textAlign('start'),
              },
            ]}
          >
            {t('dashboard.quickActions')}
          </Text>
          <View
            style={[
              styles.actionsGrid,
              {
                flexDirection: flexRow(true),
                gap: gridConfig.gap,
              },
            ]}
          >
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => router.push(action.route as never)}
                activeOpacity={0.85}
                style={{ flex: 1, maxWidth: isDesktop ? 320 : undefined }}
              >
                <Card
                  variant="elevated"
                  padding="lg"
                  style={{
                    borderRadius: theme.borderRadius['2xl'],
                    alignItems: 'center',
                  }}
                >
                  <LinearGradient
                    colors={[action.color, action.color + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.actionGradient,
                      { borderRadius: theme.borderRadius.xl },
                    ]}
                  >
                    <Ionicons name={action.icon} size={28} color="#FFFFFF" />
                  </LinearGradient>
                  <Text
                    style={[
                      type.label,
                      {
                        color: theme.colors.text,
                        marginTop: theme.spacing[3],
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {t(action.key)}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insights */}
        <View
          style={[
            styles.section,
            {
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            },
          ]}
        >
          <Text
            style={[
              type.h4,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing[3],
                textAlign: textAlign('start'),
              },
            ]}
          >
            {t('dashboard.insights')}
          </Text>
          <Card
            variant="filled"
            padding="none"
            style={{ borderRadius: theme.borderRadius['2xl'] }}
          >
            <LinearGradient
              colors={['#0066FF08', '#0D948808']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: theme.spacing[6] }}
            >
              <View style={[styles.insightContent, { flexDirection: flexRow(true) }]}>
                <View
                  style={[
                    styles.insightIcon,
                    {
                      backgroundColor: theme.colors.primary + '15',
                      borderRadius: theme.borderRadius['3xl'],
                    },
                  ]}
                >
                  <Ionicons name="sparkles" size={32} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginHorizontal: theme.spacing[4] }}>
                  <Text style={[type.h5, { color: theme.colors.text, marginBottom: theme.spacing[2], textAlign: textAlign('start') }]}>
                    {teamAnalytics.athleteCount > 0
                      ? isRTL
                        ? 'ملخص التحليلات الذكية'
                        : 'Analytics AI summary'
                      : t('dashboard.noInsightsYet')}
                  </Text>
                  <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                    {teamAnalytics.athleteCount > 0
                      ? aiSummary
                      : isRTL
                        ? 'أضف لاعبين للحصول على توصيات ذكية مخصصة'
                        : 'Add athletes to get personalized AI recommendations'}
                  </Text>
                  {teamAnalytics.primaryRecommendation && teamAnalytics.athleteCount > 0 && (
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing[2], textAlign: textAlign('start') }]}>
                      {t(teamAnalytics.primaryRecommendation)}
                    </Text>
                  )}
                  {teamAnalytics.athleteCount > 0 && (
                    <TouchableOpacity onPress={() => router.push('/(tabs)/ai-coach' as never)} style={{ marginTop: theme.spacing[3] }}>
                      <Text style={[type.label, { color: theme.colors.primary, textAlign: textAlign('start') }]}>
                        {isRTL ? 'اسأل المدرب الذكي ←' : 'Ask AI Coach →'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* Recent Activity */}
        <View
          style={[
            styles.section,
            {
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            },
          ]}
        >
          <Text
            style={[
              type.h4,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing[3],
                textAlign: textAlign('start'),
              },
            ]}
          >
            {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
          </Text>
          {recentActivities.map((activity) => (
            <TouchableOpacity key={activity.id} activeOpacity={0.85} onPress={() => router.push('/(tabs)/performance-lab' as never)}>
              <Card
                variant="outlined"
                padding="md"
                style={{
                  borderRadius: theme.borderRadius.xl,
                  marginBottom: theme.spacing[3],
                }}
              >
                <View style={[styles.activityItem, { flexDirection: flexRow(true) }]}>
                  <View
                    style={[
                      styles.activityIcon,
                      {
                        backgroundColor: activity.color + '15',
                        borderRadius: theme.borderRadius.lg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={activity.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={activity.color}
                    />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
                    <Text style={[type.body, { color: theme.colors.text }]}>
                      {activity.title}
                    </Text>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                      {activity.subtitle}
                    </Text>
                  </View>
                  <Ionicons
                    name={isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={18}
                    color={theme.colors.textTertiary}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerRow: {
    alignItems: 'flex-start',
  },
  section: {
    marginTop: 24,
  },
  statsGrid: {
    flexWrap: 'wrap',
  },
  statsHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTrend: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  actionsGrid: {
    flexWrap: 'wrap',
  },
  actionGradient: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    alignItems: 'center',
  },
  insightIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityItem: {
    alignItems: 'center',
  },
  activityIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendRow: {},
});

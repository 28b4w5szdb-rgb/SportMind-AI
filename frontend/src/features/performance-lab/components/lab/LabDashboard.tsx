import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { Button } from '@/src/components/common/Button';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ProgressRingChart } from '@/src/components/charts';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { TESTING_CATEGORIES } from '../../registry/categories';
import { countTestsInCategory, getFeaturedTestForCategory } from '../../registry/tests';
import { CategoryCard } from '../CategoryCard';
import { TestResultCard } from '../TestResultCard';
import { useCustomTestDefinitions } from '../../hooks/useTestLibrary';
import { useLabDashboardPresentation } from '../../hooks/useLabDashboardPresentation';
import { LabCalendarPlaceholder } from './LabCalendarPlaceholder';
import { LabTimeline } from './LabTimeline';

export function LabDashboard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { isDesktop } = useResponsiveLayout();
  const customTests = useCustomTestDefinitions();
  const { recentTests, todayTests, pendingAthletes, scientificInsight, stats, teamAnalytics } = useLabDashboardPresentation();

  return (
    <View style={{ paddingBottom: theme.spacing[20] }}>
      <LinearGradient colors={['#0066FF', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: theme.borderRadius['2xl'], padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
        <Text style={[type.overline, { color: 'rgba(255,255,255,0.75)', letterSpacing: 1.5, textAlign: textAlign('start') }]}>
          {t('performanceLab.heroLabel')}
        </Text>
        <Text style={[type.h3, { color: '#FFF', marginTop: 4, textAlign: textAlign('start') }]}>{t('testingCenter.title')}</Text>
        <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.9)', marginTop: 6, textAlign: textAlign('start') }]}>{t('performanceLab.heroSubtitle')}</Text>
        <View style={{ flexDirection: flexRow(true), marginTop: theme.spacing.lg, gap: theme.spacing.sm }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={0.9}
            onPress={() => {
              const featured = getFeaturedTestForCategory('speed');
              if (featured) router.push(APP_ROUTES.performanceLabTest(featured.key));
            }}
          >
            <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: theme.borderRadius.xl, padding: theme.spacing.md, alignItems: 'center' }}>
              <Ionicons name="add-circle" size={24} color="#FFF" />
              <Text style={[type.captionBold, { color: '#FFF', marginTop: 4 }]}>{t('performanceLab.recordTest')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9} onPress={() => router.push(APP_ROUTES.performanceLabLibrary)}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: theme.borderRadius.xl, padding: theme.spacing.md, alignItems: 'center' }}>
              <Ionicons name="library" size={24} color="#FFF" />
              <Text style={[type.captionBold, { color: '#FFF', marginTop: 4 }]}>{t('performanceLab.testLibrary')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <SectionHeader title={t('performanceLab.overview')} subtitle={t('performanceLab.overviewSub')} titleSize="h5" />
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
        {[
          { id: 'results', value: stats.totalResults, label: t('performanceLab.stats.results'), color: '#0066FF', icon: 'analytics' as const },
          { id: 'today', value: stats.todayCount, label: t('performanceLab.stats.today'), color: '#10B981', icon: 'today' as const },
          { id: 'pending', value: stats.pendingCount, label: t('performanceLab.stats.pending'), color: '#F97316', icon: 'hourglass' as const },
          { id: 'protocols', value: stats.protocolCount, label: t('performanceLab.stats.protocols'), color: '#8B5CF6', icon: 'flask' as const },
        ].map((item) => (
          <Card key={item.id} variant="filled" padding="md" style={{ flex: 1, minWidth: isDesktop ? 140 : 100, borderRadius: theme.borderRadius.xl }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
              <Ionicons name={item.icon} size={18} color={item.color} />
              <Text style={[type.numberSm, { color: theme.colors.text, marginStart: 8 }]}>{item.value}</Text>
            </View>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{item.label}</Text>
          </Card>
        ))}
      </View>

      {scientificInsight && teamAnalytics.athleteCount > 0 ? (
        <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, ...theme.shadows.sm }}>
          <SectionHeader title={t('performanceLab.scientificInsights')} titleSize="h5" style={{ marginBottom: theme.spacing.md }} />
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing.md }}>
            <ProgressRingChart value={teamAnalytics.avgOverallScore} max={1000} size={80} color="#0066FF">
              <Text style={[type.captionBold, { color: theme.colors.text }]}>{teamAnalytics.avgOverallScore}</Text>
            </ProgressRingChart>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start'), lineHeight: isRTL ? 24 : 20 }]}>{scientificInsight}</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 8, textAlign: textAlign('start') }]}>
                {t('performanceLab.insightMeta', {
                  readiness: teamAnalytics.avgReadiness,
                  fatigue: teamAnalytics.avgFatigue,
                  risk: teamAnalytics.avgInjuryRisk,
                })}
              </Text>
            </View>
          </View>
        </Card>
      ) : null}

      <SectionHeader title={t('performanceLab.todayTesting')} actionLabel={t('performanceLab.viewHistory')} onAction={() => router.push(APP_ROUTES.performanceLabHistory)} titleSize="h5" />
      {todayTests.length === 0 ? (
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
          {t('performanceLab.noTodayTests')}
        </Text>
      ) : (
        todayTests.map((test) => (
          <TestResultCard key={test.id} test={test} compact onPress={() => router.push(APP_ROUTES.performanceLabResult(test.id))} />
        ))
      )}

      <SectionHeader title={t('performanceLab.recentTests')} titleSize="h5" style={{ marginTop: theme.spacing.md }} />
      {recentTests.length === 0 ? (
        <EmptyState icon="flask" title={t('performanceLab.noRecentTests')} description={t('performanceLab.noRecentTestsHint')} />
      ) : (
        recentTests.slice(0, 4).map((test) => (
          <TestResultCard key={test.id} test={test} compact onPress={() => router.push(APP_ROUTES.performanceLabResult(test.id))} />
        ))
      )}

      <SectionHeader title={t('performanceLab.pendingTests')} subtitle={t('performanceLab.pendingSub')} titleSize="h5" style={{ marginTop: theme.spacing.md }} />
      {pendingAthletes.length === 0 ? (
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
          {t('performanceLab.noPending')}
        </Text>
      ) : (
        pendingAthletes.map(({ athlete, daysSinceLastTest }) => (
          <Card key={athlete.id} variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
              <Ionicons name="person" size={20} color={theme.colors.warning} />
              <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>
                  {athlete.first_name} {athlete.last_name}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
                  {daysSinceLastTest == null ? t('performanceLab.neverTested') : t('performanceLab.daysSinceTest', { days: daysSinceLastTest })}
                </Text>
              </View>
              <Badge label={t('performanceLab.due')} variant="warning" />
            </View>
          </Card>
        ))
      )}

      <LabCalendarPlaceholder />

      <SectionHeader title={t('testingCenter.categoriesTitle')} titleSize="h5" style={{ marginTop: theme.spacing.lg }} />
      {TESTING_CATEGORIES.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          testCount={countTestsInCategory(category.id, customTests)}
          index={index}
          onPress={() => router.push(APP_ROUTES.performanceLabCategory(category.id))}
        />
      ))}

      <SectionHeader title={t('performanceLab.labTimeline')} titleSize="h5" style={{ marginTop: theme.spacing.lg }} />
      <LabTimeline tests={recentTests} compact />

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
        <Button title={t('performanceLab.benchmarkNav')} onPress={() => router.push(APP_ROUTES.performanceLabBenchmark)} variant="outline" icon="bar-chart" style={{ flex: 1, minWidth: 140 }} />
        <Button title={t('performanceLab.compare')} onPress={() => router.push(APP_ROUTES.performanceLabCompare)} variant="outline" icon="git-compare" style={{ flex: 1, minWidth: 140 }} />
      </View>
    </View>
  );
}

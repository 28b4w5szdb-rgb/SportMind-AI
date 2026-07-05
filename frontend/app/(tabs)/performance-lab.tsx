/**
 * SportMind AI - Performance Lab Screen
 * Premium performance analysis interface with responsive design for web/tablet/mobile
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTeamAnalyticsOverview, buildAiSummaryFromAnalytics } from '@/src/analytics';
import { ProgressRingChart } from '@/src/components/charts';
import {
  TESTING_CATEGORIES,
  countTestsInCategory,
  getFeaturedTestForCategory,
  CategoryCard,
  TestResultCard,
  getTotalTestCount,
} from '@/src/features/performance-lab';

const labTools = [
  { id: '1', key: 'lab.newTest', icon: 'analytics' as const, color: '#0066FF', desc: 'Conduct new assessments' },
  { id: '2', key: 'lab.calculator', icon: 'calculator' as const, color: '#F97316', desc: 'Compute metrics & zones' },
  { id: '3', key: 'lab.benchmark', icon: 'bar-chart' as const, color: '#10B981', desc: 'Compare against norms' },
  { id: '4', key: 'lab.comparison', icon: 'git-compare' as const, color: '#8B5CF6', desc: 'Track progress over time' },
];

const recentTestsFallback = [
  { id: '1', title: 'VO2 Max Test', athlete: 'Ahmed Hassan', date: '2h ago', score: '52.4 ml/kg/min', trend: 'up' },
  { id: '2', title: '10m Sprint', athlete: 'Mohammed Ali', date: 'Yesterday', score: '1.82s', trend: 'up' },
  { id: '3', title: 'Vertical Jump', athlete: 'Omar Farouk', date: '3 days ago', score: '45cm', trend: 'down' },
];

const labLabels = {
  'lab.newTest': { en: 'New Test', ar: 'اختبار جديد' },
  'lab.calculator': { en: 'Calculator', ar: 'الحاسبة' },
  'lab.benchmark': { en: 'Benchmark', ar: 'المقارنة' },
  'lab.comparison': { en: 'Compare', ar: 'المقارنة' },
};

export default function PerformanceLabScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const storeTests = useMockStore((s) => s.tests);
  const athletes = useMockStore((s) => s.athletes);
  const customTests = useMockStore((s) => s.customTestDefinitions);
  const teamAnalytics = useTeamAnalyticsOverview();
  const analyticsSummary = useMemo(() => buildAiSummaryFromAnalytics(teamAnalytics, isRTL), [teamAnalytics, isRTL]);
  const { width: windowWidth } = useWindowDimensions();

  const labStats = useMemo(
    () => [
      { id: 'tests', value: storeTests.length, labelEn: 'Tests', labelAr: 'اختبار', color: '#0066FF' },
      { id: 'athletes', value: athletes.length, labelEn: 'Athletes', labelAr: 'لاعب', color: '#10B981' },
      { id: 'categories', value: TESTING_CATEGORIES.length, labelEn: 'Categories', labelAr: 'فئة', color: '#8B5CF6' },
      { id: 'registry', value: getTotalTestCount(customTests), labelEn: 'Protocols', labelAr: 'بروتوكول', color: '#6366F1' },
    ],
    [storeTests.length, athletes.length, TESTING_CATEGORIES.length, customTests.length]
  );

  const handleToolPress = (toolId: string) => {
    if (toolId === '1') {
      const featured = getFeaturedTestForCategory('speed');
      if (featured) router.push(APP_ROUTES.performanceLabTest(featured.key));
      else router.push('/(tabs)/performance-lab' as never);
    } else if (toolId === '2') router.push(APP_ROUTES.calculator);
    else if (toolId === '3') router.push(APP_ROUTES.performanceLabBenchmark);
    else if (toolId === '4') router.push(APP_ROUTES.performanceLabCompare);
  };

  const isWeb = Platform.OS === 'web';
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const gridConfig = useMemo(() => {
    if (isDesktop) return { columns: 4, cardWidth: 260, gap: 20 };
    if (isTablet) return { columns: 2, cardWidth: 280, gap: 16 };
    return { columns: 2, cardWidth: (windowWidth - 48) / 2, gap: 12 };
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
          style={{
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
            paddingTop: isDesktop ? theme.spacing[8] : theme.spacing[5],
          }}
        >
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
            {(isRTL ? 'مركز اختبارات علوم الرياضة' : 'SPORTS SCIENCE TESTING CENTER').toUpperCase()}
          </Text>
          <Text
            style={[
              type.displaySmall,
              {
                color: theme.colors.text,
                textAlign: textAlign('start'),
                marginTop: theme.spacing[1],
              },
            ]}
          >
            {t('testingCenter.title')}
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
            {t('testingCenter.subtitle')}
          </Text>
        </View>

        {/* Analytics summary */}
        {teamAnalytics.athleteCount > 0 && (
          <View
            style={{
              marginTop: theme.spacing[5],
              maxWidth: isDesktop ? 1400 : undefined,
              marginHorizontal: isDesktop ? 'auto' : undefined,
              width: '100%',
            }}
          >
            <SectionHeader title={isRTL ? 'ملخص التحليلات' : 'Analytics summary'} />
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginBottom: theme.spacing[2], textAlign: textAlign('start') }]}>
              {isRTL ? 'محرك الأداء — بيانات محلية' : 'Performance engine — local mock data'}
            </Text>
            <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginTop: theme.spacing[3] }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing[4] }}>
                <ProgressRingChart value={teamAnalytics.avgOverallScore} max={1000} size={90} color="#0066FF">
                  <Text style={[type.label, { color: theme.colors.text }]}>{teamAnalytics.avgOverallScore}</Text>
                </ProgressRingChart>
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                    {analyticsSummary}
                  </Text>
                  <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 8, textAlign: textAlign('start') }]}>
                    {isRTL
                      ? `جاهزية ${teamAnalytics.avgReadiness}% · إرهاق ${teamAnalytics.avgFatigue}% · خطر ${teamAnalytics.avgInjuryRisk}%`
                      : `Readiness ${teamAnalytics.avgReadiness}% · Fatigue ${teamAnalytics.avgFatigue}% · Risk ${teamAnalytics.avgInjuryRisk}%`}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Lab KPI strip */}
        <View
          style={{
            marginTop: theme.spacing[5],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}>
            <LinearGradient colors={['#0066FF10', '#0D948810']} style={{ padding: theme.spacing[4] }}>
              <View style={{ flexDirection: flexRow(true), justifyContent: 'space-around' }}>
                {labStats.map((stat) => (
                  <View key={stat.id} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={[type.numberSm, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                      {isRTL ? stat.labelAr : stat.labelEn}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* Test Library CTA */}
        <View style={{ marginTop: theme.spacing[4], maxWidth: isDesktop ? 1400 : undefined, marginHorizontal: isDesktop ? 'auto' : undefined, width: '100%' }}>
          <Button
            title={isRTL ? 'مكتبة الاختبارات' : 'Browse Test Library'}
            onPress={() => router.push(APP_ROUTES.performanceLabLibrary)}
            variant="secondary"
            fullWidth
            icon="library"
          />
        </View>

        {/* Quick test entry CTA */}
        <View
          style={{
            marginTop: theme.spacing[4],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={() => {
            const featured = getFeaturedTestForCategory('speed');
            if (featured) router.push(APP_ROUTES.performanceLabTest(featured.key));
          }}>
            <Card variant="filled" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}>
              <LinearGradient colors={['#0066FF', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ padding: theme.spacing[5] }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.h5, { color: '#FFF', textAlign: textAlign('start') }]}>
                      {isRTL ? 'تسجيل اختبار جديد' : 'Record new test'}
                    </Text>
                    <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: textAlign('start') }]}>
                      {isRTL ? 'Yo-Yo، Sprint، CMJ والمزيد' : 'Yo-Yo, Sprint, CMJ & more'}
                    </Text>
                  </View>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="add" size={26} color="#FFF" />
                  </View>
                </View>
              </LinearGradient>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Quick Tools Grid */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
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
            {isRTL ? 'أدوات سريعة' : 'Quick Tools'}
          </Text>
          <View
            style={[
              styles.toolsGrid,
              { flexDirection: flexRow(true), gap: gridConfig.gap },
            ]}
          >
            {labTools.map((tool) => {
              const labels = labLabels[tool.key as keyof typeof labLabels];
              return (
                <TouchableOpacity
                  key={tool.id}
                  activeOpacity={0.85}
                  style={{ flex: 1, maxWidth: gridConfig.cardWidth }}
                  onPress={() => handleToolPress(tool.id)}
                >
                  <Card
                    variant="elevated"
                    padding="lg"
                    style={{
                      borderRadius: theme.borderRadius['2xl'],
                      alignItems: 'center',
                      minHeight: isDesktop ? 180 : 140,
                    }}
                  >
                    <LinearGradient
                      colors={[tool.color, tool.color + 'CC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.toolIcon,
                        { borderRadius: theme.borderRadius.xl },
                      ]}
                    >
                      <Ionicons name={tool.icon} size={28} color="#FFFFFF" />
                    </LinearGradient>
                    <Text
                      style={[
                        type.h5,
                        {
                          color: theme.colors.text,
                          marginTop: theme.spacing[4],
                          textAlign: 'center',
                        },
                      ]}
                    >
                      {isRTL ? labels.ar : labels.en}
                    </Text>
                    <Text
                      style={[
                        type.caption,
                        {
                          color: theme.colors.textTertiary,
                          marginTop: theme.spacing[1],
                          textAlign: 'center',
                        },
                      ]}
                    >
                      {tool.desc}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Test Categories — full registry-driven list */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <SectionHeader title={t('testingCenter.categoriesTitle')} />
          {TESTING_CATEGORIES.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              testCount={countTestsInCategory(category.id, customTests)}
              index={index}
              onPress={() => router.push(APP_ROUTES.performanceLabCategory(category.id))}
            />
          ))}
        </View>

        {/* Recent Tests */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <SectionHeader
            title={isRTL ? 'الاختبارات الأخيرة' : 'Recent Tests'}
            actionLabel={isRTL ? 'عرض الكل' : 'View All'}
            onAction={() => router.push(APP_ROUTES.performanceLabHistory)}
          />
          {storeTests.length === 0
            ? recentTestsFallback.map((test) => (
                <Card key={test.id} variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing[3] }}>
                  <Text style={[type.body, { color: theme.colors.text }]}>{test.title}</Text>
                </Card>
              ))
            : storeTests.slice(0, 5).map((test) => (
                <TestResultCard
                  key={test.id}
                  test={test}
                  compact
                  onPress={() => router.push(APP_ROUTES.performanceLabResult(test.id))}
                />
              ))}
        </View>

        {/* Stats Overview */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 800 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card
            variant="elevated"
            padding="none"
            style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#0066FF', '#0D9488']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: theme.spacing[6] }}
            >
              <Text style={[type.h4, { color: '#FFFFFF', textAlign: 'center' }]}>
                {isRTL ? 'إحصائيات الأداء' : 'Performance Stats'}
              </Text>
              <View style={[styles.statsRow, { flexDirection: flexRow(true), marginTop: theme.spacing[5] }]}>
                <View style={styles.statItem}>
                  <Text style={[type.numberDisplay, { color: '#FFFFFF', fontSize: 36 }]}>{getTotalTestCount(customTests)}</Text>
                  <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
                    {isRTL ? 'اختبار متاح' : 'Tests Available'}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                <View style={styles.statItem}>
                  <Text style={[type.numberDisplay, { color: '#FFFFFF', fontSize: 36 }]}>{TESTING_CATEGORIES.length}</Text>
                  <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
                    {isRTL ? 'فئة' : 'Categories'}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                <View style={styles.statItem}>
                  <Text style={[type.numberDisplay, { color: '#FFFFFF', fontSize: 36 }]}>{storeTests.length}</Text>
                  <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
                    {isRTL ? 'نتائج مسجلة' : 'Recorded results'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {storeTests.length === 0 && (
        <View
          style={{
            marginTop: theme.spacing[8],
            maxWidth: isDesktop ? 800 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card
            variant="filled"
            padding="xl"
            style={{ borderRadius: theme.borderRadius['2xl'] }}
          >
            <View style={styles.emptyContent}>
              <View
                style={[
                  styles.emptyIcon,
                  {
                    backgroundColor: theme.colors.accent + '15',
                    borderRadius: theme.borderRadius['3xl'],
                  },
                ]}
              >
                <Ionicons name="pulse" size={40} color={theme.colors.accent} />
              </View>
              <Text
                style={[
                  type.h4,
                  { color: theme.colors.text, marginTop: theme.spacing[5], textAlign: 'center' },
                ]}
              >
                {isRTL ? 'ابدأ الآن' : 'Get Started'}
              </Text>
              <Text
                style={[
                  type.body,
                  { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing[2] },
                ]}
              >
                {isRTL
                  ? 'قم بإجراء أول اختبار أداء لتتبع تقدم الرياضيين'
                  : 'Conduct your first performance test to start tracking athlete progress'}
              </Text>
              <Button
                title={isRTL ? 'إجراء اختبار جديد' : 'New Performance Test'}
                variant="primary"
                size="large"
                icon="analytics"
                onPress={() => {
                  const featured = getFeaturedTestForCategory('speed');
                  if (featured) router.push(APP_ROUTES.performanceLabTest(featured.key));
                }}
                style={{ marginTop: theme.spacing[6] }}
                fullWidth
              />
            </View>
          </Card>
        </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  toolsGrid: {
    flexWrap: 'wrap',
  },
  toolIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testRow: {
    alignItems: 'center',
  },
  testIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 48,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

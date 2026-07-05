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

const labTools = [
  { id: '1', key: 'lab.newTest', icon: 'analytics' as const, color: '#0066FF', desc: 'Conduct new assessments' },
  { id: '2', key: 'lab.calculator', icon: 'calculator' as const, color: '#F97316', desc: 'Compute metrics & zones' },
  { id: '3', key: 'lab.benchmark', icon: 'bar-chart' as const, color: '#10B981', desc: 'Compare against norms' },
  { id: '4', key: 'lab.comparison', icon: 'git-compare' as const, color: '#8B5CF6', desc: 'Track progress over time' },
];

const testCategories = [
  { id: 'endurance', icon: 'heart', labelEn: 'Endurance', labelAr: 'القدرة على التحمل', count: 4, color: '#EF4444' },
  { id: 'speed', icon: 'flash', labelEn: 'Speed', labelAr: 'السرعة', count: 3, color: '#F97316' },
  { id: 'strength', icon: 'fitness', labelEn: 'Strength', labelAr: 'القوة', count: 2, color: '#0066FF' },
  { id: 'power', icon: 'rocket', labelEn: 'Power', labelAr: 'الطاقة', count: 3, color: '#10B981' },
  { id: 'agility', icon: 'move', labelEn: 'Agility', labelAr: 'الرشاقة', count: 1, color: '#8B5CF6' },
  { id: 'flexibility', icon: 'accessibility', labelEn: 'Flexibility', labelAr: 'المرونة', count: 1, color: '#EC4899' },
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
  const teamAnalytics = useTeamAnalyticsOverview();
  const analyticsSummary = useMemo(() => buildAiSummaryFromAnalytics(teamAnalytics, isRTL), [teamAnalytics, isRTL]);
  const { width: windowWidth } = useWindowDimensions();

  const labStats = useMemo(
    () => [
      { id: 'tests', value: storeTests.length, labelEn: 'Tests', labelAr: 'اختبار', color: '#0066FF' },
      { id: 'athletes', value: athletes.length, labelEn: 'Athletes', labelAr: 'لاعب', color: '#10B981' },
      { id: 'categories', value: testCategories.length, labelEn: 'Categories', labelAr: 'فئة', color: '#8B5CF6' },
    ],
    [storeTests.length, athletes.length]
  );

  const recentTests = useMemo(() => {
    if (storeTests.length === 0) return recentTestsFallback;
    return storeTests.slice(0, 5).map((test) => ({
      id: test.id,
      title: test.test_type,
      athlete: test.athlete_name,
      date: test.date,
      score: `${test.value} ${test.unit}`,
      trend: 'up' as const,
    }));
  }, [storeTests]);

  const handleToolPress = (toolId: string) => {
    if (toolId === '1') router.push(APP_ROUTES.performanceLabEntry);
    else if (toolId === '2') router.push(APP_ROUTES.calculator);
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
            {(isRTL ? 'مختبر الأداء' : 'PERFORMANCE CENTER').toUpperCase()}
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
            {t('lab.title')}
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
            {isRTL ? 'تحليل بيانات الأداء وتتبع التقدم' : 'Analyze performance data and track progress'}
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

        {/* Quick test entry CTA */}
        <View
          style={{
            marginTop: theme.spacing[4],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(APP_ROUTES.performanceLabEntry)}>
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

        {/* Test Categories */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <SectionHeader
            title={isRTL ? 'فئات الاختبار' : 'Test Categories'}
            actionLabel={isRTL ? 'عرض الكل' : 'View All'}
            onAction={() => router.push(APP_ROUTES.performanceLabHistory)}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing[3], marginTop: theme.spacing[3] }}
          >
            {testCategories.map((category) => (
              <TouchableOpacity key={category.id} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.performanceLabCategory(category.id))}>
                <Card
                  variant="outlined"
                  padding="md"
                  style={{
                    borderRadius: theme.borderRadius.xl,
                    minWidth: 160,
                    borderColor: category.color + '40',
                  }}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        backgroundColor: category.color + '15',
                        borderRadius: theme.borderRadius.lg,
                      },
                    ]}
                  >
                    <Ionicons name={category.icon as any} size={24} color={category.color} />
                  </View>
                  <Text
                    style={[
                      type.label,
                      { color: theme.colors.text, marginTop: theme.spacing[3] },
                    ]}
                  >
                    {isRTL ? category.labelAr : category.labelEn}
                  </Text>
                  <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4 }]}>
                    {category.count} {isRTL ? 'اختبارات' : 'tests'}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
          {recentTests.map((test) => (
            <TouchableOpacity key={test.id} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.performanceLabHistory)}>
              <Card
                variant="elevated"
                padding="lg"
                style={{
                  borderRadius: theme.borderRadius.xl,
                  marginBottom: theme.spacing[3],
                }}
              >
                <View style={[styles.testRow, { flexDirection: flexRow(true) }]}>
                  <View
                    style={[
                      styles.testIcon,
                      {
                        backgroundColor: (test.trend === 'up' ? theme.colors.success : theme.colors.error) + '15',
                        borderRadius: theme.borderRadius.lg,
                      },
                    ]}
                  >
                    <Ionicons
                      name="analytics"
                      size={22}
                      color={test.trend === 'up' ? theme.colors.success : theme.colors.error}
                    />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
                    <Text style={[type.body, { color: theme.colors.text }]}>{test.title}</Text>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                      {test.athlete} · {test.date}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[type.numberSm, { color: theme.colors.text }]}>
                      {test.score}
                    </Text>
                    <Ionicons
                      name={test.trend === 'up' ? 'trending-up' : 'trending-down'}
                      size={16}
                      color={test.trend === 'up' ? theme.colors.success : theme.colors.error}
                    />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
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
                  <Text style={[type.numberDisplay, { color: '#FFFFFF', fontSize: 36 }]}>{storeTests.length || 14}</Text>
                  <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
                    {isRTL ? 'اختبار متاح' : 'Tests Available'}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                <View style={styles.statItem}>
                  <Text style={[type.numberDisplay, { color: '#FFFFFF', fontSize: 36 }]}>8</Text>
                  <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
                    {isRTL ? 'حاسبة' : 'Calculators'}
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                <View style={styles.statItem}>
                  <Text style={[type.numberDisplay, { color: '#FFFFFF', fontSize: 36 }]}>12</Text>
                  <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>
                    {isRTL ? 'معيار' : 'Benchmarks'}
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
                onPress={() => router.push(APP_ROUTES.performanceLabEntry)}
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

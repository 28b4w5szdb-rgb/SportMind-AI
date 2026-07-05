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
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useMockStore } from '@/src/data/mock/store';

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
  { id: 'athletes', icon: 'people' as const, key: 'dashboard.athletesCount', color: '#0066FF', trend: '+12%' },
  { id: 'sessions', icon: 'stats-chart' as const, key: 'dashboard.sessionsCount', color: '#10B981', trend: '+8%' },
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

  const statsData = useMemo(
    () =>
      statsMeta.map((stat) => ({
        ...stat,
        value: stat.id === 'athletes' ? String(athletes.length) : String(tests.length),
      })),
    [athletes.length, tests.length]
  );

  const gridConfig = useMemo(() => {
    if (isDesktop) return { columns: 4, cardWidth: 260, gap: 20 };
    if (isTablet) return { columns: 2, cardWidth: 280, gap: 16 };
    return { columns: 2, cardWidth: (windowWidth - 40) / 2, gap: 12 };
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
              <TouchableOpacity key={stat.id} activeOpacity={0.85} style={{ flex: 1 }}>
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
                  <Ionicons name="bulb" size={32} color={theme.colors.primary} />
                </View>
                <View style={{ flex: isRTL ? 0 : 1, marginLeft: theme.spacing[4] }}>
                  <Text
                    style={[
                      type.h5,
                      { color: theme.colors.text, marginBottom: theme.spacing[2] },
                    ]}
                  >
                    {t('dashboard.noInsightsYet')}
                  </Text>
                  <Text
                    style={[type.bodySm, { color: theme.colors.textSecondary }]}
                  >
                    {isRTL
                      ? 'أضف لاعبين للحصول على توصيات ذكية مخصصة'
                      : 'Add athletes to get personalized AI recommendations'}
                  </Text>
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
          {recentActivities.map((activity, index) => (
            <TouchableOpacity key={activity.id} activeOpacity={0.85}>
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
});

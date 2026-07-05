/**
 * SportMind AI - Dashboard Screen
 * Premium bilingual (AR/EN) dashboard with RTL-aware layout,
 * modern card designs, and sports-focused data visualization.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

function getGreetingKey(): string {
  const h = new Date().getHours();
  if (h < 12) return 'dashboard.greetingMorning';
  if (h < 18) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
}

const quickActions = [
  { id: '1', key: 'actions.aiCoach', icon: 'sparkles' as const, color: '#0066FF', gradient: ['#0066FF', '#0D9488'], route: '/(tabs)/ai-coach' },
  { id: '2', key: 'actions.calculator', icon: 'calculator' as const, color: '#F97316', gradient: ['#F97316', '#EA580C'], route: '/calculator' },
  { id: '3', key: 'actions.reports', icon: 'document-text' as const, color: '#10B981', gradient: ['#10B981', '#059669'], route: '/reports' },
  { id: '4', key: 'actions.research', icon: 'book' as const, color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'], route: '/research' },
] as const;

const statsCards = [
  { id: 'athletes', icon: 'people' as const, value: '0', key: 'dashboard.athletesCount', color: '#0066FF' },
  { id: 'sessions', icon: 'stats-chart' as const, value: '0', key: 'dashboard.sessionsCount', color: '#10B981' },
];

export default function DashboardScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: theme.spacing[20] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={[
            styles.headerRow,
            {
              flexDirection: flexRow(true),
              paddingHorizontal: theme.spacing[4],
              paddingTop: theme.spacing[5],
              paddingBottom: theme.spacing[4],
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
          </View>
          <LanguageToggle />
        </View>

        {/* Stats Overview with Gradient Cards */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginBottom: theme.spacing[6] }}>
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
          <View style={[styles.statsGrid, { flexDirection: flexRow(true) }]}>
            {statsCards.map((stat) => (
              <TouchableOpacity key={stat.id} activeOpacity={0.85}>
                <View style={[styles.statCard, { overflow: 'hidden' }]}>
                  <LinearGradient
                    colors={[stat.color + '20', stat.color + '05']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, padding: theme.spacing[5] }}
                  >
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
                    <Text
                      style={[
                        type.numberDisplay,
                        { color: theme.colors.text, marginTop: theme.spacing[3], fontSize: 36 },
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
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions - Premium Cards */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginBottom: theme.spacing[6] }}>
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
          <View style={[styles.actionsGrid, { flexDirection: flexRow(true) }]}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => router.push(action.route as never)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t(action.key)}
                style={styles.actionTouch}
              >
                <Card variant="elevated" padding="md" style={styles.actionCard}>
                  <LinearGradient
                    colors={action.gradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.actionGradient,
                      { borderRadius: theme.borderRadius.xl },
                    ]}
                  >
                    <Ionicons name={action.icon} size={26} color="#FFFFFF" />
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

        {/* AI Insights - Empty State */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginBottom: theme.spacing[6] }}>
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
          <Card variant="filled" padding="lg" style={styles.insightCard}>
            <View style={styles.insightContent}>
              <View
                style={[
                  styles.insightIcon,
                  {
                    backgroundColor: theme.colors.primary + '15',
                    borderRadius: theme.borderRadius['2xl'],
                  },
                ]}
              >
                <Ionicons name="bulb-outline" size={28} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: theme.spacing[4] }}>
                <Text
                  style={[
                    type.h5,
                    { color: theme.colors.text, marginBottom: theme.spacing[1] },
                  ]}
                >
                  {t('dashboard.noInsightsYet')}
                </Text>
                <Text
                  style={[
                    type.bodySm,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {isRTL
                    ? 'أضف لاعبين للحصول على توصيات ذكية'
                    : 'Add athletes to get personalized recommendations'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Recent Activity Placeholder */}
        <View style={{ paddingHorizontal: theme.spacing[4] }}>
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
          <Card variant="outlined" padding="lg" style={styles.activityCard}>
            <View
              style={[
                styles.activityContent,
                { flexDirection: flexRow(true) },
              ]}
            >
              <View
                style={[
                  styles.activityDot,
                  { backgroundColor: theme.colors.borderLight },
                ]}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    type.body,
                    { color: theme.colors.textSecondary, textAlign: textAlign('start') },
                  ]}
                >
                  {isRTL
                    ? 'لا يوجد نشاط حديث لعرضه'
                    : 'No recent activity to display'}
                </Text>
              </View>
            </View>
          </Card>
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
  statsGrid: {
    gap: CARD_GAP,
  },
  statCard: {
    flex: 1,
    minHeight: 140,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  statIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsGrid: {
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  actionTouch: {
    width: CARD_WIDTH,
  },
  actionCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    paddingVertical: 20,
  },
  actionGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCard: {
    backgroundColor: 'transparent',
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {},
  activityContent: {
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

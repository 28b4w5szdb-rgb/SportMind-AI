/**
 * SportMind AI - Dashboard Screen
 * Fully bilingual (AR/EN) with runtime language toggle, RTL-aware layout,
 * and script-appropriate typography. Demonstrates the whole Phase 1
 * i18n + Direction + Fonts pipeline in one screen.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { LanguageToggle } from '@/src/components/common/LanguageToggle';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

function greetingKey(): string {
  const h = new Date().getHours();
  if (h < 12) return 'dashboard.greetingMorning';
  if (h < 18) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
}

export default function DashboardScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();

  const quickActions = [
    { id: '1', key: 'actions.aiCoach', icon: 'sparkles' as const, route: '/(tabs)/ai-coach' },
    { id: '2', key: 'actions.calculator', icon: 'calculator' as const, route: '/calculator' },
    { id: '3', key: 'actions.reports', icon: 'document-text' as const, route: '/reports' },
    { id: '4', key: 'actions.research', icon: 'book' as const, route: '/research' },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: theme.spacing['2xl'] }}
      >
        {/* Header row: greeting on start, language toggle on end */}
        <View
          style={[
            styles.headerRow,
            {
              flexDirection: flexRow(true),
              paddingHorizontal: theme.spacing.md,
              paddingTop: theme.spacing.lg,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}
            >
              {t(greetingKey())}
            </Text>
            <Text
              style={[
                type.displaySmall,
                {
                  color: theme.colors.text,
                  textAlign: textAlign('start'),
                  marginTop: 2,
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
                  marginTop: theme.spacing.xs,
                },
              ]}
            >
              {t('dashboard.welcome')}
            </Text>
          </View>
          <LanguageToggle />
        </View>

        {/* Overview */}
        <View style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Text
            style={[
              type.h3,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing.md,
                textAlign: textAlign('start'),
              },
            ]}
          >
            {t('dashboard.overview')}
          </Text>
          <View style={[styles.statsGrid, { flexDirection: flexRow(true) }]}>
            <Card style={styles.statCard}>
              <Ionicons name="people" size={32} color={theme.colors.primary} />
              <Text
                style={[
                  type.h2,
                  { color: theme.colors.text, marginTop: theme.spacing.sm },
                ]}
              >
                0
              </Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
                {t('dashboard.athletesCount')}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Ionicons name="stats-chart" size={32} color={theme.colors.secondary} />
              <Text
                style={[
                  type.h2,
                  { color: theme.colors.text, marginTop: theme.spacing.sm },
                ]}
              >
                0
              </Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
                {t('dashboard.sessionsCount')}
              </Text>
            </Card>
          </View>
        </View>

        {/* Quick actions */}
        <View style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Text
            style={[
              type.h3,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing.md,
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
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={t(action.key)}
              >
                <Card style={styles.actionCard}>
                  <View
                    style={[
                      styles.actionIcon,
                      {
                        backgroundColor: theme.colors.primary + '20',
                        borderRadius: theme.borderRadius.lg,
                      },
                    ]}
                  >
                    <Ionicons name={action.icon} size={24} color={theme.colors.primary} />
                  </View>
                  <Text
                    style={[
                      type.label,
                      {
                        color: theme.colors.text,
                        marginTop: theme.spacing.sm,
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

        {/* Insights (empty state demo) */}
        <View style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Text
            style={[
              type.h3,
              {
                color: theme.colors.text,
                marginBottom: theme.spacing.md,
                textAlign: textAlign('start'),
              },
            ]}
          >
            {t('dashboard.insights')}
          </Text>
          <Card style={{ padding: theme.spacing.lg, alignItems: 'center' }}>
            <Ionicons name="bulb-outline" size={40} color={theme.colors.textTertiary} />
            <Text
              style={[
                type.body,
                {
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                  marginTop: theme.spacing.sm,
                },
              ]}
            >
              {t('dashboard.noInsightsYet')}
            </Text>
          </Card>
        </View>

        {/* Direction indicator (debug hint — remove once auth arrives) */}
        <Text
          style={[
            type.caption,
            {
              color: theme.colors.textTertiary,
              marginTop: theme.spacing.lg,
              textAlign: 'center',
            },
          ]}
        >
          {isRTL ? 'RTL' : 'LTR'}
        </Text>
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
    gap: 12,
  },
  statsGrid: {
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  actionsGrid: {
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: 160,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

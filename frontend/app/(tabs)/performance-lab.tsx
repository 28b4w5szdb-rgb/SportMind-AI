/**
 * SportMind AI - Performance Lab Screen
 * Premium performance analysis interface with tools and metrics
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

const labTools = [
  { id: '1', key: 'lab.newTest', icon: 'analytics' as const, color: '#0066FF', gradient: ['#0066FF', '#0D9488'] },
  { id: '2', key: 'lab.calculator', icon: 'calculator' as const, color: '#F97316', gradient: ['#F97316', '#EA580C'] },
  { id: '3', key: 'lab.benchmark', icon: 'bar-chart' as const, color: '#10B981', gradient: ['#10B981', '#059669'] },
  { id: '4', key: 'lab.comparison', icon: 'git-compare' as const, color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
];

const testCategories = [
  { id: 'endurance', icon: 'heart', labelEn: 'Endurance', labelAr: 'القدرة على التحمل', count: 4 },
  { id: 'speed', icon: 'flash', labelEn: 'Speed', labelAr: 'السرعة', count: 3 },
  { id: 'strength', icon: 'fitness', labelEn: 'Strength', labelAr: 'القوة', count: 2 },
  { id: 'power', icon: 'rocket', labelEn: 'Power', labelAr: 'الطاقة', count: 3 },
  { id: 'agility', icon: 'move', labelEn: 'Agility', labelAr: 'الرشاقة', count: 1 },
  { id: 'flexibility', icon: 'accessibility', labelEn: 'Flexibility', labelAr: 'المرونة', count: 1 },
];

export default function PerformanceLabScreen() {
  const theme = useTheme();
  const type = useTypography();
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
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[5] }}>
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
            {isRTL
              ? 'تحليل بيانات الأداء وتتبع التقدم'
              : 'Analyze performance data and track progress'}
          </Text>
        </View>

        {/* Quick Tools Grid */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
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
          <View style={[styles.toolsGrid, { flexDirection: flexRow(true) }]}>
            {labTools.map((tool) => (
              <TouchableOpacity key={tool.id} activeOpacity={0.85}>
                <Card
                  variant="elevated"
                  padding="md"
                  style={styles.toolCard}
                >
                  <LinearGradient
                    colors={tool.gradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.toolGradient,
                      { borderRadius: theme.borderRadius.xl },
                    ]}
                  >
                    <Ionicons name={tool.icon} size={24} color="#FFFFFF" />
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
                    {tool.id === '1'
                      ? isRTL ? 'اختبار جديد' : 'New Test'
                      : tool.id === '2'
                      ? isRTL ? 'الحاسبة' : 'Calculator'
                      : tool.id === '3'
                      ? isRTL ? 'المقارنة' : 'Benchmark'
                      : isRTL ? 'المقارنة' : 'Compare'}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Test Categories */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
          <View
            style={[
              styles.sectionHeader,
              { flexDirection: flexRow(true) },
            ]}
          >
            <Text style={[type.h4, { color: theme.colors.text }]}>
              {isRTL ? 'فئات الاختبار' : 'Test Categories'}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text
                style={[
                  type.label,
                  { color: theme.colors.primary },
                ]}
              >
                {isRTL ? 'عرض الكل' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {testCategories.map((category, index) => (
              <TouchableOpacity key={category.id} activeOpacity={0.85}>
                <Card
                  variant="outlined"
                  padding="md"
                  style={[
                    styles.categoryCard,
                    {
                      marginRight: index < testCategories.length - 1 ? theme.spacing[3] : 0,
                      borderRadius: theme.borderRadius.xl,
                    },
                  ]}
                >
                  <View style={styles.categoryContent}>
                    <View
                      style={[
                        styles.categoryIcon,
                        {
                          backgroundColor: theme.colors.primary + '15',
                          borderRadius: theme.borderRadius.lg,
                        },
                      ]}
                    >
                      <Ionicons name={category.icon as any} size={22} color={theme.colors.primary} />
                    </View>
                    <View style={{ marginTop: theme.spacing[2] }}>
                      <Text
                        style={[
                          type.label,
                          { color: theme.colors.text },
                        ]}
                      >
                        {isRTL ? category.labelAr : category.labelEn}
                      </Text>
                      <Text
                        style={[
                          type.caption,
                          { color: theme.colors.textTertiary, marginTop: 2 },
                        ]}
                      >
                        {category.count} {isRTL ? 'اختبارات' : 'tests'}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Tests Placeholder */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
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
            {isRTL ? 'الاختبارات الأخيرة' : 'Recent Tests'}
          </Text>
          <Card
            variant="filled"
            padding="xl"
            style={{ borderRadius: theme.borderRadius['2xl'] }}
          >
            <View style={styles.recentContent}>
              <View
                style={[
                  styles.recentIcon,
                  {
                    backgroundColor: theme.colors.success + '15',
                    borderRadius: theme.borderRadius['2xl'],
                  },
                ]}
              >
                <Ionicons name="analytics-outline" size={36} color={theme.colors.success} />
              </View>
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
                {isRTL ? 'لا توجد اختبارات' : 'No Tests Yet'}
              </Text>
              <Text
                style={[
                  type.body,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  },
                ]}
              >
                {isRTL
                  ? 'ابدأ بإضافة اختبارات لتتبع تقدم الرياضيين'
                  : 'Start adding tests to track athlete progress'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Stats Overview */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
          <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'] }}>
            <LinearGradient
              colors={['#0066FF10', '#0D948810']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ margin: -16, padding: 16, borderRadius: 20 }}
            >
              <View
                style={[
                  styles.statsRow,
                  { flexDirection: flexRow(true) },
                ]}
              >
                <View style={styles.statsItem}>
                  <Text
                    style={[
                      type.numberLarge,
                      { color: theme.colors.text },
                    ]}
                  >
                    0
                  </Text>
                  <Text
                    style={[
                      type.caption,
                      { color: theme.colors.textSecondary, marginTop: 4 },
                    ]}
                  >
                    {isRTL ? 'إجمالي الاختبارات' : 'Total Tests'}
                  </Text>
                </View>
                <View style={[styles.statsDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.statsItem}>
                  <Text
                    style={[
                      type.numberLarge,
                      { color: theme.colors.success },
                    ]}
                  >
                    0
                  </Text>
                  <Text
                    style={[
                      type.caption,
                      { color: theme.colors.textSecondary, marginTop: 4 },
                    ]}
                  >
                    {isRTL ? 'معدل التحسن' : 'Improvement'}
                  </Text>
                </View>
                <View style={[styles.statsDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.statsItem}>
                  <Text
                    style={[
                      type.numberLarge,
                      { color: theme.colors.accent },
                    ]}
                  >
                    0
                  </Text>
                  <Text
                    style={[
                      type.caption,
                      { color: theme.colors.textSecondary, marginTop: 4 },
                    ]}
                  >
                    {isRTL ? 'أرقام قياسية' : 'Records'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
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
  toolsGrid: {
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  toolCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    paddingVertical: 20,
  },
  toolGradient: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingVertical: 4,
  },
  categoryCard: {
    minWidth: 140,
  },
  categoryContent: {
    alignItems: 'flex-start',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  recentIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsDivider: {
    width: 1,
    height: 48,
  },
});

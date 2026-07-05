/**
 * SportMind AI - AI Coach Screen
 * Premium AI assistant interface with chat-ready design
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

const agentSuggestions = [
  { id: '1', icon: 'fitness', titleKey: 'aiCoach.suggestion1Title', shortKey: 'aiCoach.suggestion1Short' },
  { id: '2', icon: 'heart', titleKey: 'aiCoach.suggestion2Title', shortKey: 'aiCoach.suggestion2Short' },
  { id: '3', icon: 'bar-chart', titleKey: 'aiCoach.suggestion3Title', shortKey: 'aiCoach.suggestion3Short' },
  { id: '4', icon: 'accessibility', titleKey: 'aiCoach.suggestion4Title', shortKey: 'aiCoach.suggestion4Short' },
];

const aiFeatures = [
  { id: 'analysis', icon: 'analytics', color: '#0066FF' },
  { id: 'plan', icon: 'calendar', color: '#F97316' },
  { id: 'insight', icon: 'bulb', color: '#10B981' },
  { id: 'recommend', icon: 'star', color: '#8B5CF6' },
];

export default function AICoachScreen() {
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
        contentContainerStyle={{ paddingBottom: theme.spacing[16] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[5] }}>
          <View
            style={[
              styles.hero,
              { flexDirection: flexRow(true) },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  type.overline,
                  {
                    color: theme.colors.primary,
                    textAlign: textAlign('start'),
                    letterSpacing: 2,
                  },
                ]}
              >
                {isRTL ? 'الذكاء الاصطناعي' : 'AI POWERED'}
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
                {t('aiCoach.title')}
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
                {t('aiCoach.welcome')}
              </Text>
            </View>
            <LinearGradient
              colors={['#0066FF', '#0D9488']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.heroIcon,
                { borderRadius: theme.borderRadius['2xl'] },
              ]}
            >
              <Ionicons name="sparkles" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </View>

        {/* Feature Pills */}
        <View
          style={{
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[4],
          }}
        >
          <View
            style={[
              styles.featuresRow,
              { flexDirection: flexRow(true) },
            ]}
          >
            {aiFeatures.map((feature) => (
              <View
                key={feature.id}
                style={[
                  styles.featurePill,
                  {
                    backgroundColor: feature.color + '15',
                    borderRadius: theme.borderRadius.full,
                  },
                ]}
              >
                <Ionicons name={feature.icon} size={16} color={feature.color} />
                <Text
                  style={[
                    type.caption,
                    {
                      color: feature.color,
                      marginLeft: theme.spacing[1],
                      fontWeight: '600',
                    },
                  ]}
                >
                  {isRTL
                    ? feature.id === 'analysis'
                      ? 'تحليل'
                      : feature.id === 'plan'
                      ? 'تخطيط'
                      : feature.id === 'insight'
                      ? 'رؤى'
                      : 'نصائح'
                    : feature.id.charAt(0).toUpperCase() + feature.id.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Suggestions Grid */}
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
            {isRTL ? 'أسئلة مقترحة' : 'Suggested Questions'}
          </Text>
          <View style={[styles.suggestionsGrid, { flexDirection: flexRow(true) }]}>
            {agentSuggestions.map((suggestion) => (
              <TouchableOpacity key={suggestion.id} activeOpacity={0.8}>
                <Card
                  variant="elevated"
                  padding="md"
                  style={styles.suggestionCard}
                >
                  <View
                    style={[
                      styles.suggestionIcon,
                      {
                        backgroundColor: theme.colors.primary + '15',
                        borderRadius: theme.borderRadius.lg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={suggestion.icon as any}
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text
                    style={[
                      type.label,
                      {
                        color: theme.colors.text,
                        marginTop: theme.spacing[3],
                        textAlign: textAlign('start'),
                      },
                    ]}
                  >
                    {isRTL
                      ? suggestion.id === '1'
                        ? 'تحليل الأداء'
                        : suggestion.id === '2'
                        ? 'خطة التعافي'
                        : suggestion.id === '3'
                        ? 'مقارنة الإحصائيات'
                        : 'برنامج تمرين'
                      : suggestion.id === '1'
                      ? 'Performance Analysis'
                      : suggestion.id === '2'
                      ? 'Recovery Plan'
                      : suggestion.id === '3'
                      ? 'Compare Stats'
                      : 'Workout Program'}
                  </Text>
                  <Text
                    style={[
                      type.caption,
                      {
                        color: theme.colors.textTertiary,
                        marginTop: theme.spacing[1],
                        textAlign: textAlign('start'),
                      },
                    ]}
                  >
                    {isRTL
                      ? 'احصل على تحليل مفصل'
                      : 'Get detailed insights'}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chat Input Placeholder */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginBottom: theme.spacing[6] }}>
          <Card
            variant="outlined"
            padding="lg"
            style={{ borderRadius: theme.borderRadius['2xl'] }}
          >
            <View
              style={[
                styles.chatInputPlaceholder,
                { flexDirection: flexRow(true) },
              ]}
            >
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: theme.borderRadius.xl,
                    flex: 1,
                  },
                ]}
              >
                <Text style={[type.body, { color: theme.colors.textTertiary }]}>
                  {isRTL ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient
                  colors={['#0066FF', '#0D9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.sendButton,
                    { borderRadius: theme.borderRadius.lg },
                  ]}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Coming Soon Card */}
        <View style={{ paddingHorizontal: theme.spacing[4] }}>
          <Card variant="filled" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'] }}>
            <View style={styles.comingSoonContent}>
              <View
                style={[
                  styles.comingSoonIcon,
                  {
                    backgroundColor: theme.colors.accent + '20',
                    borderRadius: theme.borderRadius['3xl'],
                  },
                ]}
              >
                <Ionicons name="rocket" size={32} color={theme.colors.accent} />
              </View>
              <Text
                style={[
                  type.h4,
                  {
                    color: theme.colors.text,
                    marginTop: theme.spacing[4],
                    textAlign: 'center',
                  },
                ]}
              >
                {isRTL ? 'قريبًا' : 'Coming Soon'}
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
                  ? 'المدرب الذكي المستند إلى الذكاء الاصطناعى سيكون متاحًا قريبًا'
                  : 'AI-powered coaching assistant will be available soon'}
              </Text>
              <Button
                title={isRTL ? 'إشعني عند التوفر' : 'Notify Me'}
                variant="outline"
                size="medium"
                onPress={() => {}}
                style={{ marginTop: theme.spacing[5] }}
              />
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
  hero: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuresRow: {
    flexWrap: 'wrap',
    gap: 8,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionsGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionCard: {
    width: (SCREEN_WIDTH - 32 - 12) / 2,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInputPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  inputBox: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 52,
  },
  sendButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonContent: {
    alignItems: 'center',
  },
  comingSoonIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

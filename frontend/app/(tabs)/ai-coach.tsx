/**
 * SportMind AI - AI Coach Screen
 * Premium AI assistant interface with responsive design for web/tablet/mobile
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

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const agentSuggestions = [
  { id: '1', icon: 'fitness', title: 'Performance Analysis', titleAr: 'تحليل الأداء', desc: 'Get detailed insights' },
  { id: '2', icon: 'heart', title: 'Recovery Plan', titleAr: 'خطة التعافي', desc: 'Optimal rest periods' },
  { id: '3', icon: 'bar-chart', title: 'Compare Stats', titleAr: 'مقارنة الإحصائيات', desc: 'Benchmark athletes' },
  { id: '4', icon: 'accessibility', title: 'Workout Program', titleAr: 'برنامج تمرين', desc: 'Custom routines' },
];

const aiCapabilities = [
  { id: 'analysis', icon: 'analytics', label: 'Analyze', labelAr: 'تحليل', color: '#0066FF' },
  { id: 'plan', icon: 'calendar', label: 'Plan', labelAr: 'تخطيط', color: '#F97316' },
  { id: 'insight', icon: 'bulb', label: 'Insight', labelAr: 'رؤى', color: '#10B981' },
  { id: 'recommend', icon: 'star', label: 'Recommend', labelAr: 'نصائح', color: '#8B5CF6' },
];

const recentChats = [
  { id: '1', title: 'Sprint training optimization', time: '2h ago', messages: 12 },
  { id: '2', title: 'Recovery strategies discussion', time: 'Yesterday', messages: 8 },
  { id: '3', title: 'Performance benchmarks review', time: '3 days ago', messages: 15 },
];

export default function AICoachScreen() {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { width: windowWidth } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const gridConfig = useMemo(() => {
    if (isDesktop) return { cardWidth: 280, gap: 24 };
    if (isTablet) return { cardWidth: 260, gap: 16 };
    return { cardWidth: (windowWidth - 48) / 2, gap: 12 };
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
        {/* Hero Header */}
        <View
          style={{
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
            paddingTop: isDesktop ? theme.spacing[8] : theme.spacing[5],
          }}
        >
          <View style={[styles.hero, { flexDirection: flexRow(true), alignItems: 'center' }]}>
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
                { borderRadius: theme.borderRadius['3xl'] },
              ]}
            >
              <Ionicons name="sparkles" size={isDesktop ? 40 : 32} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </View>

        {/* Capability Pills */}
        <View
          style={{
            marginTop: theme.spacing[5],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing[2] }}
          >
            {aiCapabilities.map((cap) => (
              <TouchableOpacity key={cap.id} activeOpacity={0.85}>
                <View
                  style={[
                    styles.capabilityPill,
                    {
                      backgroundColor: cap.color + '15',
                      borderRadius: theme.borderRadius.full,
                      borderColor: cap.color + '30',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Ionicons name={cap.icon} size={18} color={cap.color} />
                  <Text style={[type.label, { color: cap.color, marginLeft: theme.spacing[2] }]}>
                    {isRTL ? cap.labelAr : cap.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Suggested Questions Grid */}
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
            {isRTL ? 'أسئلة مقترحة' : 'Suggested Questions'}
          </Text>
          <View
            style={[
              styles.suggestionsGrid,
              { flexDirection: flexRow(true), gap: gridConfig.gap },
            ]}
          >
            {agentSuggestions.map((suggestion) => (
              <TouchableOpacity key={suggestion.id} activeOpacity={0.85} style={{ flex: 1, maxWidth: gridConfig.cardWidth }}>
                <Card
                  variant="elevated"
                  padding="lg"
                  style={{ borderRadius: theme.borderRadius['2xl'] }}
                >
                  <View
                    style={[
                      styles.suggestionIcon,
                      {
                        backgroundColor: theme.colors.primary + '15',
                        borderRadius: theme.borderRadius.xl,
                      },
                    ]}
                  >
                    <Ionicons name={suggestion.icon as any} size={28} color={theme.colors.primary} />
                  </View>
                  <Text
                    style={[
                      type.h5,
                      {
                        color: theme.colors.text,
                        marginTop: theme.spacing[4],
                        textAlign: textAlign('start'),
                      },
                    ]}
                  >
                    {isRTL ? suggestion.titleAr : suggestion.title}
                  </Text>
                  <Text
                    style={[
                      type.caption,
                      { color: theme.colors.textTertiary, marginTop: theme.spacing[1] },
                    ]}
                  >
                    {suggestion.desc}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chat Input */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 800 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'] }}>
            <View
              style={[
                styles.chatInput,
                { flexDirection: flexRow(true) },
              ]}
            >
              <View
                style={[
                  styles.inputField,
                  {
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: theme.borderRadius.xl,
                    flex: 1,
                    minWidth: 200,
                  },
                ]}
              >
                <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textTertiary} />
                <Text
                  style={[
                    type.body,
                    {
                      color: theme.colors.textTertiary,
                      marginLeft: theme.spacing[3],
                    },
                  ]}
                >
                  {isRTL ? 'اسأل أي شيء...' : 'Ask anything...'}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.85}>
                <LinearGradient
                  colors={['#0066FF', '#0D9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.sendButton,
                    {
                      borderRadius: theme.borderRadius.xl,
                      width: isDesktop ? 56 : 48,
                      height: isDesktop ? 56 : 48,
                    },
                  ]}
                >
                  <Ionicons name={isRTL ? 'send' : 'send'} size={22} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Recent Chats */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <View
            style={[
              styles.sectionHeader,
              { flexDirection: flexRow(true) },
            ]}
          >
            <Text style={[type.h4, { color: theme.colors.text }]}>
              {isRTL ? 'المحادثات الأخيرة' : 'Recent Chats'}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[type.label, { color: theme.colors.primary }]}>
                {isRTL ? 'عرض الكل' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          {recentChats.map((chat) => (
            <TouchableOpacity key={chat.id} activeOpacity={0.85}>
              <Card
                variant="outlined"
                padding="md"
                style={{
                  borderRadius: theme.borderRadius.xl,
                  marginBottom: theme.spacing[3],
                }}
              >
                <View style={[styles.chatItem, { flexDirection: flexRow(true), alignItems: 'center' }]}>
                  <View
                    style={[
                      styles.chatIcon,
                      {
                        backgroundColor: theme.colors.primary + '10',
                        borderRadius: theme.borderRadius.lg,
                      },
                    ]}
                  >
                    <Ionicons name="chatbox" size={20} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
                    <Text style={[type.body, { color: theme.colors.text }]}>{chat.title}</Text>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                      {chat.time} · {chat.messages} {isRTL ? 'رسائل' : 'messages'}
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

        {/* Coming Soon Banner */}
        <View
          style={{
            marginTop: theme.spacing[8],
            maxWidth: isDesktop ? 800 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card variant="filled" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}>
            <LinearGradient
              colors={['#F9731615', '#EA580C10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: theme.spacing[6] }}
            >
              <View style={styles.comingSoon}>
                <View
                  style={[
                    styles.comingSoonIcon,
                    {
                      backgroundColor: theme.colors.accent + '20',
                      borderRadius: theme.borderRadius['3xl'],
                    },
                  ]}
                >
                  <Ionicons name="rocket" size={36} color={theme.colors.accent} />
                </View>
                <View style={{ flex: 1, marginLeft: theme.spacing[4] }}>
                  <Text style={[type.h4, { color: theme.colors.text }]}>
                    {isRTL ? 'قريبًا' : 'Coming Soon'}
                  </Text>
                  <Text
                    style={[
                      type.bodySm,
                      { color: theme.colors.textSecondary, marginTop: theme.spacing[2] },
                    ]}
                  >
                    {isRTL
                      ? 'المدرب الذكي المستند إلى الذكاء الاصطناعي سيكون متاحًا قريبًا'
                      : 'AI-powered coaching assistant will be available soon'}
                  </Text>
                </View>
              </View>
              <Button
                title={isRTL ? 'إشعني عند التوفر' : 'Notify Me'}
                variant="outline"
                size="medium"
                icon="bell"
                onPress={() => {}}
                style={{ marginTop: theme.spacing[5] }}
              />
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
  hero: {},
  heroIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  suggestionsGrid: {
    flexWrap: 'wrap',
  },
  suggestionIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInput: {
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chatItem: {},
  chatIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comingSoonIcon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

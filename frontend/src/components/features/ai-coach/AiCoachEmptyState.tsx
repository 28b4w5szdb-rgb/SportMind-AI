import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { AI_ACTION_CARDS, AI_ROLE_EXAMPLES } from '@/src/features/ai-coach/constants';
import type { AiModuleId } from '@/src/features/ai-coach/types';
import { SUGGESTED_PROMPTS } from '@/src/data/mock/ai-coach';
import { useTranslation } from 'react-i18next';

interface AiCoachEmptyStateProps {
  onSelectModule: (moduleId: AiModuleId) => void;
  onSendPrompt: (text: string, moduleId: AiModuleId) => void;
}

export function AiCoachEmptyState({ onSelectModule, onSendPrompt }: AiCoachEmptyStateProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing[4] }} showsVerticalScrollIndicator={false}>
      <View style={[styles.hero, { paddingVertical: theme.spacing[4], alignItems: 'center' }]}>
        <LinearGradient colors={['#0066FF', '#0D9488']} style={[styles.icon, { borderRadius: theme.borderRadius['3xl'] }]}>
          <Ionicons name="sparkles" size={36} color="#FFF" />
        </LinearGradient>
        <Text style={[type.h3, { color: theme.colors.text, marginTop: theme.spacing[4], textAlign: 'center' }]}>
          {t('aiCoach.welcomeTitle')}
        </Text>
        <Text
          style={[
            type.body,
            {
              color: theme.colors.textSecondary,
              marginTop: theme.spacing[2],
              textAlign: 'center',
              maxWidth: 340,
              lineHeight: isRTL ? 28 : 24,
            },
          ]}
        >
          {t('aiCoach.welcome')}
        </Text>
      </View>

      <Text style={[type.label, styles.sectionLabel, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
        {t('aiCoach.quickActions')}
      </Text>
      <View style={styles.grid}>
        {AI_ACTION_CARDS.map((action) => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={0.85}
            style={styles.gridItem}
            onPress={() => {
              onSelectModule(action.moduleId);
              onSendPrompt(t(action.promptKey), action.moduleId);
            }}
          >
            <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, ...theme.shadows.sm, flex: 1 }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <View style={[styles.actionIcon, { backgroundColor: action.color + '18', borderRadius: theme.borderRadius.lg }]}>
                  <Ionicons name={action.icon} size={18} color={action.color} />
                </View>
                <Text
                  style={[
                    type.bodySm,
                    { color: theme.colors.text, flex: 1, marginHorizontal: theme.spacing[2], textAlign: textAlign('start') },
                  ]}
                  numberOfLines={2}
                >
                  {t(action.labelKey)}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[type.label, styles.sectionLabel, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
        {t('aiCoach.suggestedPrompts')}
      </Text>
      <View style={{ gap: theme.spacing.sm }}>
        {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
          <TouchableOpacity
            key={prompt.id}
            activeOpacity={0.85}
            onPress={() => onSendPrompt(isRTL ? prompt.textAr : prompt.textEn, prompt.agentId === 'nutrition' ? 'nutrition' : prompt.agentId === 'recovery' ? 'recovery' : 'performance')}
          >
            <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, ...theme.shadows.sm }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.colors.primary} />
                <Text
                  style={[
                    type.bodySm,
                    { color: theme.colors.text, flex: 1, marginHorizontal: theme.spacing[3], textAlign: textAlign('start'), lineHeight: isRTL ? 24 : 20 },
                  ]}
                >
                  {isRTL ? prompt.textAr : prompt.textEn}
                </Text>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={theme.colors.textTertiary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[type.label, styles.sectionLabel, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
        {t('aiCoach.roleExamples')}
      </Text>
      <View style={{ gap: theme.spacing.sm }}>
        {AI_ROLE_EXAMPLES.map((role) => (
          <TouchableOpacity
            key={role.id}
            activeOpacity={0.85}
            onPress={() => onSendPrompt(t(role.promptKey), 'performance')}
          >
            <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.lg }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <Ionicons name={role.icon} size={18} color={theme.colors.primary} />
                <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
                  <Text style={[type.label, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                    {t(role.roleKey)}
                  </Text>
                  <Text
                    style={[
                      type.caption,
                      { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start'), lineHeight: isRTL ? 20 : 18 },
                    ]}
                    numberOfLines={2}
                  >
                    {t(role.promptKey)}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {},
  icon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    marginBottom: 10,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 8,
  },
  gridItem: {
    width: '50%',
    padding: 4,
  },
  actionIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

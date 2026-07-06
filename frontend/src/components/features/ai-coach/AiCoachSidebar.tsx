import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { AI_MODULES } from '@/src/features/ai-coach/constants';
import type { StoredConversation } from '@/src/data/mock/store';
import type { AiAgentId } from '@/src/data/mock/ai-coach';
import { useTranslation } from 'react-i18next';

function agentToModuleLabel(agentId: AiAgentId, t: (key: string) => string): string {
  const mod = AI_MODULES.find((m) => m.agentId === agentId);
  return mod ? t(mod.labelKey) : agentId;
}

function formatRelativeTime(iso: string, t: (key: string, opts?: Record<string, unknown>) => string, isRTL: boolean): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return t('aiCoach.time.justNow');
  if (diffMins < 60) return t('aiCoach.time.minutesAgo', { count: diffMins });
  if (diffHours < 24) return t('aiCoach.time.hoursAgo', { count: diffHours });
  if (diffDays === 1) return t('aiCoach.time.yesterday');
  if (diffDays < 7) return t('aiCoach.time.daysAgo', { count: diffDays });
  return d.toLocaleDateString(isRTL ? 'ar' : 'en', { month: 'short', day: 'numeric' });
}

interface AiCoachSidebarProps {
  conversations: StoredConversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export function AiCoachSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
}: AiCoachSidebarProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign, isRTL } = useDirection();
  const { t } = useTranslation();

  const handleArchive = (conv: StoredConversation) => {
    Alert.alert(t('aiCoach.sidebar.archive'), t('aiCoach.sidebar.archiveHint'));
  };

  const handleDelete = (conv: StoredConversation) => {
    Alert.alert(t('aiCoach.sidebar.delete'), t('aiCoach.sidebar.deleteHint'));
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={onNewChat} activeOpacity={0.85} style={{ marginBottom: theme.spacing.md }}>
        <LinearGradient colors={['#0066FF', '#0D9488']} style={[styles.newChatBtn, { borderRadius: theme.borderRadius.lg }]}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={[type.button, { color: '#FFF', marginStart: theme.spacing.sm, fontSize: 14 }]}>
            {t('aiCoach.newChat')}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={[type.label, { color: theme.colors.textTertiary, marginBottom: theme.spacing[2], textAlign: textAlign('start') }]}>
        {t('aiCoach.sidebar.recent')}
      </Text>

      {conversations.length === 0 ? (
        <Text style={[type.bodySm, { color: theme.colors.textTertiary, textAlign: textAlign('start'), paddingVertical: 12 }]}>
          {t('aiCoach.sidebar.empty')}
        </Text>
      ) : (
        conversations.map((conv) => {
          const active = conv.id === activeConversationId;
          return (
            <TouchableOpacity
              key={conv.id}
              activeOpacity={0.85}
              onPress={() => onSelectConversation(conv.id)}
              style={[
                styles.convItem,
                {
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: active ? theme.colors.primary + '12' : theme.colors.surface,
                  borderWidth: active ? 1.5 : StyleSheet.hairlineWidth,
                  borderColor: active ? theme.colors.primary + '50' : theme.colors.border,
                },
              ]}
            >
              <View style={[styles.convHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text
                  style={[
                    type.bodySm,
                    {
                      color: theme.colors.text,
                      textAlign: textAlign('start'),
                      fontWeight: active ? '600' : '500',
                      flex: 1,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {conv.title}
                </Text>
                {active && <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />}
              </View>
              <View style={[styles.metaRow, { flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 6 }]}>
                <Badge label={agentToModuleLabel(conv.agentId, t)} variant="info" />
                <Text style={[type.caption, { color: theme.colors.textTertiary, marginStart: isRTL ? 0 : 8, marginEnd: isRTL ? 8 : 0 }]}>
                  {formatRelativeTime(conv.updatedAt, t, isRTL)} · {conv.messages.length} {t('aiCoach.sidebar.messages')}
                </Text>
              </View>
              <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row', marginTop: 8 }]}>
                <TouchableOpacity onPress={() => handleArchive(conv)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="archive-outline" size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(conv)}
                  style={{ marginStart: isRTL ? 0 : 16, marginEnd: isRTL ? 16 : 0 }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  convItem: {
    padding: 12,
    marginBottom: 8,
  },
  convHeader: {
    alignItems: 'flex-start',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginStart: 8,
  },
  metaRow: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  actions: {
    alignItems: 'center',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { AiMessage } from '@/src/data/mock/ai-coach';

interface ChatMessageProps {
  message: AiMessage;
  onCopy?: (text: string) => void;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

export function ChatMessage({ message, onCopy, onRegenerate, isLastAssistant }: ChatMessageProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, { flexDirection: flexRow(true), justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: theme.spacing.md }]}>
      {!isUser && (
        <LinearGradient colors={['#0066FF', '#0D9488']} style={[styles.avatar, { borderRadius: theme.borderRadius.lg }]}>
          <Ionicons name="sparkles" size={16} color="#FFF" />
        </LinearGradient>
      )}
      <View style={{ maxWidth: '82%', marginHorizontal: theme.spacing.sm }}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
              borderColor: isUser ? theme.colors.primary : theme.colors.border,
              borderRadius: theme.borderRadius['2xl'],
              borderTopStartRadius: isUser ? theme.borderRadius['2xl'] : theme.borderRadius.sm,
              borderTopEndRadius: isUser ? theme.borderRadius.sm : theme.borderRadius['2xl'],
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm + 2,
              borderWidth: isUser ? 0 : 1,
              ...(!isUser ? theme.shadows.sm : {}),
            },
          ]}
        >
          <Text style={[type.body, { color: isUser ? '#FFF' : theme.colors.text, textAlign: textAlign('start'), lineHeight: 22 }]}>
            {message.content}
          </Text>
          <Text style={[type.caption, { color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {!isUser && (onCopy || onRegenerate) && (
          <View style={[styles.actions, { flexDirection: flexRow(true), marginTop: 6 }]}>
            {onCopy && (
              <TouchableOpacity onPress={() => onCopy(message.content)} style={styles.actionBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Ionicons name="copy-outline" size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            )}
            {isLastAssistant && onRegenerate && (
              <TouchableOpacity onPress={onRegenerate} style={[styles.actionBtn, { marginStart: 12 }]} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                <Ionicons name="refresh-outline" size={16} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {isUser && (
        <View style={[styles.avatar, { borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="person" size={16} color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'flex-end' },
  avatar: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  bubble: {},
  actions: { alignItems: 'center' },
  actionBtn: { padding: 4 },
});

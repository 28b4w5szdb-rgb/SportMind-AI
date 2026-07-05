import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { AiMessage } from '@/src/data/mock/ai-coach';

interface ChatMessageProps {
  message: AiMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.row,
        {
          flexDirection: flexRow(true),
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: theme.spacing.md,
        },
      ]}
    >
      {!isUser && (
        <LinearGradient
          colors={['#0066FF', '#0D9488']}
          style={[styles.avatar, { borderRadius: theme.borderRadius.lg }]}
        >
          <Ionicons name="sparkles" size={16} color="#FFF" />
        </LinearGradient>
      )}
      <View
        style={[
          styles.bubble,
          {
            maxWidth: '82%',
            backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
            borderColor: isUser ? theme.colors.primary : theme.colors.border,
            borderRadius: theme.borderRadius['2xl'],
            borderTopStartRadius: isUser ? theme.borderRadius['2xl'] : theme.borderRadius.sm,
            borderTopEndRadius: isUser ? theme.borderRadius.sm : theme.borderRadius['2xl'],
            marginHorizontal: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm + 2,
            borderWidth: isUser ? 0 : 1,
          },
        ]}
      >
        <Text
          style={[
            type.body,
            {
              color: isUser ? '#FFF' : theme.colors.text,
              textAlign: textAlign('start'),
              lineHeight: 22,
            },
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            type.caption,
            {
              color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary,
              marginTop: 6,
              textAlign: textAlign('start'),
            },
          ]}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {isUser && (
        <View
          style={[
            styles.avatar,
            {
              borderRadius: theme.borderRadius.lg,
              backgroundColor: theme.colors.primary + '20',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name="person" size={16} color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {},
});

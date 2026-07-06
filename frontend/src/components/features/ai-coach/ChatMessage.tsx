import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
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

function isSectionHeader(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^(📋|📊|🎯|💡|✓|⚠️|🏋️|📈|😴|📉|❤️|🚶|🥩|💧|📏|🧪|⌚)/.test(trimmed) ||
    /^(الملخص|المؤشرات المهمة|القرار التدريبي|التوصية|مستوى الثقة|Summary|Key indicators|Training decision|Recommendation|Confidence)/i.test(
      trimmed
    )
  );
}

export function ChatMessage({ message, onCopy, onRegenerate, isLastAssistant }: ChatMessageProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { width: windowWidth } = useWindowDimensions();
  const isUser = message.role === 'user';
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768;

  const bubbleMaxWidth = isDesktop
    ? isUser
      ? '72%'
      : '78%'
    : isTablet
      ? isUser
        ? '84%'
        : '90%'
      : isUser
        ? '85%'
        : '95%';
  const bodyLineHeight = isRTL ? 28 : 24;

  const paragraphs = useMemo(
    () => message.content.split('\n\n').map((block) => block.trim()).filter(Boolean),
    [message.content]
  );

  const textBaseStyle = {
    color: isUser ? '#FFF' : theme.colors.text,
    textAlign: textAlign('start') as 'left' | 'right' | 'auto',
    lineHeight: bodyLineHeight,
    writingDirection: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    flexShrink: 1,
    width: '100%' as const,
    ...(Platform.OS === 'android' ? { textAlignVertical: 'top' as const } : {}),
  };

  return (
    <View
      style={[
        styles.row,
        {
          flexDirection: flexRow(true),
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.md,
          width: '100%',
        },
      ]}
      collapsable={false}
    >
      {!isUser && (
        <LinearGradient colors={['#0066FF', '#0D9488']} style={[styles.avatar, { borderRadius: theme.borderRadius.lg }]}>
          <Ionicons name="sparkles" size={16} color="#FFF" />
        </LinearGradient>
      )}
      <View
        style={[
          styles.messageColumn,
          {
            maxWidth: bubbleMaxWidth,
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            marginHorizontal: isDesktop ? theme.spacing.sm : theme.spacing.xs,
          },
        ]}
        collapsable={false}
      >
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
              paddingVertical: theme.spacing.sm + 6,
              borderWidth: isUser ? 0 : 1,
              ...(!isUser ? theme.shadows.sm : {}),
            },
          ]}
          collapsable={false}
        >
          <View style={styles.bubbleContent}>
            {paragraphs.map((paragraph, index) => {
              const lines = paragraph.split('\n');
              return (
                <Text
                  key={`${index}-${paragraph.slice(0, 16)}`}
                  style={[
                    type.body,
                    textBaseStyle,
                    index > 0 ? styles.paragraphGap : undefined,
                  ]}
                >
                  {lines.map((line, lineIndex) => (
                    <Text
                      key={`${index}-${lineIndex}`}
                      style={{
                        fontWeight: lineIndex === 0 && isSectionHeader(line) ? '700' : '400',
                        lineHeight: bodyLineHeight,
                        writingDirection: isRTL ? 'rtl' : 'ltr',
                      }}
                    >
                      {lineIndex > 0 ? '\n' : ''}
                      {line}
                    </Text>
                  ))}
                </Text>
              );
            })}
          </View>
          <Text
            style={[
              type.caption,
              styles.timestamp,
              {
                color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary,
                textAlign: textAlign('start'),
                writingDirection: isRTL ? 'rtl' : 'ltr',
                lineHeight: isRTL ? 20 : 18,
              },
            ]}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {!isUser && (onCopy || onRegenerate) && (
          <View
            style={[
              styles.actions,
              {
                flexDirection: flexRow(true),
                alignSelf: isRTL ? 'flex-end' : 'flex-start',
              },
            ]}
          >
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
  row: {},
  avatar: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  messageColumn: {
    flexShrink: 1,
    flexGrow: 0,
    minWidth: 0,
  },
  bubble: {
    overflow: 'visible',
    flexShrink: 1,
    alignSelf: 'stretch',
  },
  bubbleContent: {
    flexShrink: 1,
    flexWrap: 'wrap',
    overflow: 'visible',
  },
  paragraphGap: {
    marginTop: 10,
  },
  timestamp: {
    marginTop: 10,
    flexShrink: 0,
  },
  actions: {
    alignItems: 'center',
    marginTop: 8,
    flexShrink: 0,
  },
  actionBtn: {
    padding: 4,
  },
});

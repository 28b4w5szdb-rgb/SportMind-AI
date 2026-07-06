import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useTranslation } from 'react-i18next';

interface AiMessageActionsProps {
  content: string;
  onCopy: (text: string) => void;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
}

export function AiMessageActions({ content, onCopy, onRegenerate, showRegenerate }: AiMessageActionsProps) {
  const theme = useTheme();
  const { flexRow, isRTL } = useDirection();
  const { t } = useTranslation();

  const placeholder = (titleKey: string, bodyKey: string) => {
    Alert.alert(t(titleKey), t(bodyKey));
  };

  const actions = [
    { id: 'copy', icon: 'copy-outline' as const, onPress: () => onCopy(content), label: t('aiCoach.responseActions.copy') },
    ...(showRegenerate && onRegenerate
      ? [{ id: 'regen', icon: 'refresh-outline' as const, onPress: onRegenerate, label: t('aiCoach.responseActions.regenerate') }]
      : []),
    {
      id: 'report',
      icon: 'document-attach-outline' as const,
      onPress: () => placeholder('aiCoach.responseActions.addToReport', 'aiCoach.responseActions.addToReportHint'),
      label: t('aiCoach.responseActions.addToReport'),
    },
    {
      id: 'pdf',
      icon: 'download-outline' as const,
      onPress: () => placeholder('aiCoach.responseActions.exportPdf', 'aiCoach.responseActions.exportPdfHint'),
      label: t('aiCoach.responseActions.exportPdf'),
    },
    {
      id: 'share',
      icon: 'share-outline' as const,
      onPress: () => placeholder('aiCoach.responseActions.share', 'aiCoach.responseActions.shareHint'),
      label: t('aiCoach.responseActions.share'),
    },
  ];

  return (
    <View
      style={[
        styles.row,
        {
          flexDirection: flexRow(true),
          alignSelf: isRTL ? 'flex-end' : 'flex-start',
          marginTop: 8,
        },
      ]}
    >
      {actions.map((action, index) => (
        <TouchableOpacity
          key={action.id}
          onPress={action.onPress}
          style={[styles.btn, index > 0 ? { marginStart: 4 } : undefined]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityLabel={action.label}
        >
          <Ionicons name={action.icon} size={16} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexShrink: 0,
  },
  btn: {
    padding: 6,
  },
});

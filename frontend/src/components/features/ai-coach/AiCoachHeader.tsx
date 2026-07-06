import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useTranslation } from 'react-i18next';

interface AiCoachHeaderProps {
  isDesktop: boolean;
  onOpenSidebar?: () => void;
  onExport: () => void;
  onNewChat: () => void;
}

export function AiCoachHeader({ isDesktop, onOpenSidebar, onExport, onNewChat }: AiCoachHeaderProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.header,
        {
          flexDirection: flexRow(true),
          borderBottomColor: theme.colors.border,
          paddingHorizontal: theme.spacing[4],
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      {!isDesktop && onOpenSidebar && (
        <TouchableOpacity onPress={onOpenSidebar} style={styles.iconBtn} accessibilityLabel={t('aiCoach.sidebar.title')}>
          <Ionicons name="menu" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      <LinearGradient colors={['#0066FF', '#0D9488']} style={[styles.logo, { borderRadius: theme.borderRadius.lg }]}>
        <Ionicons name="sparkles" size={18} color="#FFF" />
      </LinearGradient>
      <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
        <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('aiCoach.title')}</Text>
        <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
          {t('aiCoach.subtitle')}
        </Text>
      </View>
      <TouchableOpacity onPress={onExport} style={styles.iconBtn} accessibilityLabel={t('aiCoach.export')}>
        <Ionicons name="download-outline" size={21} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onNewChat} style={styles.iconBtn} accessibilityLabel={t('aiCoach.newChat')}>
        <Ionicons name="create-outline" size={21} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

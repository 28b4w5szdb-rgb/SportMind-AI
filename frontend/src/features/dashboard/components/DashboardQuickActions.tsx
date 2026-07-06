import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';

interface QuickAction {
  id: string;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string | { pathname: string };
}

interface DashboardQuickActionsProps {
  actions: QuickAction[];
  columns: number;
}

export function DashboardQuickActions({ actions, columns }: DashboardQuickActionsProps) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View>
      <SectionHeader title={t('dashboard.quickActions')} subtitle={t('dashboard.quickActionsSub')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3] }}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={theme.tokens.interaction.activeOpacity}
            onPress={() => router.push(action.route as never)}
            style={{ width: columns >= 3 ? `${100 / columns - 2}%` : '47%', minWidth: 140, flexGrow: 1 }}
          >
            <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius[theme.tokens.radius.card], alignItems: 'center' }}>
              <LinearGradient
                colors={[action.color, action.color + 'CC']}
                style={{ width: 52, height: 52, borderRadius: theme.borderRadius.xl, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name={action.icon} size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[type.captionBold, { color: theme.colors.text, marginTop: theme.spacing[3], textAlign: 'center' }]} numberOfLines={2}>
                {t(action.labelKey)}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

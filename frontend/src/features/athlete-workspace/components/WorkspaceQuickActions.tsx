import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import type { MockAthlete } from '@/src/data/mock/types';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { QuickActionId } from '../types';

interface WorkspaceQuickActionsProps {
  athlete: MockAthlete;
}

const ACTIONS: Array<{
  id: QuickActionId;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  color: string;
}> = [
  { id: 'add_test', icon: 'analytics', labelKey: 'athleteWorkspace.actions.addTest', color: '#0066FF' },
  { id: 'daily_checkin', icon: 'heart-circle', labelKey: 'athleteWorkspace.actions.dailyCheckIn', color: '#10B981' },
  { id: 'edit_athlete', icon: 'create-outline', labelKey: 'athleteWorkspace.actions.editAthlete', color: '#0D9488' },
  { id: 'create_report', icon: 'document-text', labelKey: 'athleteWorkspace.actions.createReport', color: '#8B5CF6' },
  { id: 'compare', icon: 'git-compare', labelKey: 'athleteWorkspace.actions.compare', color: '#F97316' },
  { id: 'ask_ai', icon: 'chatbubbles', labelKey: 'athleteWorkspace.actions.askAi', color: '#10B981' },
  { id: 'export', icon: 'share-outline', labelKey: 'athleteWorkspace.actions.export', color: '#64748B' },
];

export function WorkspaceQuickActions({ athlete }: WorkspaceQuickActionsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, isRTL } = useDirection();

  const handlePress = (id: QuickActionId) => {
    switch (id) {
      case 'add_test':
        router.push(APP_ROUTES.performanceLabLibrary);
        break;
      case 'daily_checkin':
        router.push(APP_ROUTES.dailyCheckIn(athlete.id));
        break;
      case 'edit_athlete':
        router.push(APP_ROUTES.athleteEdit(athlete.id));
        break;
      case 'create_report':
        router.push(APP_ROUTES.reportBuilder);
        break;
      case 'compare':
        router.push(APP_ROUTES.performanceLabCompare);
        break;
      case 'ask_ai':
        router.push(APP_ROUTES.aiCoach);
        break;
      case 'export':
        Alert.alert(t('athleteWorkspace.actions.export'), t('athleteWorkspace.actions.exportHint'));
        break;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing.sm, paddingVertical: 4 }}
      style={{ marginBottom: theme.spacing.lg }}
    >
      {ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          onPress={() => handlePress(action.id)}
          activeOpacity={0.85}
          style={{
            flexDirection: flexRow(true),
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...theme.shadows.sm,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: `${action.color}18`,
              alignItems: 'center',
              justifyContent: 'center',
              marginEnd: isRTL ? 0 : 8,
              marginStart: isRTL ? 8 : 0,
            }}
          >
            <Ionicons name={action.icon} size={18} color={action.color} />
          </View>
          <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600' }]}>{t(action.labelKey)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

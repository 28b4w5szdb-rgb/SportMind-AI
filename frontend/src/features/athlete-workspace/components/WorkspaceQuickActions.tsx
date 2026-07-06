import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import type { MockAthlete } from '@/src/data/mock/types';
import { useActiveTrainingPlanForAthlete } from '@/src/data/mock/hooks';
import { findTodaySession, todayDateKey } from '@/src/features/training-builder';
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
  { id: 'add_injury', icon: 'medkit', labelKey: 'athleteWorkspace.actions.addInjury', color: '#EF4444' },
  { id: 'injury_prevention', icon: 'shield-checkmark', labelKey: 'athleteWorkspace.actions.injuryPrevention', color: '#8B5CF6' },
  { id: 'training_builder', icon: 'barbell', labelKey: 'athleteWorkspace.actions.trainingBuilder', color: '#0066FF' },
  { id: 'log_session', icon: 'checkmark-done', labelKey: 'athleteWorkspace.actions.logSession', color: '#0D9488' },
  { id: 'nutrition_log', icon: 'restaurant', labelKey: 'athleteWorkspace.actions.nutritionLog', color: '#F97316' },
  { id: 'nutrition_center', icon: 'nutrition', labelKey: 'athleteWorkspace.actions.nutritionCenter', color: '#EA580C' },
  { id: 'log_body_composition', icon: 'body', labelKey: 'athleteWorkspace.actions.logBodyComposition', color: '#D97706' },
  { id: 'connect_device', icon: 'watch', labelKey: 'athleteWorkspace.actions.connectDevice', color: '#0EA5E9' },
  { id: 'sync_wearable', icon: 'cloud-download-outline', labelKey: 'athleteWorkspace.actions.syncWearable', color: '#0284C7' },
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
  const activePlan = useActiveTrainingPlanForAthlete(athlete.id);
  const todaySession = useMemo(() => findTodaySession(activePlan, todayDateKey()), [activePlan]);

  const handlePress = (id: QuickActionId) => {
    switch (id) {
      case 'add_test':
        router.push(APP_ROUTES.performanceLabLibrary);
        break;
      case 'daily_checkin':
        router.push(APP_ROUTES.dailyCheckIn(athlete.id));
        break;
      case 'add_injury':
        router.push(APP_ROUTES.addInjury(athlete.id));
        break;
      case 'injury_prevention':
        router.push(APP_ROUTES.sportsMedicine(athlete.id));
        break;
      case 'training_builder':
        router.push(APP_ROUTES.trainingBuilder(athlete.id));
        break;
      case 'log_session':
        if (todaySession) {
          router.push(APP_ROUTES.logTrainingSession(todaySession.id, athlete.id));
        } else {
          router.push(APP_ROUTES.trainingBuilder(athlete.id));
        }
        break;
      case 'nutrition_log':
        router.push(APP_ROUTES.nutritionLog(athlete.id));
        break;
      case 'nutrition_center':
        router.push(APP_ROUTES.nutritionCenter(athlete.id));
        break;
      case 'log_body_composition':
        router.push(APP_ROUTES.bodyComposition(athlete.id));
        break;
      case 'connect_device':
        router.push(APP_ROUTES.wearables(athlete.id));
        break;
      case 'sync_wearable':
        router.push(APP_ROUTES.wearables(athlete.id));
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

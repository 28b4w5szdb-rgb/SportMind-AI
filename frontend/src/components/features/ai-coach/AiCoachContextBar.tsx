import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/src/components/common/Chip';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { AI_MODULES } from '@/src/features/ai-coach/constants';
import type { AiContextScope, AiModuleId } from '@/src/features/ai-coach/types';
import { useTranslation } from 'react-i18next';
import type { MockAthlete } from '@/src/data/mock/types';

interface AiCoachContextBarProps {
  contextScope: AiContextScope;
  onScopeChange: (scope: AiContextScope) => void;
  selectedModuleId: AiModuleId;
  onModuleChange: (moduleId: AiModuleId) => void;
  athletes: MockAthlete[];
  selectedAthleteId: string | null;
  onAthleteChange: (id: string) => void;
}

export function AiCoachContextBar({
  contextScope,
  onScopeChange,
  selectedModuleId,
  onModuleChange,
  athletes,
  selectedAthleteId,
  onAthleteChange,
}: AiCoachContextBarProps) {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const { t } = useTranslation();

  return (
    <View style={[styles.wrapper, { borderBottomColor: theme.colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, { paddingHorizontal: theme.spacing[3], paddingVertical: 6 }]}
      >
        <Chip
          label={t('aiCoach.context.team')}
          icon="people"
          selected={contextScope === 'team'}
          onPress={() => onScopeChange('team')}
          size="sm"
          variant="soft"
        />
        {athletes.map((athlete) => (
          <Chip
            key={athlete.id}
            label={`${athlete.first_name} ${athlete.last_name}`}
            icon="person"
            selected={contextScope === 'athlete' && selectedAthleteId === athlete.id}
            onPress={() => {
              onScopeChange('athlete');
              onAthleteChange(athlete.id);
            }}
            size="sm"
            variant="soft"
          />
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, { paddingHorizontal: theme.spacing[3], paddingBottom: 8, gap: 8 }]}
      >
        {AI_MODULES.map((mod) => (
          <Chip
            key={mod.id}
            label={t(mod.labelKey)}
            icon={mod.icon}
            selected={selectedModuleId === mod.id}
            onPress={() => onModuleChange(mod.id)}
            size="sm"
            variant="solid"
            color={mod.color}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    alignItems: 'center',
    gap: 8,
  },
});

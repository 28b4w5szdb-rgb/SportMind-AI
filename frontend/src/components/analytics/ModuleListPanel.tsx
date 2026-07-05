import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@/src/components/common/FormSection';
import type { AnalyticsModuleResult } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface ModuleListPanelProps {
  title: string;
  modules: AnalyticsModuleResult[];
  variant: 'strength' | 'weakness';
}

export function ModuleListPanel({ title, modules, variant }: ModuleListPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <FormSection title={title}>
      {modules.map((mod) => (
        <View
          key={mod.id}
          style={{
            flexDirection: flexRow(true),
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}
        >
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: mod.color, marginEnd: 10 }} />
          <Text style={[type.body, { color: theme.colors.text, flex: 1, textAlign: textAlign('start') }]}>{t(mod.labelKey)}</Text>
          <Text style={[type.bodySm, { color: variant === 'strength' ? theme.colors.success : theme.colors.warning }]}>{mod.score}</Text>
        </View>
      ))}
    </FormSection>
  );
}

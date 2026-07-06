import React, { useState } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CockpitCollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  action?: React.ReactNode;
}

export function CockpitCollapsibleSection({
  title,
  subtitle,
  children,
  defaultExpanded = true,
  action,
}: CockpitCollapsibleSectionProps) {
  const theme = useTheme();
  const { flexRow, isRTL } = useDirection();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <TouchableOpacity activeOpacity={0.85} onPress={toggle} accessibilityRole="button">
        <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <SectionHeader title={title} subtitle={subtitle} action={action} titleSize="h5" style={{ marginBottom: 0 }} />
          </View>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.textTertiary}
            style={{ marginTop: 4, transform: isRTL ? [{ scaleX: -1 }] : undefined }}
          />
        </View>
      </TouchableOpacity>
      {expanded ? (
        <Card variant="outlined" padding="none" style={{ borderRadius: theme.borderRadius.xl, marginTop: theme.spacing[3], overflow: 'hidden' }}>
          <View style={{ padding: theme.spacing[4] }}>{children}</View>
        </Card>
      ) : null}
    </View>
  );
}

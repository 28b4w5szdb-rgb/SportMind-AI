import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/src/components/common/Chip';
import { useTheme } from '@/src/core/theme';
import { useTranslation } from 'react-i18next';
import { COCKPIT_NAV_ITEMS, type CockpitSectionId } from '../../constants/cockpitSections';

interface CockpitStickyNavProps {
  activeSection: CockpitSectionId;
  onSelect: (id: CockpitSectionId) => void;
}

export function CockpitStickyNav({ activeSection, onSelect }: CockpitStickyNavProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {COCKPIT_NAV_ITEMS.map((item) => (
          <Chip
            key={item.id}
            label={t(item.labelKey)}
            icon={item.icon}
            selected={activeSection === item.id}
            onPress={() => onSelect(item.id)}
            size="sm"
            variant="soft"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
});

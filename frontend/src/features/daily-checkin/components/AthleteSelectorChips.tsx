import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

import type { MockAthlete } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface AthleteSelectorChipsProps {
  athletes: MockAthlete[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AthleteSelectorChips({ athletes, selectedId, onSelect }: AthleteSelectorChipsProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow } = useDirection();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm, paddingVertical: 4 }}>
      {athletes.map((athlete) => {
        const active = athlete.id === selectedId;
        return (
          <TouchableOpacity
            key={athlete.id}
            onPress={() => onSelect(athlete.id)}
            activeOpacity={0.85}
            style={{
              flexDirection: flexRow(true),
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: theme.borderRadius.xl,
              backgroundColor: active ? theme.colors.primary : theme.colors.surface,
              borderWidth: 1,
              borderColor: active ? theme.colors.primary : theme.colors.border,
            }}
          >
            <Text style={[type.bodySm, { color: active ? '#FFF' : theme.colors.text, fontWeight: '600' }]}>
              {athlete.first_name} {athlete.last_name[0]}.
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

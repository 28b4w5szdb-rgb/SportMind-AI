import React from 'react';
import { ScrollView } from 'react-native';

import type { MockAthlete } from '@/src/data/mock/types';
import { Chip } from '@/src/components/common/Chip';
import { useTheme } from '@/src/core/theme';

interface AthleteSelectorChipsProps {
  athletes: MockAthlete[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AthleteSelectorChips({ athletes, selectedId, onSelect }: AthleteSelectorChipsProps) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing[2], paddingVertical: theme.spacing[1] }}
    >
      {athletes.map((athlete) => (
        <Chip
          key={athlete.id}
          label={`${athlete.first_name} ${athlete.last_name[0]}.`}
          selected={athlete.id === selectedId}
          onPress={() => onSelect(athlete.id)}
          variant="solid"
          size="md"
        />
      ))}
    </ScrollView>
  );
}

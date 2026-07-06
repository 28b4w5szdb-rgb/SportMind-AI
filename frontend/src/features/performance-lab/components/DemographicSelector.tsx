import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import {
  AGE_BANDS,
  COMPETITION_LEVELS,
  SPORT_PROFILES,
  type TestDemographicContext,
  type AgeBandId,
  type GenderProfile,
  type SportProfile,
  type CompetitionLevel,
} from '@/src/features/testing-science';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface DemographicSelectorProps {
  value: TestDemographicContext;
  onChange: (next: TestDemographicContext) => void;
}

function ChipRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
  labelFor,
}: {
  label: string;
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
  labelFor: (value: T) => string;
}) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: 8, textAlign: textAlign('start') }]}>
        {label}
      </Text>
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8 }}>
        {options.map((option) => (
          <Button
            key={option}
            title={labelFor(option)}
            onPress={() => onSelect(option)}
            variant={selected === option ? 'primary' : 'outline'}
            size="small"
          />
        ))}
      </View>
    </View>
  );
}

export function DemographicSelector({ value, onChange }: DemographicSelectorProps) {
  const { t } = useTranslation();

  const ageOptions = AGE_BANDS.map((band) => band.id as AgeBandId);
  const genderOptions: GenderProfile[] = ['male', 'female'];
  const sportOptions = Object.keys(SPORT_PROFILES) as SportProfile[];
  const levelOptions = Object.keys(COMPETITION_LEVELS) as CompetitionLevel[];

  return (
    <FormSection title={t('testingCenter.demographic.title')} subtitle={t('testingCenter.demographic.subtitle')}>
      <ChipRow
        label={t('testingCenter.demographic.ageGroup')}
        options={ageOptions}
        selected={value.ageBandId}
        onSelect={(ageBandId) => onChange({ ...value, ageBandId })}
        labelFor={(id) => t(AGE_BANDS.find((b) => b.id === id)?.labelKey ?? `testingScience.age.${id}`)}
      />
      <ChipRow
        label={t('testingCenter.demographic.gender')}
        options={genderOptions}
        selected={value.gender}
        onSelect={(gender) => onChange({ ...value, gender })}
        labelFor={(id) => t(`testingScience.gender.${id}`)}
      />
      <ChipRow
        label={t('testingCenter.demographic.sport')}
        options={sportOptions}
        selected={value.sport}
        onSelect={(sport) => onChange({ ...value, sport })}
        labelFor={(id) => t(SPORT_PROFILES[id].labelKey)}
      />
      <ChipRow
        label={t('testingCenter.demographic.competitionLevel')}
        options={levelOptions}
        selected={value.level}
        onSelect={(level) => onChange({ ...value, level })}
        labelFor={(id) => t(COMPETITION_LEVELS[id].labelKey)}
      />
    </FormSection>
  );
}

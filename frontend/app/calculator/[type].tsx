import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { getCalculatorDefinition } from '@/src/data/mock/calculators';
import { useMockStore } from '@/src/data/mock/store';
import type { CalculatorType } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { Ionicons } from '@expo/vector-icons';

export default function CalculatorTypeScreen() {
  const { type: typeParam } = useLocalSearchParams<{ type: string }>();
  const calcType = (typeParam ?? 'bmi') as CalculatorType;
  const def = getCalculatorDefinition(calcType);
  const { t } = useTranslation();
  const theme = useTheme();
  const typography = useTypography();
  const { textAlign } = useDirection();
  const runCalculation = useMockStore((s) => s.runCalculation);

  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    def?.fields.forEach((f) => {
      init[f.key] = f.defaultValue != null ? String(f.defaultValue) : '';
    });
    return init;
  });
  const [result, setResult] = useState<ReturnType<typeof runCalculation> | null>(null);

  if (!def) {
    return (
      <FeatureScrollScreen title={t('features.calculator.title')}>
        <Text>{t('states.error.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  const handleCalculate = () => {
    const numeric: Record<string, number> = {};
    def.fields.forEach((f) => {
      numeric[f.key] = Number(inputs[f.key]) || 0;
    });
    const record = runCalculation(calcType, t(def.titleKey), numeric);
    setResult(record);
  };

  return (
    <FeatureScrollScreen title={t(def.titleKey)}>
      <Text style={[typography.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t(def.descKey)}
      </Text>

      {def.fields.map((field) => (
        <Input
          key={field.key}
          label={`${t(field.labelKey)}${field.unit ? ` (${field.unit})` : ''}`}
          value={inputs[field.key] ?? ''}
          onChangeText={(v) => setInputs((prev) => ({ ...prev, [field.key]: v }))}
          keyboardType="decimal-pad"
          containerStyle={{ marginBottom: theme.spacing.md }}
        />
      ))}

      <Button title={t('features.calculator.calculate')} onPress={handleCalculate} fullWidth icon="calculator" />

      {result && (
        <Card variant="elevated" padding="lg" style={{ marginTop: theme.spacing.xl, borderRadius: theme.borderRadius['2xl'] }}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={28} color={theme.colors.success} />
            <Text style={[typography.h4, { color: theme.colors.text, marginStart: theme.spacing.sm }]}>
              {t('features.calculator.result')}
            </Text>
          </View>
          <Text style={[typography.displaySmall, { color: theme.colors.primary, marginTop: theme.spacing.md }]}>
            {result.result.value} {result.result.unit}
          </Text>
          <Text style={[typography.body, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
            {t('features.calculator.interpretation')}: {result.result.interpretation}
          </Text>
        </Card>
      )}
    </FeatureScrollScreen>
  );
}

const styles = StyleSheet.create({
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

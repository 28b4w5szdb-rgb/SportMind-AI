/**
 * SportMind AI - Sports Science Calculator
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { CALCULATOR_DEFINITIONS } from '@/src/data/mock/calculators';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function CalculatorScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, chevronIcon, textAlign } = useDirection();
  const calculations = useMockStore((s) => s.calculations);

  return (
    <FeatureScrollScreen title={t('features.calculator.title')}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('features.calculator.subtitle')}
      </Text>

      {CALCULATOR_DEFINITIONS.map((calc) => (
        <TouchableOpacity
          key={calc.id}
          activeOpacity={0.7}
          onPress={() => router.push(APP_ROUTES.calculatorType(calc.id))}
        >
          <Card
            style={{
              marginBottom: theme.spacing.md,
              flexDirection: flexRow(true),
              alignItems: 'center',
              padding: 16,
              borderRadius: theme.borderRadius['2xl'],
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                backgroundColor: theme.colors.primary + '20',
                borderRadius: theme.borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={calc.icon} size={28} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
              <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(calc.titleKey)}</Text>
              <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                {t(calc.descKey)}
              </Text>
            </View>
            <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
          </Card>
        </TouchableOpacity>
      ))}

      {calculations.length > 0 && (
        <>
          <Text style={[type.label, { color: theme.colors.textTertiary, marginTop: theme.spacing.lg, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
            {t('features.calculator.recent')}
          </Text>
          {calculations.slice(0, 5).map((c) => (
            <Card key={c.id} variant="outlined" padding="md" style={{ marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.lg }}>
              <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>{c.title}</Text>
              <Text style={[type.numberSm, { color: theme.colors.primary, marginTop: 4, textAlign: textAlign('start') }]}>
                {c.result.value} {c.result.unit}
              </Text>
            </Card>
          ))}
        </>
      )}
    </FeatureScrollScreen>
  );
}

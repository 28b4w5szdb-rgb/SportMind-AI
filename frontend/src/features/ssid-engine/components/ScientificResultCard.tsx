import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import type { SsidInterpretation } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export interface SsidInputRow {
  labelKey: string;
  value: string;
}

interface ScientificResultCardProps {
  interpretation: SsidInterpretation;
  titleKey?: string;
  titleOverride?: string;
  inputs?: SsidInputRow[];
}

function SummaryRow({ labelKey, bodyKey }: { labelKey: string; bodyKey: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <View style={{ marginTop: theme.spacing.md }}>
      <Text style={[type.caption, { color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: textAlign('start') }]}>
        {t(labelKey)}
      </Text>
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start'), lineHeight: 20 }]}>
        {t(bodyKey)}
      </Text>
    </View>
  );
}

export function ScientificResultCard({ interpretation, titleKey, titleOverride, inputs }: ScientificResultCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const heading = titleOverride ?? (titleKey ? t(titleKey) : t(`ssid.metricLabels.${interpretation.metricId}`));

  return (
    <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <Ionicons name="flask" size={22} color={theme.colors.primary} />
        <Text style={[type.h5, { color: theme.colors.text, marginStart: theme.spacing.sm, textAlign: textAlign('start'), flex: 1 }]}>
          {heading}
        </Text>
      </View>

      {inputs && inputs.length > 0 && (
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>{t('ssid.ui.inputs')}</Text>
          {inputs.map((row) => (
            <Text key={row.labelKey} style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              {t(row.labelKey)}: {row.value}
            </Text>
          ))}
        </View>
      )}

      <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>{t('ssid.ui.result')}</Text>
      <Text style={[type.displaySmall, { color: theme.colors.primary, textAlign: textAlign('start'), marginTop: 4 }]}>
        {interpretation.result} {interpretation.unit}
      </Text>

      <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.md, textAlign: textAlign('start') }]}>
        {t('ssid.ui.classification')}
      </Text>
      <View
        style={{
          alignSelf: textAlign('start') === 'right' ? 'flex-end' : 'flex-start',
          marginTop: 4,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 4,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.primary + '18',
        }}
      >
        <Text style={[type.caption, { color: theme.colors.primary, fontWeight: '600' }]}>{t(interpretation.classificationKey)}</Text>
      </View>

      <SummaryRow labelKey="ssid.ui.whatItMeans" bodyKey={interpretation.scientificMeaningKey} />
      <SummaryRow labelKey="ssid.ui.coachAction" bodyKey={interpretation.coachingDecisionKey} />
      <SummaryRow labelKey="ssid.ui.recommendation" bodyKey={interpretation.recommendations.immediateKey} />
    </Card>
  );
}

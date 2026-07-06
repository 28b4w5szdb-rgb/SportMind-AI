import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { SsidInterpretation } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface InterpretationPanelProps {
  interpretation: SsidInterpretation;
}

function InterpretationRow({ labelKey, bodyKey }: { labelKey: string; bodyKey: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[type.caption, { color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: textAlign('start') }]}>
        {t(labelKey)}
      </Text>
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start'), lineHeight: 20 }]}>
        {t(bodyKey)}
      </Text>
    </View>
  );
}

export function InterpretationPanel({ interpretation }: InterpretationPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.md }}>
      <Text style={[type.h6, { color: theme.colors.text, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
        {t('ssid.ui.sectionTitle')}
      </Text>
      <InterpretationRow labelKey="ssid.ui.scientificMeaning" bodyKey={interpretation.scientificMeaningKey} />
      <InterpretationRow labelKey="ssid.ui.physiologicalInterpretation" bodyKey={interpretation.physiologicalInterpretationKey} />
      <InterpretationRow labelKey="ssid.ui.performanceImpact" bodyKey={interpretation.performanceImpactKey} />
      <InterpretationRow labelKey="ssid.ui.riskAnalysis" bodyKey={interpretation.riskAnalysisKey} />
      <InterpretationRow labelKey="ssid.ui.referenceComparison" bodyKey={interpretation.referenceComparisonKey} />
    </Card>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { REPORT_BUILDER_STEPS, stepLabelKey } from '../../constants';
import type { ReportBuilderStep } from '../../types';

interface WizardStepIndicatorProps {
  currentStep: ReportBuilderStep;
}

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const currentIndex = REPORT_BUILDER_STEPS.indexOf(currentStep);

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.xs }}>
        {REPORT_BUILDER_STEPS.map((step, index) => {
          const active = step === currentStep;
          const done = index < currentIndex;
          return (
            <View
              key={step}
              style={{
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 6,
                borderRadius: theme.borderRadius.full,
                backgroundColor: active
                  ? theme.colors.primary + '22'
                  : done
                    ? theme.colors.success + '18'
                    : theme.colors.backgroundSecondary,
                borderWidth: 1,
                borderColor: active ? theme.colors.primary : 'transparent',
              }}
            >
              <Text
                style={[
                  type.captionBold,
                  {
                    color: active ? theme.colors.primary : done ? theme.colors.success : theme.colors.textTertiary,
                    textAlign: textAlign('center'),
                  },
                ]}
              >
                {index + 1}. {t(stepLabelKey(step))}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

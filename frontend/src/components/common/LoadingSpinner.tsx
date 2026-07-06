/**
 * SportMind AI - Loading Spinner Component (branded)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BrandMark } from '@/src/components/brand';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  branded?: boolean;
}

export function LoadingSpinner({ message, fullScreen = false, branded = true }: LoadingSpinnerProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const { t } = useTranslation();
  const loadingLabel = message ?? t('accessibility.loading');

  const content = (
    <>
      {branded ? (
        <BrandMark size="md" accessibilityLabel={loadingLabel} />
      ) : null}
      {message ? (
        <Text
          style={[
            type.body,
            {
              color: theme.colors.textSecondary,
              marginTop: theme.spacing[4],
              textAlign: textAlign('center'),
            },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </>
  );

  if (fullScreen) {
    return (
      <View
        style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}
        accessibilityRole="progressbar"
        accessibilityLiveRegion="polite"
        accessibilityLabel={loadingLabel}
      >
        {content}
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { padding: theme.spacing[6] }]}
      accessibilityRole="progressbar"
      accessibilityLabel={loadingLabel}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

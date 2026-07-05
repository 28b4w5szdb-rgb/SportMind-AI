import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
  Platform,
} from 'react-native';

import { Header } from '@/src/components/layout/Header';
import { Screen } from '@/src/components/layout/Screen';
import { useTheme } from '@/src/core/theme';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';

interface FeatureScrollScreenProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ComponentProps<typeof Header>['rightAction'];
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
}

/** Stack screen shell: header + scroll + responsive max-width content. */
export function FeatureScrollScreen({
  title,
  subtitle,
  showBack = true,
  rightAction,
  children,
  footer,
  contentStyle,
}: FeatureScrollScreenProps) {
  const theme = useTheme();
  const { contentMaxWidth, horizontalPadding, isDesktop } = useResponsiveLayout();

  return (
    <Screen padding={false}>
      <Header title={title} subtitle={subtitle} showBack={showBack} rightAction={rightAction} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: theme.spacing['2xl'],
          },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            width: '100%',
            maxWidth: contentMaxWidth,
            alignSelf: isDesktop ? 'center' : undefined,
          }}
        >
          {children}
        </View>
      </ScrollView>
      {footer}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: 8,
  },
});

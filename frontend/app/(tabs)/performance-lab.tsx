/**
 * SportMind AI - Performance Lab Screen
 * Premium Sports Science Laboratory dashboard
 */

import React from 'react';
import { ScrollView, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/src/core/theme';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';
import { LabDashboard } from '@/src/features/performance-lab/components/lab/LabDashboard';

export default function PerformanceLabScreen() {
  const theme = useTheme();
  const { horizontalPadding, isDesktop } = useResponsiveLayout();
  const { width: windowWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          paddingBottom: theme.spacing[20],
          paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : horizontalPadding,
          paddingTop: isDesktop ? theme.spacing[6] : theme.spacing[4],
          maxWidth: isDesktop ? 1400 : undefined,
          width: '100%',
          alignSelf: isDesktop ? 'center' : undefined,
        }}
        showsVerticalScrollIndicator={false}
      >
        <LabDashboard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});

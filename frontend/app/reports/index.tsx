/**
 * SportMind AI - Reports Center
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/src/components/common/Button';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function ReportsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, chevronIcon, isRTL } = useDirection();
  const reports = useMockStore((s) => s.reports);

  return (
    <FeatureScrollScreen
      title={t('features.reports.title')}
      rightAction={{
        icon: 'add',
        onPress: () => router.push(APP_ROUTES.reportBuilder),
      }}
    >
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('features.reports.subtitle')}
      </Text>

      {reports.length === 0 ? (
        <EmptyState
          icon="document-text"
          title={t('features.reports.emptyTitle')}
          description={t('features.reports.emptyDesc')}
          actionLabel={t('features.reports.createReport')}
          onAction={() => router.push(APP_ROUTES.reportBuilder)}
        />
      ) : (
        <>
          <Button
            title={t('features.reports.createReport')}
            onPress={() => router.push(APP_ROUTES.reportBuilder)}
            icon="add"
            fullWidth
            style={{ marginBottom: theme.spacing.lg }}
          />
          {reports.map((report) => (
            <TouchableOpacity
              key={report.id}
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert(report.title, report.summary, [
                  { text: isRTL ? 'إغلاق' : 'Close' },
                  { text: isRTL ? 'تصدير' : 'Export', onPress: () => Alert.alert(isRTL ? 'تصدير' : 'Export', isRTL ? 'PDF/CSV قريباً' : 'PDF/CSV export coming soon') },
                ])
              }
            >
              <Card
              key={report.id}
              variant="elevated"
              padding="md"
              style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.xl }}
            >
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: theme.colors.primary + '18',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="document-text" size={22} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                  <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{report.title}</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                    {t(`features.reports.types.${report.type}`)} · {t(`features.reports.status.${report.status}`)}
                  </Text>
                </View>
                <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
              </View>
              {report.summary ? (
                <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]} numberOfLines={2}>
                  {report.summary}
                </Text>
              ) : null}
            </Card>
            </TouchableOpacity>
          ))}
        </>
      )}
    </FeatureScrollScreen>
  );
}

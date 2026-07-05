/**
 * SportMind AI - Reports Center
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/src/components/common/Button';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { reportStatusVariant } from '@/src/utils/moduleHelpers';

export default function ReportsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, chevronIcon, isRTL } = useDirection();
  const reports = useMockStore((s) => s.reports);

  const stats = useMemo(() => {
    const draft = reports.filter((r) => r.status === 'draft').length;
    const ready = reports.filter((r) => r.status === 'ready').length;
    const exported = reports.filter((r) => r.status === 'exported').length;
    return { total: reports.length, draft, ready, exported };
  }, [reports]);

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

      {reports.length > 0 && (
        <View style={{ flexDirection: flexRow(true), gap: theme.spacing.sm, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
          {[
            { label: t('features.reports.statsTotal'), value: stats.total, color: theme.colors.primary },
            { label: t('features.reports.status.draft'), value: stats.draft, color: theme.colors.warning },
            { label: t('features.reports.status.ready'), value: stats.ready, color: theme.colors.success },
            { label: t('features.reports.status.exported'), value: stats.exported, color: theme.colors.info },
          ].map((s) => (
            <Card key={s.label} variant="filled" padding="md" style={{ flex: 1, minWidth: 72, borderRadius: theme.borderRadius.xl }}>
              <Text style={[type.numberSm, { color: s.color }]}>{s.value}</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]} numberOfLines={1}>
                {s.label}
              </Text>
            </Card>
          ))}
        </View>
      )}

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
              onPress={() => router.push(APP_ROUTES.reportDetail(report.id))}
            >
              <Card variant="elevated" padding="md" style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius['2xl'], ...theme.shadows.sm }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: theme.borderRadius.xl,
                      backgroundColor: theme.colors.primary + '18',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="document-text" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                    <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]} numberOfLines={1}>
                      {report.title}
                    </Text>
                    <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                      <Badge label={t(`features.reports.types.${report.type}`)} variant="info" />
                      <Badge label={t(`features.reports.status.${report.status}`)} variant={reportStatusVariant(report.status)} />
                    </View>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
                      {new Date(report.created_at).toLocaleDateString(isRTL ? 'ar' : 'en')}
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

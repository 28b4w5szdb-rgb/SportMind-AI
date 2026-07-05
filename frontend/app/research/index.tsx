/**
 * SportMind AI - Research Assistant
 */

import React from 'react';
import { View, Text } from 'react-native';
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

export default function ResearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const research = useMockStore((s) => s.research);

  return (
    <FeatureScrollScreen
      title={t('features.research.title')}
      rightAction={{
        icon: 'add',
        onPress: () => router.push(APP_ROUTES.researchNew),
      }}
    >
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('features.research.subtitle')}
      </Text>

      {research.length === 0 ? (
        <EmptyState
          icon="book"
          title={t('features.research.emptyTitle')}
          description={t('features.research.emptyDesc')}
          actionLabel={t('features.research.newProject')}
          onAction={() => router.push(APP_ROUTES.researchNew)}
        />
      ) : (
        <>
          <Button
            title={t('features.research.newProject')}
            onPress={() => router.push(APP_ROUTES.researchNew)}
            icon="add"
            fullWidth
            style={{ marginBottom: theme.spacing.lg }}
          />
          {research.map((project) => (
            <Card key={project.id} variant="elevated" padding="lg" style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius['2xl'] }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
                <Ionicons name="flask" size={24} color={theme.colors.secondary} />
                <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                  <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{project.title}</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                    {t(`features.research.status.${project.status}`)}
                  </Text>
                  <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]} numberOfLines={2}>
                    {project.hypothesis}
                  </Text>
                  <View style={{ marginTop: theme.spacing.md, height: 6, backgroundColor: theme.colors.border, borderRadius: 3 }}>
                    <View style={{ width: `${project.progress}%`, height: 6, backgroundColor: theme.colors.primary, borderRadius: 3 }} />
                  </View>
                  <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                    {t('features.research.progress')}: {project.progress}%
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </>
      )}
    </FeatureScrollScreen>
  );
}

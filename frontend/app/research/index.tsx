/**
 * SportMind AI - Research Assistant
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/src/components/common/Button';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { researchStatusVariant } from '@/src/utils/moduleHelpers';

export default function ResearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, chevronIcon, isRTL } = useDirection();
  const research = useMockStore((s) => s.research);

  const stats = useMemo(() => {
    const planning = research.filter((p) => p.status === 'planning').length;
    const active = research.filter((p) => p.status === 'active').length;
    const completed = research.filter((p) => p.status === 'completed').length;
    const avgProgress =
      research.length > 0 ? Math.round(research.reduce((s, p) => s + p.progress, 0) / research.length) : 0;
    return { total: research.length, planning, active, completed, avgProgress };
  }, [research]);

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

      {research.length > 0 && (
        <Card variant="gradient" padding="lg" gradientColors={['#8B5CF6', '#6366F1']} style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg }}>
          <Text style={[type.overline, { color: 'rgba(255,255,255,0.85)' }]}>{t('features.research.dashboard')}</Text>
          <View style={{ flexDirection: flexRow(true), marginTop: theme.spacing.md, justifyContent: 'space-between' }}>
            <View>
              <Text style={[type.numberMedium, { color: '#FFF' }]}>{stats.total}</Text>
              <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)' }]}>{t('features.research.statsProjects')}</Text>
            </View>
            <View>
              <Text style={[type.numberMedium, { color: '#FFF' }]}>{stats.avgProgress}%</Text>
              <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)' }]}>{t('features.research.avgProgress')}</Text>
            </View>
            <View>
              <Text style={[type.numberMedium, { color: '#FFF' }]}>{stats.active}</Text>
              <Text style={[type.caption, { color: 'rgba(255,255,255,0.8)' }]}>{t('features.research.status.active')}</Text>
            </View>
          </View>
        </Card>
      )}

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
            <TouchableOpacity key={project.id} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.researchDetail(project.id))}>
              <Card variant="elevated" padding="lg" style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius['2xl'], ...theme.shadows.sm }}>
                <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
                  <LinearGradient colors={['#8B5CF6', '#6366F1']} style={{ width: 48, height: 48, borderRadius: theme.borderRadius.xl, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="flask" size={22} color="#FFF" />
                  </LinearGradient>
                  <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                    <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]} numberOfLines={2}>
                      {project.title}
                    </Text>
                    <View style={{ marginTop: 6 }}>
                      <Badge label={t(`features.research.status.${project.status}`)} variant={researchStatusVariant(project.status)} />
                    </View>
                    <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]} numberOfLines={2}>
                      {project.hypothesis}
                    </Text>
                    <View style={{ marginTop: theme.spacing.md, height: 6, backgroundColor: theme.colors.border, borderRadius: 3 }}>
                      <View style={{ width: `${project.progress}%`, height: 6, backgroundColor: theme.colors.secondary, borderRadius: 3 }} />
                    </View>
                    <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                      {t('features.research.progress')}: {project.progress}%
                    </Text>
                  </View>
                  <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </>
      )}
    </FeatureScrollScreen>
  );
}

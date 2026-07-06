import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { NutritionSnapshot } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from '@/src/features/athlete-workspace/components/WorkspaceSectionHeader';

interface WorkspaceNutritionSectionProps {
  athleteId: string;
  snapshot: NutritionSnapshot;
}

export function WorkspaceNutritionSection({ athleteId, snapshot }: WorkspaceNutritionSectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { totals, targets, hydration, compliancePercent, goalProgress, primaryRecommendation } = snapshot;

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader
        title={t('nutrition.workspaceTitle')}
        subtitle={t('nutrition.workspaceSubtitle')}
        action={
          <TouchableOpacity onPress={() => router.push(APP_ROUTES.nutritionCenter(athleteId))}>
            <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '600' }]}>{t('nutrition.open')}</Text>
          </TouchableOpacity>
        }
      />

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 140, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.calories')}</Text>
          <Text style={[type.h5, { color: theme.colors.text, marginTop: 4 }]}>
            {totals.calories}/{targets.calories}
          </Text>
        </Card>
        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 140, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.protein')}</Text>
          <Text style={[type.h5, { color: theme.colors.text, marginTop: 4 }]}>
            {totals.protein_g}/{targets.protein_g}g
          </Text>
        </Card>
        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 140, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.waterIntake')}</Text>
          <Text style={[type.h5, { color: theme.colors.text, marginTop: 4 }]}>
            {totals.water_liters}/{targets.water_liters}L
          </Text>
        </Card>
      </View>

      <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Ionicons name="nutrition" size={16} color="#F97316" />
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.goalProgress')}</Text>
          <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700' }]}>{goalProgress}%</Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary }]}>· {compliancePercent}% {t('nutrition.complianceShort')}</Text>
        </View>
        {primaryRecommendation ? (
          <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start') }]} numberOfLines={2}>
            {t(primaryRecommendation.titleKey)}
          </Text>
        ) : (
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('nutrition.allGood')}</Text>
        )}
        <TouchableOpacity onPress={() => router.push(APP_ROUTES.nutritionLog(athleteId))} style={{ marginTop: 8 }}>
          <Text style={[type.caption, { color: theme.colors.primary, fontWeight: '600' }]}>{t('nutrition.logToday')}</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

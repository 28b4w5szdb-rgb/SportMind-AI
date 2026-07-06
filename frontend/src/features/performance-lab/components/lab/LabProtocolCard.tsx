import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { TestDefinition } from '../../types';
import { getTestName, getTestText } from '../../utils/copyHelpers';
import { getTestProtocolMeta } from '../../utils/labPresentation';
import { getCategoryById } from '../../registry/categories';

interface LabProtocolCardProps {
  definition: TestDefinition;
  onPress: () => void;
  featured?: boolean;
}

export function LabProtocolCard({ definition, onPress, featured }: LabProtocolCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL, chevronIcon } = useDirection();
  const category = getCategoryById(definition.categoryId);
  const meta = getTestProtocolMeta(definition);
  const accent = category?.color ?? theme.colors.primary;

  const specs = [
    { icon: 'time-outline' as const, label: t(meta.durationKey) },
    { icon: 'fitness-outline' as const, label: t(meta.difficultyKey) },
    { icon: 'checkmark-done-outline' as const, label: t(meta.validityKey) },
    { icon: 'shield-checkmark-outline' as const, label: t(meta.reliabilityKey) },
  ];

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
      <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md, overflow: 'hidden', ...theme.shadows.md }}>
        <LinearGradient colors={[accent + '16', accent + '06']} style={{ padding: theme.spacing.lg }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
            <View style={{ width: 56, height: 56, borderRadius: theme.borderRadius.xl, backgroundColor: accent + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={definition.icon} size={28} color={accent} />
            </View>
            <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{getTestName(definition, isRTL)}</Text>
                {featured || definition.featured ? <Badge label={t('performanceLab.featured')} toneColor={accent} /> : null}
                <Badge label={t('testingCenter.analyticsBadge')} variant="info" />
              </View>
              <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 6, textAlign: textAlign('start') }]} numberOfLines={2}>
                {getTestText(definition, 'purpose', isRTL)}
              </Text>
            </View>
            <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
          </View>

          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8, marginTop: theme.spacing.md }}>
            {specs.map((spec) => (
              <View key={spec.icon} style={{ flexDirection: flexRow(true), alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: theme.colors.border }}>
                <Ionicons name={spec.icon} size={14} color={accent} />
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 6 }]}>{spec.label}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', marginTop: theme.spacing.md, paddingTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
            <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
              {t('testingCenter.sections.equipment')}: {getTestText(definition, 'equipment', isRTL).slice(0, 48)}…
            </Text>
            <Text style={[type.captionBold, { color: accent }]}>
              {t('testingCenter.retestInterval', { days: definition.retestIntervalDays })}
            </Text>
          </View>
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  );
}

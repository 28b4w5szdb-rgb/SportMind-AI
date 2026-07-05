import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const CATEGORIES = [
  { key: 'testing', icon: 'analytics' as const, color: '#0066FF', count: 2 },
  { key: 'training', icon: 'barbell' as const, color: '#10B981', count: 2 },
  { key: 'recovery', icon: 'bed' as const, color: '#8B5CF6', count: 2 },
  { key: 'nutrition', icon: 'restaurant' as const, color: '#F97316', count: 2 },
];

export default function KnowledgeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, chevronIcon, isRTL } = useDirection();

  return (
    <FeatureScrollScreen title={t('features.knowledge.title')}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('features.knowledge.subtitle')}
      </Text>

      <Text
        style={[
          type.overline,
          {
            color: theme.colors.textTertiary,
            letterSpacing: 1.5,
            marginBottom: theme.spacing.md,
            textAlign: textAlign('start'),
          },
        ]}
      >
        {(isRTL ? 'الفئات' : 'CATEGORIES').toUpperCase()}
      </Text>

      {CATEGORIES.map((cat) => (
        <TouchableOpacity key={cat.key} activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.knowledgeCategory(cat.key))}>
          <Card variant="elevated" padding="md" style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius['2xl'], ...theme.shadows.md }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
            <LinearGradient
              colors={[cat.color, cat.color + 'CC']}
              style={{ width: 48, height: 48, borderRadius: theme.borderRadius.xl, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name={cat.icon} size={24} color="#FFF" />
            </LinearGradient>
            <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
              <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                {t(`features.knowledge.categories.${cat.key}`)}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2, textAlign: textAlign('start') }]}>
                {cat.count} {isRTL ? 'مقالات' : 'articles'}
              </Text>
            </View>
            <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
          </View>
        </Card>
        </TouchableOpacity>
      ))}
    </FeatureScrollScreen>
  );
}

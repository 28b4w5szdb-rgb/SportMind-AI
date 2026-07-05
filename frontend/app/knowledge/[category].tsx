import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { KNOWLEDGE_ARTICLES } from '@/src/data/mock/lab';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const CATEGORY_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  testing: { icon: 'analytics', color: '#0066FF' },
  training: { icon: 'barbell', color: '#10B981' },
  recovery: { icon: 'bed', color: '#8B5CF6' },
  nutrition: { icon: 'restaurant', color: '#F97316' },
};

export default function KnowledgeCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const meta = CATEGORY_META[category ?? ''] ?? CATEGORY_META.testing;
  const articles = KNOWLEDGE_ARTICLES[category ?? ''] ?? [];

  return (
    <FeatureScrollScreen title={t(`features.knowledge.categories.${category ?? 'testing'}`)}>
      <Card variant="gradient" padding="lg" gradientColors={[meta.color, meta.color + 'AA']} style={{ marginBottom: theme.spacing.lg, borderRadius: theme.borderRadius['2xl'] }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <Ionicons name={meta.icon} size={28} color="#FFF" />
          <Text style={[type.body, { color: 'rgba(255,255,255,0.9)', flex: 1, marginHorizontal: theme.spacing.md, textAlign: textAlign('start') }]}>
            {articles.length} {isRTL ? 'مقالات' : 'articles'}
          </Text>
        </View>
      </Card>

      {articles.map((article) => (
        <TouchableOpacity key={article.id} activeOpacity={0.85}>
          <Card variant="elevated" padding="md" style={{ marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.xl, ...theme.shadows.sm }}>
            <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>
              {isRTL ? article.titleAr : article.titleEn}
            </Text>
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
              {article.readMin} {isRTL ? 'دقائق قراءة' : 'min read'}
            </Text>
          </Card>
        </TouchableOpacity>
      ))}
    </FeatureScrollScreen>
  );
}

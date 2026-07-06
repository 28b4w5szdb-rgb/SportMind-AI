import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { TestingCategoryDefinition } from '../types';

interface CategoryCardProps {
  category: TestingCategoryDefinition;
  testCount: number;
  index?: number;
  onPress: () => void;
}

export function CategoryCard({ category, testCount, index = 0, onPress }: CategoryCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL, chevronIcon } = useDirection();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 420, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 420, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, [fade, slide, index]);

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
        <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing[3], ...theme.shadows.md }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: theme.borderRadius['2xl'],
                backgroundColor: category.color + '18',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={category.icon} size={32} color={category.color} />
            </View>
            <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(category.nameKey)}</Text>
                <Badge label={t('testingCenter.analyticsBadge')} variant="info" />
              </View>
              <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 6, textAlign: textAlign('start') }]} numberOfLines={2}>
                {t(category.descriptionKey)}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 8, textAlign: textAlign('start') }]}>
                {testCount} {t('testingCenter.testsAvailable')}
              </Text>
            </View>
            <Ionicons name={chevronIcon()} size={20} color={theme.colors.textTertiary} />
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

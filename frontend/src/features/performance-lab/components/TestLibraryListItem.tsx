import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { getObjectiveLabelKey } from '../registry/objectives';
import { getTestName, getTestText } from '../utils/copyHelpers';
import type { TestDefinition } from '../types';

interface TestLibraryListItemProps {
  test: TestDefinition;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function TestLibraryListItem({ test, isFavorite, onPress, onToggleFavorite }: TestLibraryListItemProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress}>
      <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: theme.colors.primary + '14',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={test.icon} size={22} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]} numberOfLines={1}>
              {getTestName(test, isRTL)}
            </Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]} numberOfLines={2}>
              {getTestText(test, 'purpose', isRTL)}
            </Text>
            <View style={{ flexDirection: flexRow(true), gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              <Badge label={test.unit} variant="neutral" />
              <Badge label={isRTL ? 'تحليلات' : 'Analytics'} variant="info" />
            </View>
          </View>
          <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={22} color={isFavorite ? '#EAB308' : theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { APP_ROUTES } from '@/src/core/constants/routes';

interface TodayItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  meta: string;
  color: string;
  route: string;
}

interface DashboardTodayCenterProps {
  items: TodayItem[];
  isDesktop: boolean;
}

export function DashboardTodayCenter({ items, isDesktop }: DashboardTodayCenterProps) {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();

  return (
    <View>
      <SectionHeader title={t('dashboard.todayCenter')} subtitle={t('dashboard.todayCenterSub')} />
      <View style={{ flexDirection: isDesktop ? flexRow(true) : 'column', flexWrap: 'wrap', gap: theme.spacing[3] }}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={theme.tokens.interaction.activeOpacity}
            onPress={() => router.push(item.route as never)}
            style={{ flex: isDesktop ? 1 : undefined, minWidth: isDesktop ? 200 : undefined }}
          >
            <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius[theme.tokens.radius.card], minHeight: theme.layout.minTouchTarget * 2 }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: theme.spacing[3] }}>
                <View style={{ width: 44, height: 44, borderRadius: theme.borderRadius.lg, backgroundColor: item.color + '18', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[type.label, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{item.title}</Text>
                  <Text style={[type.body, { color: theme.colors.text, marginTop: theme.spacing[1], textAlign: textAlign('start') }]} numberOfLines={2}>
                    {item.value}
                  </Text>
                  <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing[1], textAlign: textAlign('start') }]} numberOfLines={2}>
                    {item.meta}
                  </Text>
                </View>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.colors.textTertiary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export type { TodayItem };

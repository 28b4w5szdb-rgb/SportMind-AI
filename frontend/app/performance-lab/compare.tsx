import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function LabCompareScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const [aId, setAId] = useState(athletes[0]?.id ?? '');
  const [bId, setBId] = useState(athletes[1]?.id ?? athletes[0]?.id ?? '');

  const comparison = useMemo(() => {
    const aTests = tests.filter((t) => t.athlete_id === aId);
    const bTests = tests.filter((t) => t.athlete_id === bId);
    const keys = [...new Set([...aTests, ...bTests].map((t) => t.test_type_key))];
    return keys.map((key) => {
      const at = aTests.find((t) => t.test_type_key === key);
      const bt = bTests.find((t) => t.test_type_key === key);
      return { key, label: at?.test_type ?? bt?.test_type ?? key, a: at, b: bt };
    });
  }, [aId, bId, tests]);

  const athleteA = athletes.find((a) => a.id === aId);
  const athleteB = athletes.find((a) => a.id === bId);

  return (
    <FeatureScrollScreen title={isRTL ? 'مقارنة اللاعبين' : 'Compare Athletes'}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {isRTL ? 'قارن نتائج الاختبارات بين لاعبين' : 'Compare test results side-by-side'}
      </Text>

      {[['A', aId, setAId] as const, ['B', bId, setBId] as const].map(([label, selectedId, setSelectedId]) => (
        <View key={label} style={{ marginBottom: theme.spacing.md }}>
          <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: 8, textAlign: textAlign('start') }]}>
            {isRTL ? `اللاعب ${label}` : `Athlete ${label}`}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {athletes.map((a) => (
              <TouchableOpacity
                key={`${label}-${a.id}`}
                onPress={() => setSelectedId(a.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: selectedId === a.id ? theme.colors.primary : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: selectedId === a.id ? theme.colors.primary : theme.colors.border,
                }}
              >
                <Text style={[type.bodySm, { color: selectedId === a.id ? '#FFF' : theme.colors.text }]}>
                  {a.first_name} {a.last_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}

      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginTop: theme.spacing.md }}>
        <View style={{ flexDirection: flexRow(true), marginBottom: theme.spacing.md }}>
          <Text style={[type.label, { flex: 1, color: theme.colors.text, textAlign: 'center' }]}>
            {athleteA ? `${athleteA.first_name}` : '—'}
          </Text>
          <Text style={[type.label, { flex: 1, color: theme.colors.text, textAlign: 'center' }]}>
            {isRTL ? 'الاختبار' : 'Test'}
          </Text>
          <Text style={[type.label, { flex: 1, color: theme.colors.text, textAlign: 'center' }]}>
            {athleteB ? `${athleteB.first_name}` : '—'}
          </Text>
        </View>
        {comparison.length === 0 ? (
          <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
            {isRTL ? 'لا توجد اختبارات للمقارنة — سجّل اختبارات أولاً' : 'No tests to compare — record tests first'}
          </Text>
        ) : (
          comparison.map((row) => (
            <View
              key={row.key}
              style={{
                flexDirection: flexRow(true),
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                alignItems: 'center',
              }}
            >
              <Text style={[type.numberSm, { flex: 1, color: theme.colors.primary, textAlign: 'center' }]}>
                {row.a ? `${row.a.value} ${row.a.unit}` : '—'}
              </Text>
              <Text style={[type.caption, { flex: 1, color: theme.colors.textSecondary, textAlign: 'center' }]}>
                {row.label}
              </Text>
              <Text style={[type.numberSm, { flex: 1, color: theme.colors.secondary, textAlign: 'center' }]}>
                {row.b ? `${row.b.value} ${row.b.unit}` : '—'}
              </Text>
            </View>
          ))
        )}
      </Card>
    </FeatureScrollScreen>
  );
}

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export default function LabCompareScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const [aId, setAId] = useState(athletes[0]?.id ?? '');
  const [bId, setBId] = useState(athletes[1]?.id ?? athletes[0]?.id ?? '');

  const comparison = useMemo(() => {
    const aTests = tests.filter((tst) => tst.athlete_id === aId);
    const bTests = tests.filter((tst) => tst.athlete_id === bId);
    const keys = [...new Set([...aTests, ...bTests].map((tst) => tst.test_type_key))];
    return keys.map((key) => {
      const at = aTests.find((tst) => tst.test_type_key === key);
      const bt = bTests.find((tst) => tst.test_type_key === key);
      return { key, label: at?.test_type ?? bt?.test_type ?? key, a: at, b: bt };
    });
  }, [aId, bId, tests]);

  const athleteA = athletes.find((a) => a.id === aId);
  const athleteB = athletes.find((a) => a.id === bId);

  return (
    <FeatureScrollScreen title={t('performanceLab.compareScreen.title')}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('performanceLab.compareScreen.subtitle')}
      </Text>

      {[
        { label: t('performanceLab.compareScreen.athleteA'), selectedId: aId, setSelectedId: setAId, key: 'a' },
        { label: t('performanceLab.compareScreen.athleteB'), selectedId: bId, setSelectedId: setBId, key: 'b' },
      ].map(({ label, selectedId, setSelectedId, key }) => (
        <View key={key} style={{ marginBottom: theme.spacing.md }}>
          <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: 8, textAlign: textAlign('start') }]}>{label}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {athletes.map((a) => (
              <TouchableOpacity
                key={`${key}-${a.id}`}
                onPress={() => setSelectedId(a.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: selectedId === a.id ? theme.colors.primary : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: selectedId === a.id ? theme.colors.primary : theme.colors.border,
                  minHeight: 44,
                  justifyContent: 'center',
                }}
              >
                <Text style={[type.bodySm, { color: selectedId === a.id ? '#FFF' : theme.colors.text, textAlign: textAlign('center') }]}>
                  {a.first_name} {a.last_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}

      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginTop: theme.spacing.md }}>
        <View style={{ flexDirection: flexRow(true), marginBottom: theme.spacing.md }}>
          <Text style={[type.label, { flex: 1, color: theme.colors.text, textAlign: textAlign('center') }]}>
            {athleteA ? `${athleteA.first_name}` : '—'}
          </Text>
          <Text style={[type.label, { flex: 1, color: theme.colors.text, textAlign: textAlign('center') }]}>
            {t('performanceLab.compareScreen.test')}
          </Text>
          <Text style={[type.label, { flex: 1, color: theme.colors.text, textAlign: textAlign('center') }]}>
            {athleteB ? `${athleteB.first_name}` : '—'}
          </Text>
        </View>
        {comparison.length === 0 ? (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('center') }]}>
            {t('performanceLab.compareScreen.noComparison')}
          </Text>
        ) : (
          comparison.map((row) => (
            <View key={row.key} style={{ flexDirection: flexRow(true), paddingVertical: 10, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
              <Text style={[type.bodySm, { flex: 1, color: theme.colors.text, textAlign: textAlign('center'), fontWeight: '700' }]}>
                {row.a ? `${row.a.value} ${row.a.unit}` : '—'}
              </Text>
              <Text style={[type.caption, { flex: 1, color: theme.colors.textSecondary, textAlign: textAlign('center') }]} numberOfLines={2}>
                {row.label}
              </Text>
              <Text style={[type.bodySm, { flex: 1, color: theme.colors.text, textAlign: textAlign('center'), fontWeight: '700' }]}>
                {row.b ? `${row.b.value} ${row.b.unit}` : '—'}
              </Text>
            </View>
          ))
        )}
      </Card>
    </FeatureScrollScreen>
  );
}

import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const FAQ = [
  { q: 'How do I add an athlete?', qAr: 'كيف أضيف لاعبًا؟', a: 'Go to Athletes tab and tap Add Athlete.', aAr: 'انتقل إلى تبويب اللاعبين واضغط إضافة لاعب.' },
  { q: 'How do I record a test?', qAr: 'كيف أسجل اختبارًا؟', a: 'Open Performance Lab → New Test.', aAr: 'افتح مختبر الأداء → اختبار جديد.' },
  { q: 'Is my data synced?', qAr: 'هل بياناتي متزامنة؟', a: 'Cloud sync will activate once Supabase is connected.', aAr: 'ستُفعّل المزامنة السحابية عند ربط Supabase.' },
];

export default function HelpScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  return (
    <FeatureScrollScreen title={t('features.help.title')}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('features.help.subtitle')}
      </Text>

      <Text style={[type.label, { color: theme.colors.textTertiary, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {t('features.help.faq')}
      </Text>
      {FAQ.map((item, i) => (
        <Card key={i} variant="outlined" padding="md" style={{ marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>
            {isRTL ? item.qAr : item.q}
          </Text>
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 6, textAlign: textAlign('start') }]}>
            {isRTL ? item.aAr : item.a}
          </Text>
        </Card>
      ))}

      <Card variant="elevated" padding="lg" style={{ marginTop: theme.spacing.lg, borderRadius: theme.borderRadius['2xl'] }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h5, { color: theme.colors.text }]}>{t('features.help.contact')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}>
              {t('features.help.email')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${t('features.help.email')}`)}>
            <Ionicons name="open-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </Card>
    </FeatureScrollScreen>
  );
}

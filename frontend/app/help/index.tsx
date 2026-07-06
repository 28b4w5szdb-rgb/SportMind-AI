import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const FAQ_KEYS = ['addAthlete', 'recordTest', 'dataSync'] as const;

function SectionLabel({ labelKey }: { labelKey: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  return (
    <Text
      style={[
        type.overline,
        {
          color: theme.colors.textTertiary,
          letterSpacing: 1.5,
          marginBottom: theme.spacing.sm,
          marginTop: theme.spacing.lg,
          textAlign: textAlign('start'),
        },
      ]}
    >
      {t(labelKey).toUpperCase()}
    </Text>
  );
}

export default function HelpScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const [expanded, setExpanded] = React.useState<number | null>(0);

  return (
    <FeatureScrollScreen title={t('features.help.title')}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
        {t('features.help.subtitle')}
      </Text>

      <SectionLabel labelKey="features.help.faq" />
      {FAQ_KEYS.map((key, i) => (
        <TouchableOpacity key={key} activeOpacity={0.85} onPress={() => setExpanded(expanded === i ? null : i)}>
          <Card variant="outlined" padding="md" style={{ marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.xl }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
              <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color={theme.colors.primary} />
              <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start'), flex: 1, marginHorizontal: theme.spacing.sm }]}>
                {t(`features.help.faqItems.${key}.question`)}
              </Text>
            </View>
            {expanded === i ? (
              <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 10, textAlign: textAlign('start'), paddingStart: 26 }]}>
                {t(`features.help.faqItems.${key}.answer`)}
              </Text>
            ) : null}
          </Card>
        </TouchableOpacity>
      ))}

      <SectionLabel labelKey="features.help.sectionResources" />
      <TouchableOpacity
        onPress={() => Alert.alert(t('features.help.docsAlertTitle'), t('features.help.docsAlertBody'))}
        activeOpacity={0.85}
      >
        <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="book-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
              <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('features.help.docs')}</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2, textAlign: textAlign('start') }]}>docs.sportmind.ai</Text>
            </View>
            <Ionicons name="open-outline" size={18} color={theme.colors.primary} />
          </View>
        </Card>
      </TouchableOpacity>

      <SectionLabel labelKey="features.help.sectionContact" />
      <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'] }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: theme.borderRadius.xl, backgroundColor: theme.colors.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('features.help.contact')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t('features.help.email')}</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert(t('features.help.contact'), t('features.help.email'))} accessibilityLabel={t('features.help.contact')}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </Card>
    </FeatureScrollScreen>
  );
}

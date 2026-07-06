import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { FormSection } from '@/src/components/common/FormSection';
import type { TestDefinition } from '../../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { getTestText } from '../../utils/copyHelpers';
import { getTestProtocolMeta } from '../../utils/labPresentation';

interface LabKnowledgePremiumPanelProps {
  definition: TestDefinition;
}

function KnowledgeBlock({ icon, labelKey, body }: { icon: keyof typeof Ionicons.glyphMap; labelKey: string; body: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start' }}>
        <Ionicons name={icon} size={18} color={theme.colors.primary} style={{ marginTop: 2 }} />
        <View style={{ flex: 1, marginStart: theme.spacing.sm }}>
          <Text style={[type.label, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(labelKey)}</Text>
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 6, textAlign: textAlign('start'), lineHeight: 22 }]}>
            {body}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export function LabKnowledgePremiumPanel({ definition }: LabKnowledgePremiumPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { isRTL } = useDirection();
  const k = definition.knowledge;
  const pick = (text: { en: string; ar: string }) => (isRTL ? text.ar : text.en);
  const meta = getTestProtocolMeta(definition);

  const blocks = [
    { icon: 'document-text-outline' as const, labelKey: 'testingCenter.sections.protocol', body: getTestText(definition, 'protocol', isRTL) },
    { icon: 'walk-outline' as const, labelKey: 'testingCenter.knowledge.howPerformed', body: pick(k.howPerformed) },
    { icon: 'construct-outline' as const, labelKey: 'testingCenter.sections.equipment', body: getTestText(definition, 'equipment', isRTL) },
    { icon: 'calculator-outline' as const, labelKey: 'testingCenter.sections.scoring', body: getTestText(definition, 'scoring', isRTL) },
    { icon: 'bulb-outline' as const, labelKey: 'performanceLab.knowledge.applications', body: getTestText(definition, 'interpretation', isRTL) },
    { icon: 'checkmark-circle-outline' as const, labelKey: 'performanceLab.knowledge.advantages', body: pick(k.whyImportant) },
    { icon: 'alert-circle-outline' as const, labelKey: 'performanceLab.knowledge.limitations', body: pick(k.commonMistakes) },
    { icon: 'library-outline' as const, labelKey: 'performanceLab.knowledge.research', body: getTestText(definition, 'aiRec', isRTL) },
  ];

  return (
    <FormSection title={t('testingCenter.knowledgeTitle')} subtitle={t('testingCenter.knowledgeSubtitle')}>
      {blocks.map((block) => (
        <KnowledgeBlock key={block.labelKey} icon={block.icon} labelKey={block.labelKey} body={block.body} />
      ))}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: theme.spacing.sm }}>
        <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
          {t('testingCenter.retestInterval', { days: definition.retestIntervalDays })} · {t(meta.validityKey)} · {t(meta.reliabilityKey)}
        </Text>
      </View>
    </FormSection>
  );
}

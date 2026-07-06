import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@/src/components/common/FormSection';
import type { TestDefinition } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface TestKnowledgePanelProps {
  definition: TestDefinition;
}

function KnowledgeRow({ labelKey, body }: { labelKey: string; body: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[type.caption, { color: theme.colors.textTertiary, textTransform: 'uppercase', textAlign: textAlign('start') }]}>
        {t(labelKey)}
      </Text>
      <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start'), lineHeight: 20 }]}>
        {body}
      </Text>
    </View>
  );
}

export function TestKnowledgePanel({ definition }: TestKnowledgePanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign, isRTL } = useDirection();
  const k = definition.knowledge;
  const pick = (text: { en: string; ar: string }) => (isRTL ? text.ar : text.en);

  return (
    <FormSection title={t('testingCenter.knowledgeTitle')} subtitle={t('testingCenter.knowledgeSubtitle')}>
      <KnowledgeRow labelKey="testingCenter.knowledge.whatMeasures" body={pick(k.whatMeasures)} />
      <KnowledgeRow labelKey="testingCenter.knowledge.whyImportant" body={pick(k.whyImportant)} />
      <KnowledgeRow labelKey="testingCenter.knowledge.howPerformed" body={pick(k.howPerformed)} />
      <KnowledgeRow labelKey="testingCenter.knowledge.whatAffects" body={pick(k.whatAffects)} />
      <KnowledgeRow labelKey="testingCenter.knowledge.commonMistakes" body={pick(k.commonMistakes)} />
      <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 8, textAlign: textAlign('start') }]}>
        {t('testingCenter.retestInterval', { days: definition.retestIntervalDays })}
      </Text>
    </FormSection>
  );
}

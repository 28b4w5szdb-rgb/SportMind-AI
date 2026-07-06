import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@/src/components/common/FormSection';
import type { SsidDisplayEntry } from '../engine/ssidEngine';
import { SsidInterpretationView } from './SsidInterpretationView';

interface SsidBundleSectionProps {
  entries: SsidDisplayEntry[];
  compact?: boolean;
}

export function SsidBundleSection({ entries, compact }: SsidBundleSectionProps) {
  const { t } = useTranslation();

  if (entries.length === 0) return null;

  return (
    <FormSection title={t('ssid.ui.sectionTitle')} subtitle={t('ssid.ui.sectionSubtitle')}>
      {entries.map((entry) => (
        <View key={entry.id} style={{ marginBottom: 8 }}>
          <SsidInterpretationView interpretation={entry.interpretation} titleKey={entry.labelKey} compact={compact} />
        </View>
      ))}
    </FormSection>
  );
}

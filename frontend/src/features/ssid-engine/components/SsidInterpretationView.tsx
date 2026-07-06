import React from 'react';
import { View } from 'react-native';

import type { SsidInterpretation } from '../types';
import { ScientificResultCard } from './ScientificResultCard';
import { InterpretationPanel } from './InterpretationPanel';
import { CoachingDecisionCard } from './CoachingDecisionCard';
import { RecommendationStack } from './RecommendationStack';
import { ReferenceConfidenceFooter } from './ReferenceConfidenceFooter';

interface SsidInterpretationViewProps {
  interpretation: SsidInterpretation;
  titleKey?: string;
  compact?: boolean;
}

/** Full SSID presentation for a single metric interpretation. */
export function SsidInterpretationView({ interpretation, titleKey, compact }: SsidInterpretationViewProps) {
  if (compact) {
    return (
      <View>
        <ScientificResultCard interpretation={interpretation} titleKey={titleKey} />
        <CoachingDecisionCard interpretation={interpretation} />
        <ReferenceConfidenceFooter interpretation={interpretation} />
      </View>
    );
  }

  return (
    <View>
      <ScientificResultCard interpretation={interpretation} titleKey={titleKey} />
      <InterpretationPanel interpretation={interpretation} />
      <CoachingDecisionCard interpretation={interpretation} />
      <RecommendationStack interpretation={interpretation} />
      <ReferenceConfidenceFooter interpretation={interpretation} />
    </View>
  );
}

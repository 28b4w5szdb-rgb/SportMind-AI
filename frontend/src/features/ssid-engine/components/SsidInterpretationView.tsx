import React from 'react';
import { View } from 'react-native';

import type { SsidInterpretation } from '../types';
import type { HrZoneRange } from '../utils/hrZoneHelpers';
import type { SsidInputRow } from './ScientificResultCard';
import { ScientificResultCard } from './ScientificResultCard';
import { InterpretationPanel } from './InterpretationPanel';
import { CoachingDecisionCard } from './CoachingDecisionCard';
import { RecommendationStack } from './RecommendationStack';
import { ReferenceConfidenceFooter } from './ReferenceConfidenceFooter';
import { HrZonesGuide } from './HrZonesGuide';

interface SsidInterpretationViewProps {
  interpretation: SsidInterpretation;
  titleKey?: string;
  titleOverride?: string;
  compact?: boolean;
  inputs?: SsidInputRow[];
  hrZones?: { maxHr: number; zones: HrZoneRange[] };
}

/** Full SSID presentation for a single metric interpretation. */
export function SsidInterpretationView({ interpretation, titleKey, titleOverride, compact, inputs, hrZones }: SsidInterpretationViewProps) {
  if (compact) {
    return (
      <View>
        <ScientificResultCard interpretation={interpretation} titleKey={titleKey} titleOverride={titleOverride} inputs={inputs} />
        <CoachingDecisionCard interpretation={interpretation} />
        <ReferenceConfidenceFooter interpretation={interpretation} />
      </View>
    );
  }

  return (
    <View>
      {hrZones ? (
        <HrZonesGuide maxHr={hrZones.maxHr} zones={hrZones.zones} activeZoneId={interpretation.classificationId} />
      ) : null}
      <ScientificResultCard interpretation={interpretation} titleKey={titleKey} titleOverride={titleOverride} inputs={inputs} />
      <InterpretationPanel interpretation={interpretation} />
      <CoachingDecisionCard interpretation={interpretation} />
      <RecommendationStack interpretation={interpretation} />
      <ReferenceConfidenceFooter interpretation={interpretation} />
    </View>
  );
}

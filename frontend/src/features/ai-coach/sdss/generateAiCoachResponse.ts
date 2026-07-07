/**
 * AI Coach response router — SSDI for athlete context, legacy mock for team scope (Phase 9.0).
 */

import { generateMockResponse, type AiAgentId, type AnalyticsCoachContext } from '@/src/data/mock/ai-coach';
import type { MockAthlete } from '@/src/data/mock/types';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import type { MockResponseResult } from '../types';
import type { ScientificRecommendation } from '@/src/cloud/scientific/sdss/models/SdssRecommendation';

import { generateSdssCoachResponse } from './generateSdssCoachResponse';
import { mapSdssBundleToPlainText, mapSdssBundleToStructuredResponse } from './mapSdssToStructuredResponse';

export interface GenerateAiCoachResponseInput {
  agent: AiAgentId;
  userQuery: string;
  isRTL: boolean;
  analyticsContext: AnalyticsCoachContext | undefined;
  translate: (key: string) => string;
  athlete?: MockAthlete | null;
  athleteTests?: MockPerformanceTest[];
  useSdss?: boolean;
}

export interface AiCoachResponseResult extends MockResponseResult {
  sdssRecommendations?: ScientificRecommendation[];
}

/** Generate coach response — SSDI when athlete analytics available, else mock fallback. */
export async function generateAiCoachResponse(
  input: GenerateAiCoachResponseInput
): Promise<AiCoachResponseResult> {
  const locale = input.isRTL ? 'ar' : 'en';
  const canUseSdss = input.useSdss !== false && Boolean(input.analyticsContext?.primary);

  if (!canUseSdss) {
    return generateMockResponse(
      input.agent,
      input.userQuery,
      input.isRTL,
      input.analyticsContext,
      input.translate
    );
  }

  try {
    const sdss = await generateSdssCoachResponse({
      userQuery: input.userQuery,
      athlete: input.athlete ?? null,
      analyticsContext: input.analyticsContext,
      locale,
      tests: input.athleteTests,
    });

    return {
      content: mapSdssBundleToPlainText(sdss.bundle),
      structured: mapSdssBundleToStructuredResponse(sdss.bundle),
      sdssRecommendations: sdss.bundle.recommendations,
    };
  } catch {
    return generateMockResponse(
      input.agent,
      input.userQuery,
      input.isRTL,
      input.analyticsContext,
      input.translate
    );
  }
}

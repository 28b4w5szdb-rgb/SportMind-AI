/**
 * Mock AI provider — deterministic SSDI responses without live API (Phase 9.0).
 */

import type { AiProvider, AiProviderRequest, AiProviderResponse } from './aiProviderContract';
import { buildRecommendationsFromContext } from '../engine/recommendationBuilder';
import { applySafetyToRecommendations, checkQuerySafety } from '../safety/safetyLayer';

export class MockAiProvider implements AiProvider {
  readonly id = 'mock' as const;

  isAvailable(): boolean {
    return true;
  }

  async generate(request: AiProviderRequest): Promise<AiProviderResponse> {
    const start = Date.now();
    const { context, user_query: userQuery } = request;

    const safety = checkQuerySafety(userQuery, context.locale);
    let bundle = buildRecommendationsFromContext(context, userQuery, this.id);

    if (!safety.safe) {
      const isAr = context.locale === 'ar';
      bundle = {
        ...bundle,
        recommendations: bundle.recommendations.map((r) => ({
          ...r,
          priority: 'low' as const,
          recommended_action: isAr
            ? 'اطلب مراجعة طبية — هذا النظام لا يقدم تشخيصاً.'
            : 'Seek clinical review — this system does not provide diagnosis.',
          disclaimer: safety.disclaimer,
        })),
      };
    }

    bundle = {
      ...bundle,
      recommendations: applySafetyToRecommendations(
        bundle.recommendations,
        context.viewer_role,
        context.locale
      ),
      safety_disclaimer: safety.disclaimer,
    };

    const rawText = bundle.recommendations
      .map(
        (r) =>
          `[${r.category}] ${r.title}\n${r.summary}\nAction: ${r.recommended_action}\nWhy: ${r.explainability.why}\nConfidence: ${r.confidence}`
      )
      .join('\n\n');

    return {
      provider_id: this.id,
      raw_text: rawText,
      recommendations: bundle,
      latency_ms: Date.now() - start,
    };
  }
}

let mockProviderSingleton: MockAiProvider | null = null;

export function getMockAiProvider(): MockAiProvider {
  if (!mockProviderSingleton) mockProviderSingleton = new MockAiProvider();
  return mockProviderSingleton;
}

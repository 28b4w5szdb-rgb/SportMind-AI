/** SSID locale templates for performance tests by category × performance level. */
import type { TestCategoryId } from '@/src/features/performance-lab/types';

type Level = 'elite' | 'good' | 'average' | 'below';

function band(level: Level, texts: {
  classification: string;
  meaning: string;
  physiology: string;
  performance: string;
  risk: string;
  reference: string;
  ai: string;
  immediate: string;
  weekly: string;
  longTerm: string;
}) {
  return {
    classifications: { [level]: texts.classification },
    meanings: { [level]: texts.meaning },
    physiology: { [level]: texts.physiology },
    performance: { [level]: texts.performance },
    risk: { [level]: texts.risk },
    reference: { [level]: texts.reference },
    ai: { [level]: texts.ai },
    recs: { [level]: { immediate: texts.immediate, weekly: texts.weekly, longTerm: texts.longTerm } },
  };
}

function mergeParts(...parts: ReturnType<typeof band>[]) {
  return parts.reduce(
    (acc, part) => ({
      classifications: { ...acc.classifications, ...part.classifications },
      meanings: { ...acc.meanings, ...part.meanings },
      physiology: { ...acc.physiology, ...part.physiology },
      performance: { ...acc.performance, ...part.performance },
      risk: { ...acc.risk, ...part.risk },
      reference: { ...acc.reference, ...part.reference },
      ai: { ...acc.ai, ...part.ai },
      recs: { ...acc.recs, ...part.recs },
    }),
    { classifications: {}, meanings: {}, physiology: {}, performance: {}, risk: {}, reference: {}, ai: {}, recs: {} } as ReturnType<typeof band>
  );
}

function buildCategoryTemplate(categoryLabel: string, higherIsBetter: boolean) {
  const cmp = higherIsBetter ? 'above' : 'below';
  return {
    referenceLabel: `${categoryLabel} reference norms (profile-adjusted)`,
    ...mergeParts(
      band('elite', {
        classification: 'Elite',
        meaning: `${categoryLabel} is in the elite band versus reference norms for age, gender, sport, and competition level.`,
        physiology: 'Favourable neuromuscular and metabolic profile for this quality.',
        performance: 'Supports high match demands and quality training progression.',
        risk: 'Low performance limiter; monitor load to avoid overreach.',
        reference: `Result ${cmp} elite reference threshold.`,
        ai: 'Maintain quality work; retest per protocol interval.',
        immediate: 'Proceed with planned session if readiness supports it.',
        weekly: 'Track trend; adjust programming if declining >3%.',
        longTerm: 'Use as benchmark for periodization and monitoring.',
      }),
      band('good', {
        classification: 'Good',
        meaning: `${categoryLabel} is good — competitive for the athlete profile with targeted improvement potential.`,
        physiology: 'Adequate capacity for the current training phase.',
        performance: 'Compatible with team training and match preparation.',
        risk: 'Low to moderate depending on fatigue management.',
        reference: 'Between good and elite reference values.',
        ai: 'Continue structured development for this quality.',
        immediate: 'Train as programmed with standard monitoring.',
        weekly: 'Add one targeted session if progress has plateaued.',
        longTerm: 'Retest after suggested interval to confirm adaptation.',
      }),
      band('average', {
        classification: 'Average',
        meaning: `${categoryLabel} is average — functional but not a relative strength.`,
        physiology: 'May reflect incomplete adaptation or suboptimal recovery.',
        performance: 'Could limit peak output in demanding scenarios.',
        risk: 'Moderate — avoid load spikes while addressing the limiter.',
        reference: 'Near average reference for athlete profile.',
        ai: 'Introduce a focused mesocycle for this quality.',
        immediate: 'Emphasize technique; cap maximal volume if fatigued.',
        weekly: 'Two targeted exposures per week with adequate recovery.',
        longTerm: 'Review nutrition, sleep, and S&C programme alignment.',
      }),
      band('below', {
        classification: 'Below Average',
        meaning: `${categoryLabel} is below reference — a clear limiter requiring intervention.`,
        physiology: 'Insufficient capacity or recovery likely contributing.',
        performance: 'Likely impacts match performance and training tolerance.',
        risk: 'Elevated underperformance or injury risk if load is not adjusted.',
        reference: `Below average reference threshold (${cmp} expected direction).`,
        ai: 'Reduce competing load 15–20%; prioritize corrective work.',
        immediate: 'Avoid repeated maximal trials; focus on fundamentals.',
        weekly: 'Staff review of programme, wellness, and injury history.',
        longTerm: 'Structured remediation block with monthly retest.',
      })
    ),
  };
}

const CATEGORY_LABELS: Record<TestCategoryId, { label: string; higherIsBetter: boolean }> = {
  speed: { label: 'Speed / sprint', higherIsBetter: false },
  strength: { label: 'Strength', higherIsBetter: true },
  endurance: { label: 'Endurance / aerobic capacity', higherIsBetter: true },
  agility: { label: 'Agility / change of direction', higherIsBetter: false },
  power: { label: 'Power / explosiveness', higherIsBetter: true },
  flexibility: { label: 'Flexibility / mobility', higherIsBetter: true },
  balance: { label: 'Balance / stability', higherIsBetter: true },
  body_composition: { label: 'Body composition', higherIsBetter: false },
  reaction_time: { label: 'Reaction time', higherIsBetter: false },
  neuromuscular: { label: 'Neuromuscular function', higherIsBetter: true },
  functional_movement: { label: 'Functional movement quality', higherIsBetter: true },
  custom: { label: 'Custom assessment', higherIsBetter: true },
};

export const testTemplatesEn = Object.fromEntries(
  (Object.keys(CATEGORY_LABELS) as TestCategoryId[]).map((id) => {
    const { label, higherIsBetter } = CATEGORY_LABELS[id];
    return [id, buildCategoryTemplate(label, higherIsBetter)];
  })
) as Record<TestCategoryId, ReturnType<typeof buildCategoryTemplate>>;

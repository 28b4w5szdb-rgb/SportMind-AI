/**
 * Universal Assessment Session Engine — Raw → Derived → Interpretation.
 *
 * The only future pathway for recording scientific assessments.
 * No UI, AI, reports, or direct Firestore access from engines — persistence via gateway (Phase 6C.8).
 */

import type { CatalogAssessmentDefinition } from '../models/catalog/AssessmentDefinition';
import type {
  AssessmentSession,
  AssessmentSessionSnapshot,
  AssessmentSessionSummary,
  CalculatedMetric,
  CreateAssessmentSessionInput,
  NormativeComparisonSnapshot,
  RawMeasurement,
  RawMeasurementInput,
  SessionNormativeContext,
} from '../models/session';
import type { ValidationResult } from '../models/common';
import type { AssessmentSessionRepository } from '../repositories/contracts/AssessmentSessionRepository';
import type { ScientificCatalogRepository } from '../repositories/contracts/CatalogRepository';
import {
  validateAssessmentSession,
  validateRequiredInputsCompleted,
  validateSessionSnapshotIntegrity,
} from '../validation/sessionValidators';
import type { ScientificPersistenceGateway } from '../persistence/scientificPersistenceGateway';
import {
  createNormativeReferenceEngine,
  type NormativeLookupParams,
  type NormativeReferenceEngine,
} from './normativeReferenceEngine';
import {
  createScientificCalculationEngine,
  type ScientificCalculationEngine,
} from './scientificCalculationEngine';
import {
  createSsidInterpretationEngine,
  type SsidInterpretationEngine,
} from './ssidInterpretationEngine';
import { SSID_RULE_VERSION } from '../models/interpretation/ScientificInterpretation';
import type { CalculationInputValue } from '../models/calculation/ScientificCalculation';
import { getFormulaDefinitionByKey } from '../seed/calculationFormulaRegistry';


export interface AssessmentSessionEngineDependencies {
  catalog: ScientificCatalogRepository;
  sessions: AssessmentSessionRepository;
  normative?: NormativeReferenceEngine;
  calculation?: ScientificCalculationEngine;
  ssid?: SsidInterpretationEngine;
  persistence?: ScientificPersistenceGateway;
}

export interface CompareSessionParams extends NormativeLookupParams {
  value: number;
  metricKey?: string;
}

function sessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function measurementId(): string {
  return `meas_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeRawMeasurements(inputs: RawMeasurementInput[] = []): RawMeasurement[] {
  return inputs.map((input, index) => ({
    measurement_id: input.measurement_id ?? measurementId(),
    trial: input.trial ?? index + 1,
    metric_key: input.metric_key,
    value: input.value,
    unit: input.unit,
    device_reference: input.device_reference ?? null,
    quality_flag: input.quality_flag ?? 'ok',
    captured_at: input.captured_at ?? new Date().toISOString(),
  }));
}

function toNormativeLookupParams(
  params: Partial<NormativeLookupParams> | SessionNormativeContext
): Omit<NormativeLookupParams, 'assessmentDefinitionKey' | 'value'> {
  const competitionLevel =
    'competitionLevel' in params
      ? params.competitionLevel ?? null
      : 'competition_level' in params
        ? params.competition_level ?? null
        : null;

  return {
    sport: params.sport ?? null,
    age: params.age ?? null,
    sex: params.sex ?? null,
    position: params.position ?? null,
    competitionLevel,
  };
}

function emptyNormativeSnapshot(): NormativeComparisonSnapshot {
  return {
    profile_key: null,
    performance_band: null,
    percentile: null,
    z_score: null,
    confidence: null,
    source_quality: null,
    classification: null,
    reason: null,
    recommendation: null,
  };
}

function requiredInputKeys(definition: CatalogAssessmentDefinition): string[] {
  return definition.required_inputs.filter((field) => field.required).map((field) => field.key);
}

function selectPrimaryMeasurement(
  session: AssessmentSession,
  definition: CatalogAssessmentDefinition
): RawMeasurement | null {
  const valid = session.raw_measurements.filter((m) => m.quality_flag !== 'invalid');
  if (valid.length === 0) return null;

  const primaryKey = definition.calculated_metric_keys[0] ?? 'primary_value';
  const candidates = valid.filter((m) => m.metric_key === primaryKey);
  const pool = candidates.length > 0 ? candidates : valid;

  return pool.reduce((best, current) => {
    if (!best) return current;
    if (definition.lower_is_better) {
      return current.value < best.value ? current : best;
    }
    return current.value > best.value ? current : best;
  });
}

export class AssessmentSessionEngine {
  private readonly normative: NormativeReferenceEngine;
  private readonly calculation: ScientificCalculationEngine;
  private readonly ssid?: SsidInterpretationEngine;
  private readonly persistence?: ScientificPersistenceGateway;

  constructor(private readonly deps: AssessmentSessionEngineDependencies) {
    this.normative = deps.normative ?? createNormativeReferenceEngine(deps.catalog);
    this.calculation =
      deps.calculation ?? createScientificCalculationEngine(deps.catalog);
    this.ssid = deps.ssid;
    this.persistence = deps.persistence;
  }

  async createAssessmentSession(input: CreateAssessmentSessionInput): Promise<AssessmentSession> {
    const definition = await this.deps.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(
      input.assessment_definition_key
    );
    if (!definition) {
      throw new Error(`assessment_definition_not_found:${input.assessment_definition_key}`);
    }

    const protocol = await this.deps.catalog.assessmentDefinitions.getProtocolVersion(
      definition.id,
      definition.current_protocol_version_id
    );
    if (!protocol) {
      throw new Error(`protocol_version_not_found:${definition.current_protocol_version_id}`);
    }

    if (!definition.allowed_source_types.includes(input.source_type)) {
      throw new Error(`invalid_source_type:${input.source_type}`);
    }

    const now = input.conducted_at ?? new Date().toISOString();
    const id = sessionId();
    const rawMeasurements = normalizeRawMeasurements(input.raw_measurements);

    const session: AssessmentSession = {
      id,
      session_id: id,
      created_at: now,
      updated_at: now,
      athlete_id: input.athlete_id,
      organization_id: input.organization_id,
      team_id: input.team_id ?? null,
      season_id: input.season_id ?? null,
      assessment_definition_id: definition.id,
      assessment_definition_key: definition.key,
      protocol_version: protocol.version,
      evidence_tier_snapshot: definition.evidence_tier,
      conducted_at: now,
      conducted_by: input.conducted_by,
      source_type: input.source_type,
      session_context: input.session_context ?? {},
      status: 'draft',
      raw_measurements: rawMeasurements,
      calculated_metrics: [],
      normative_comparison: emptyNormativeSnapshot(),
      interpretation: {
        status: 'pending',
        interpretation_version: null,
        generated: false,
        reviewed: false,
      },
      protocol_snapshot: {
        protocol_version: protocol.version,
        equipment_requirements: protocol.equipment_requirements,
        evidence_tier: definition.evidence_tier,
        contraindications: definition.contraindications,
      },
    };

    const withDerived = await this.calculateDerivedMetrics(session, definition);
    const metaValidation = validateAssessmentSession(withDerived);
    if (!metaValidation.valid) {
      throw new Error(`session_metadata_invalid:${metaValidation.errors.join(';')}`);
    }

    const compared = await this.compareWithNormativeReference(
      withDerived,
      definition,
      input.normative_context
        ? {
            sport: input.normative_context.sport,
            age: input.normative_context.age,
            sex: input.normative_context.sex,
            position: input.normative_context.position,
            competitionLevel: input.normative_context.competition_level,
          }
        : {}
    );
    compared.status = withDerived.raw_measurements.length > 0 ? 'validated' : 'draft';
    compared.updated_at = new Date().toISOString();

    const withInterpretation = this.ssid
      ? await this.generateScientificInterpretation(compared, definition)
      : compared;

    if (this.persistence) {
      await this.persistence.persist(withInterpretation);
      return withInterpretation;
    }

    return withInterpretation;
  }

  async generateScientificInterpretation(
    session: AssessmentSession,
    definition?: CatalogAssessmentDefinition | null
  ): Promise<AssessmentSession> {
    if (!this.ssid) return session;

    const resolvedDefinition =
      definition ??
      (await this.deps.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(
        session.assessment_definition_key
      ));
    if (!resolvedDefinition) return session;

    const payload = await this.ssid.generateInterpretation(session, resolvedDefinition);
    if (!payload) return session;

    return {
      ...session,
      interpretation: {
        status: 'ready',
        interpretation_version: SSID_RULE_VERSION,
        generated: true,
        reviewed: false,
        payload,
      },
      updated_at: new Date().toISOString(),
    };
  }

  async validateAssessmentSession(
    session: AssessmentSession,
    definition?: CatalogAssessmentDefinition | null
  ): Promise<ValidationResult> {
    const resolvedDefinition =
      definition ??
      (await this.deps.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(
        session.assessment_definition_key
      ));

    if (!resolvedDefinition) {
      return { valid: false, errors: ['assessment_definition_not_found'] };
    }

    const protocol = await this.deps.catalog.assessmentDefinitions.getProtocolVersion(
      resolvedDefinition.id,
      resolvedDefinition.current_protocol_version_id
    );
    if (!protocol) {
      return { valid: false, errors: ['protocol_version_not_found'] };
    }

    const base = validateAssessmentSession(session);
    const required = validateRequiredInputsCompleted(
      session,
      requiredInputKeys(resolvedDefinition)
    );

    const unitErrors: string[] = [];
    for (const measurement of session.raw_measurements) {
      const field = resolvedDefinition.required_inputs.find((f) => f.key === measurement.metric_key);
      if (field?.unit && field.unit !== measurement.unit) {
        unitErrors.push(`unit mismatch for ${measurement.metric_key}`);
      }
    }

    return {
      valid: base.valid && required.valid && unitErrors.length === 0,
      errors: [...base.errors, ...required.errors, ...unitErrors],
    };
  }

  async calculateDerivedMetrics(
    session: AssessmentSession,
    definition?: CatalogAssessmentDefinition | null
  ): Promise<AssessmentSession> {
    const resolvedDefinition =
      definition ??
      (await this.deps.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(
        session.assessment_definition_key
      ));
    if (!resolvedDefinition) return session;

    const primary = selectPrimaryMeasurement(session, resolvedDefinition);
    const calculated: CalculatedMetric[] = [];
    const workingInputs = new Map<string, CalculationInputValue>();

    for (const measurement of session.raw_measurements) {
      if (measurement.quality_flag !== 'invalid') {
        workingInputs.set(measurement.metric_key, {
          value: measurement.value,
          unit: measurement.unit,
        });
      }
    }

    if (primary) {
      calculated.push({
        metric_key: primary.metric_key,
        value: primary.value,
        unit: primary.unit,
        formula_version: null,
        calculation_source: 'aggregate',
      });
    }

    for (const formulaKey of resolvedDefinition.formula_reference_keys) {
      const formulaDef = getFormulaDefinitionByKey(formulaKey);
      if (!formulaDef) continue;

      const inputs: Record<string, CalculationInputValue> = {};
      for (const field of [...formulaDef.required_inputs, ...formulaDef.optional_inputs]) {
        const value = workingInputs.get(field.key);
        if (value) inputs[field.key] = value;
      }

      const result = await this.calculation.calculate(formulaKey, inputs);
      if (result.calculation_status === 'error') continue;

      calculated.push({
        metric_key: result.metric_key,
        value: result.value,
        unit: result.unit,
        formula_version: result.formula_version,
        calculation_source: 'formula',
      });
      workingInputs.set(result.metric_key, { value: result.value, unit: result.unit });
    }

    for (const output of resolvedDefinition.calculated_outputs) {
      if (calculated.some((metric) => metric.metric_key === output.key)) continue;
      const fromWorking = workingInputs.get(output.key);
      if (!fromWorking) continue;
      calculated.push({
        metric_key: output.key,
        value: fromWorking.value,
        unit: fromWorking.unit ?? output.unit,
        formula_version: output.formula_key ?? null,
        calculation_source: output.formula_key ? 'formula' : 'manual',
      });
    }

    return {
      ...session,
      calculated_metrics: calculated,
      updated_at: new Date().toISOString(),
    };
  }

  async compareWithNormativeReference(
    session: AssessmentSession,
    definition?: CatalogAssessmentDefinition | null,
    params: Partial<NormativeLookupParams> | SessionNormativeContext = {}
  ): Promise<AssessmentSession> {
    const resolvedDefinition =
      definition ??
      (await this.deps.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(
        session.assessment_definition_key
      ));
    if (!resolvedDefinition) return session;

    const primaryMetric =
      session.calculated_metrics[0] ?? selectPrimaryMeasurement(session, resolvedDefinition);
    if (!primaryMetric) {
      return {
        ...session,
        normative_comparison: {
          ...emptyNormativeSnapshot(),
          classification: 'unknown',
          reason: 'no_metric_available',
          recommendation: 'Use raw value and longitudinal trend until a metric is captured.',
        },
      };
    }

    const lookup = toNormativeLookupParams(params);

    const comparison = await this.normative.classifyMetricValue({
      assessmentDefinitionKey: session.assessment_definition_key,
      metricKey: primaryMetric.metric_key,
      value: primaryMetric.value,
      sport: lookup.sport,
      age: lookup.age,
      sex: lookup.sex,
      position: lookup.position,
      competitionLevel: lookup.competitionLevel,
    });

    const zScoreResult = await this.normative.calculateZScore({
      assessmentDefinitionKey: session.assessment_definition_key,
      metricKey: primaryMetric.metric_key,
      value: primaryMetric.value,
      sport: lookup.sport,
      age: lookup.age,
      sex: lookup.sex,
      position: lookup.position,
      competitionLevel: lookup.competitionLevel,
    });

    const snapshot: NormativeComparisonSnapshot = {
      profile_key: comparison.profileKey ?? null,
      performance_band: comparison.band ?? null,
      percentile: null,
      z_score: zScoreResult.zScore ?? comparison.zScore ?? null,
      confidence: comparison.sourceQuality === 'published' ? 0.9 : comparison.sourceQuality === 'internal' ? 0.6 : 0.3,
      source_quality: comparison.sourceQuality ?? null,
      classification: comparison.classification,
      reason: comparison.reason ?? null,
      recommendation: comparison.recommendation ?? null,
    };

    return {
      ...session,
      normative_comparison: snapshot,
      updated_at: new Date().toISOString(),
    };
  }

  buildSessionSnapshot(session: AssessmentSession): AssessmentSessionSnapshot {
    return {
      session_id: session.session_id,
      athlete_id: session.athlete_id,
      organization_id: session.organization_id,
      assessment_definition_key: session.assessment_definition_key,
      conducted_at: session.conducted_at,
      status: session.status,
      primary_metric: session.calculated_metrics[0] ?? null,
      normative_comparison: session.normative_comparison,
      protocol_version: session.protocol_version,
    };
  }

  async getAssessmentSummary(session: AssessmentSession): Promise<AssessmentSessionSummary> {
    const definition = await this.deps.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(
      session.assessment_definition_key
    );
    const primary = session.calculated_metrics[0] ?? null;
    const snapshot = this.buildSessionSnapshot(session);
    const integrity = validateSessionSnapshotIntegrity(session, snapshot);

    if (!integrity.valid) {
      throw new Error(`snapshot_integrity_failed:${integrity.errors.join(';')}`);
    }

    return {
      session_id: session.session_id,
      assessment_name: definition?.name.en ?? session.assessment_definition_key,
      assessment_key: session.assessment_definition_key,
      athlete_id: session.athlete_id,
      conducted_at: session.conducted_at,
      status: session.status,
      primary_value: primary?.value ?? null,
      primary_unit: primary?.unit ?? null,
      performance_band: session.normative_comparison.performance_band ?? null,
      classification: session.normative_comparison.classification ?? null,
      trial_count: session.raw_measurements.length,
      calculated_metric_count: session.calculated_metrics.length,
    };
  }
}

export function createAssessmentSessionEngine(
  deps: AssessmentSessionEngineDependencies
): AssessmentSessionEngine {
  return new AssessmentSessionEngine(deps);
}

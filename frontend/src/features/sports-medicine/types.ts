/** Sports Medicine domain types — structured for future Supabase wiring. */

export type BodyRegion = 'hamstring' | 'knee' | 'ankle' | 'groin' | 'shoulder' | 'back' | 'hip' | 'calf' | 'other';

export type TissueType = 'muscle' | 'ligament' | 'tendon' | 'bone' | 'joint' | 'other';

export type InjurySeverity = 'grade_1' | 'grade_2' | 'grade_3';

export type InjuryStatus = 'active' | 'rehab' | 'return_to_play' | 'resolved';

export type RTPPhaseId = 'phase_1' | 'phase_2' | 'phase_3' | 'phase_4' | 'phase_5' | 'ready';

export interface InjuryRecord {
  id: string;
  athlete_id: string;
  injury_date: string;
  body_region: BodyRegion;
  tissue_type: TissueType;
  severity_grade: InjurySeverity;
  pain_level: number;
  swelling: number;
  rom_limitation: number;
  status: InjuryStatus;
  expected_absence_days: number;
  rtp_phase: RTPPhaseId;
  notes?: string;
  created_at: string;
}

export type InjuryRecordInput = Omit<InjuryRecord, 'id' | 'created_at'>;

export interface RTPPhaseDefinition {
  id: RTPPhaseId;
  order: number;
  labelKey: string;
  goalKey: string;
  criteriaKey: string;
}

export interface RehabPlanExercise {
  nameKey: string;
  setsRepsKey: string;
}

export interface RehabPlanPhase {
  phaseId: RTPPhaseId;
  goalKey: string;
  exerciseKeys: string[];
  precautionKeys: string[];
  progressCriteriaKey: string;
}

export interface RehabPlanTemplate {
  id: string;
  conditionKey: string;
  region: BodyRegion;
  phases: RehabPlanPhase[];
}

export type InjuryAlertId =
  | 'high_hamstring_risk'
  | 'high_ankle_risk'
  | 'reduce_sprint_load'
  | 'add_mobility'
  | 'medical_evaluation';

export interface InjuryAlert {
  id: InjuryAlertId;
  priority: 'high' | 'medium' | 'low';
  titleKey: string;
  bodyKey: string;
}

export interface RegionalRiskScores {
  overall: number;
  hamstring: number;
  knee: number;
  ankle: number;
  groin: number;
  shoulder: number;
  back: number;
}

export interface InjuryPreventionProfile {
  regional: RegionalRiskScores;
  alerts: InjuryAlert[];
  preventionKeys: string[];
  activeInjuries: InjuryRecord[];
  resolvedCount: number;
}

export interface SportsMedicineSnapshot {
  profile: InjuryPreventionProfile;
  primaryInjury?: InjuryRecord;
  rehabPlan?: RehabPlanTemplate;
  rtpProgress: number;
  nextCriteriaKey?: string;
}

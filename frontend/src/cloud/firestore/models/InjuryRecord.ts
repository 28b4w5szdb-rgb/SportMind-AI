import type { CloudDocumentMeta } from './common';

export type InjuryBodyRegion =
  | 'hamstring'
  | 'knee'
  | 'ankle'
  | 'groin'
  | 'shoulder'
  | 'back'
  | 'hip'
  | 'calf'
  | 'other';

export type InjuryTissueType = 'muscle' | 'ligament' | 'tendon' | 'bone' | 'joint' | 'other';

export type InjurySeverity = 'grade_1' | 'grade_2' | 'grade_3';

export type InjuryStatus = 'active' | 'rehab' | 'return_to_play' | 'resolved';

export type RTPPhaseId = 'phase_1' | 'phase_2' | 'phase_3' | 'phase_4' | 'phase_5' | 'ready';

/** Sports medicine injury record. Collection: `injuries/{id}`. */
export interface InjuryRecord extends CloudDocumentMeta {
  organization_id: string;
  athlete_id: string;
  injury_date: string;
  body_region: InjuryBodyRegion;
  tissue_type: InjuryTissueType;
  severity_grade: InjurySeverity;
  pain_level: number;
  swelling: number;
  rom_limitation: number;
  status: InjuryStatus;
  expected_absence_days: number;
  rtp_phase: RTPPhaseId;
  notes?: string;
}

export type InjuryRecordInput = Omit<InjuryRecord, keyof CloudDocumentMeta>;

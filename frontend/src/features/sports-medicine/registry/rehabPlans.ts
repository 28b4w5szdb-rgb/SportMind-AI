import type { BodyRegion, RehabPlanTemplate } from '../types';

/** Mock rehab plan library — scalable template registry. */
export const REHAB_PLAN_TEMPLATES: RehabPlanTemplate[] = [
  {
    id: 'hamstring_strain',
    conditionKey: 'sportsMedicine.rehab.hamstringStrain',
    region: 'hamstring',
    phases: [
      {
        phaseId: 'phase_1',
        goalKey: 'sportsMedicine.rehab.hamstring.p1Goal',
        exerciseKeys: ['sportsMedicine.rehab.hamstring.p1Ex1', 'sportsMedicine.rehab.hamstring.p1Ex2'],
        precautionKeys: ['sportsMedicine.rehab.hamstring.p1Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.hamstring.p1Criteria',
      },
      {
        phaseId: 'phase_2',
        goalKey: 'sportsMedicine.rehab.hamstring.p2Goal',
        exerciseKeys: ['sportsMedicine.rehab.hamstring.p2Ex1', 'sportsMedicine.rehab.hamstring.p2Ex2'],
        precautionKeys: ['sportsMedicine.rehab.hamstring.p2Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.hamstring.p2Criteria',
      },
      {
        phaseId: 'phase_3',
        goalKey: 'sportsMedicine.rehab.hamstring.p3Goal',
        exerciseKeys: ['sportsMedicine.rehab.hamstring.p3Ex1'],
        precautionKeys: ['sportsMedicine.rehab.hamstring.p3Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.hamstring.p3Criteria',
      },
    ],
  },
  {
    id: 'ankle_sprain',
    conditionKey: 'sportsMedicine.rehab.ankleSprain',
    region: 'ankle',
    phases: [
      {
        phaseId: 'phase_1',
        goalKey: 'sportsMedicine.rehab.ankle.p1Goal',
        exerciseKeys: ['sportsMedicine.rehab.ankle.p1Ex1', 'sportsMedicine.rehab.ankle.p1Ex2'],
        precautionKeys: ['sportsMedicine.rehab.ankle.p1Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.ankle.p1Criteria',
      },
      {
        phaseId: 'phase_2',
        goalKey: 'sportsMedicine.rehab.ankle.p2Goal',
        exerciseKeys: ['sportsMedicine.rehab.ankle.p2Ex1'],
        precautionKeys: ['sportsMedicine.rehab.ankle.p2Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.ankle.p2Criteria',
      },
    ],
  },
  {
    id: 'acl',
    conditionKey: 'sportsMedicine.rehab.acl',
    region: 'knee',
    phases: [
      {
        phaseId: 'phase_1',
        goalKey: 'sportsMedicine.rehab.acl.p1Goal',
        exerciseKeys: ['sportsMedicine.rehab.acl.p1Ex1'],
        precautionKeys: ['sportsMedicine.rehab.acl.p1Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.acl.p1Criteria',
      },
      {
        phaseId: 'phase_3',
        goalKey: 'sportsMedicine.rehab.acl.p3Goal',
        exerciseKeys: ['sportsMedicine.rehab.acl.p3Ex1'],
        precautionKeys: ['sportsMedicine.rehab.acl.p3Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.acl.p3Criteria',
      },
    ],
  },
  {
    id: 'groin_pain',
    conditionKey: 'sportsMedicine.rehab.groinPain',
    region: 'groin',
    phases: [
      {
        phaseId: 'phase_1',
        goalKey: 'sportsMedicine.rehab.groin.p1Goal',
        exerciseKeys: ['sportsMedicine.rehab.groin.p1Ex1'],
        precautionKeys: ['sportsMedicine.rehab.groin.p1Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.groin.p1Criteria',
      },
      {
        phaseId: 'phase_2',
        goalKey: 'sportsMedicine.rehab.groin.p2Goal',
        exerciseKeys: ['sportsMedicine.rehab.groin.p2Ex1'],
        precautionKeys: ['sportsMedicine.rehab.groin.p2Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.groin.p2Criteria',
      },
    ],
  },
  {
    id: 'shoulder_overload',
    conditionKey: 'sportsMedicine.rehab.shoulderOverload',
    region: 'shoulder',
    phases: [
      {
        phaseId: 'phase_1',
        goalKey: 'sportsMedicine.rehab.shoulder.p1Goal',
        exerciseKeys: ['sportsMedicine.rehab.shoulder.p1Ex1'],
        precautionKeys: ['sportsMedicine.rehab.shoulder.p1Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.shoulder.p1Criteria',
      },
      {
        phaseId: 'phase_3',
        goalKey: 'sportsMedicine.rehab.shoulder.p3Goal',
        exerciseKeys: ['sportsMedicine.rehab.shoulder.p3Ex1'],
        precautionKeys: ['sportsMedicine.rehab.shoulder.p3Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.shoulder.p3Criteria',
      },
    ],
  },
  {
    id: 'low_back_pain',
    conditionKey: 'sportsMedicine.rehab.lowBackPain',
    region: 'back',
    phases: [
      {
        phaseId: 'phase_1',
        goalKey: 'sportsMedicine.rehab.back.p1Goal',
        exerciseKeys: ['sportsMedicine.rehab.back.p1Ex1'],
        precautionKeys: ['sportsMedicine.rehab.back.p1Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.back.p1Criteria',
      },
      {
        phaseId: 'phase_2',
        goalKey: 'sportsMedicine.rehab.back.p2Goal',
        exerciseKeys: ['sportsMedicine.rehab.back.p2Ex1'],
        precautionKeys: ['sportsMedicine.rehab.back.p2Precaution'],
        progressCriteriaKey: 'sportsMedicine.rehab.back.p2Criteria',
      },
    ],
  },
];

export function rehabPlanForRegion(region: BodyRegion): RehabPlanTemplate | undefined {
  return REHAB_PLAN_TEMPLATES.find((p) => p.region === region) ?? REHAB_PLAN_TEMPLATES[0];
}

export function rehabPlanById(id: string): RehabPlanTemplate | undefined {
  return REHAB_PLAN_TEMPLATES.find((p) => p.id === id);
}

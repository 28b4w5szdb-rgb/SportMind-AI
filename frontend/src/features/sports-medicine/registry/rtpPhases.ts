import type { RTPPhaseDefinition, RTPPhaseId } from '../types';

export const RTP_PHASES: RTPPhaseDefinition[] = [
  { id: 'phase_1', order: 1, labelKey: 'sportsMedicine.rtp.phase1', goalKey: 'sportsMedicine.rtp.phase1Goal', criteriaKey: 'sportsMedicine.rtp.phase1Criteria' },
  { id: 'phase_2', order: 2, labelKey: 'sportsMedicine.rtp.phase2', goalKey: 'sportsMedicine.rtp.phase2Goal', criteriaKey: 'sportsMedicine.rtp.phase2Criteria' },
  { id: 'phase_3', order: 3, labelKey: 'sportsMedicine.rtp.phase3', goalKey: 'sportsMedicine.rtp.phase3Goal', criteriaKey: 'sportsMedicine.rtp.phase3Criteria' },
  { id: 'phase_4', order: 4, labelKey: 'sportsMedicine.rtp.phase4', goalKey: 'sportsMedicine.rtp.phase4Goal', criteriaKey: 'sportsMedicine.rtp.phase4Criteria' },
  { id: 'phase_5', order: 5, labelKey: 'sportsMedicine.rtp.phase5', goalKey: 'sportsMedicine.rtp.phase5Goal', criteriaKey: 'sportsMedicine.rtp.phase5Criteria' },
  { id: 'ready', order: 6, labelKey: 'sportsMedicine.rtp.ready', goalKey: 'sportsMedicine.rtp.readyGoal', criteriaKey: 'sportsMedicine.rtp.readyCriteria' },
];

export function rtpPhaseIndex(phaseId: RTPPhaseId): number {
  return RTP_PHASES.findIndex((p) => p.id === phaseId);
}

export function rtpProgressPercent(phaseId: RTPPhaseId): number {
  const idx = rtpPhaseIndex(phaseId);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / RTP_PHASES.length) * 100);
}

export function nextRtpPhase(phaseId: RTPPhaseId): RTPPhaseDefinition | undefined {
  const idx = rtpPhaseIndex(phaseId);
  return RTP_PHASES[idx + 1];
}

import type { BodyRegion, InjuryRecord, SportsMedicineSnapshot } from '../types';
import { computeInjuryPreventionProfile, type InjuryPreventionInput } from '../engine/injuryPreventionEngine';
import { rehabPlanForRegion } from '../registry/rehabPlans';
import { nextRtpPhase, rtpProgressPercent, RTP_PHASES } from '../registry/rtpPhases';

export function buildSportsMedicineSnapshot(input: InjuryPreventionInput): SportsMedicineSnapshot {
  const profile = computeInjuryPreventionProfile(input);
  const primaryInjury =
    profile.activeInjuries.sort((a, b) => b.pain_level - a.pain_level)[0] ??
    input.injuries.filter((i) => i.athlete_id === input.athlete.id).sort((a, b) => new Date(b.injury_date).getTime() - new Date(a.injury_date).getTime())[0];

  const rehabPlan = primaryInjury ? rehabPlanForRegion(primaryInjury.body_region) : undefined;
  const rtpProgress = primaryInjury ? rtpProgressPercent(primaryInjury.rtp_phase) : 100;
  const nextPhase = primaryInjury ? nextRtpPhase(primaryInjury.rtp_phase) : undefined;
  const nextCriteriaKey = nextPhase?.criteriaKey ?? RTP_PHASES[RTP_PHASES.length - 1].criteriaKey;

  return { profile, primaryInjury, rehabPlan, rtpProgress, nextCriteriaKey };
}

export function activeInjuriesForAthlete(injuries: InjuryRecord[], athleteId: string): InjuryRecord[] {
  return injuries.filter((i) => i.athlete_id === athleteId && i.status !== 'resolved');
}

export function injuryHistoryForAthlete(injuries: InjuryRecord[], athleteId: string): InjuryRecord[] {
  return injuries
    .filter((i) => i.athlete_id === athleteId)
    .sort((a, b) => new Date(b.injury_date).getTime() - new Date(a.injury_date).getTime());
}

export function regionsWithHistory(injuries: InjuryRecord[], athleteId: string): BodyRegion[] {
  return [...new Set(injuries.filter((i) => i.athlete_id === athleteId).map((i) => i.body_region))];
}

export function attentionRegions(profile: SportsMedicineSnapshot['profile']): BodyRegion[] {
  const entries: Array<[BodyRegion, number]> = [
    ['hamstring', profile.regional.hamstring],
    ['knee', profile.regional.knee],
    ['ankle', profile.regional.ankle],
    ['groin', profile.regional.groin],
    ['shoulder', profile.regional.shoulder],
    ['back', profile.regional.back],
  ];
  return entries.filter(([, score]) => score >= 55).map(([region]) => region);
}

import type { WearableProviderId } from '../types';

export type DataQualityLevel = 'excellent' | 'good' | 'fair' | 'none';
export type ConnectionQualityLevel = 'excellent' | 'good' | 'weak' | 'offline';

function hashSeed(providerId: string, athleteId: string): number {
  const raw = `${providerId}:${athleteId}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface MockDeviceMeta {
  batteryPercent: number;
  signalStrength: number;
  dataQuality: DataQualityLevel;
  connectionQuality: ConnectionQualityLevel;
}

export function getMockDeviceMeta(
  providerId: WearableProviderId,
  athleteId: string,
  connected: boolean
): MockDeviceMeta {
  if (!connected) {
    return {
      batteryPercent: 0,
      signalStrength: 0,
      dataQuality: 'none',
      connectionQuality: 'offline',
    };
  }

  const seed = hashSeed(providerId, athleteId);
  const batteryPercent = 55 + (seed % 40);
  const signalStrength = 62 + (seed % 35);
  const qualityIndex = seed % 10;

  let dataQuality: DataQualityLevel = 'good';
  if (qualityIndex >= 7) dataQuality = 'excellent';
  else if (qualityIndex <= 2) dataQuality = 'fair';

  let connectionQuality: ConnectionQualityLevel = 'good';
  if (signalStrength >= 85) connectionQuality = 'excellent';
  else if (signalStrength < 70) connectionQuality = 'weak';

  return { batteryPercent, signalStrength, dataQuality, connectionQuality };
}

export function getMockStressScore(recoveryScore?: number, seed = 0): number {
  if (recoveryScore !== undefined) {
    return Math.max(8, Math.min(92, 100 - recoveryScore + (seed % 8)));
  }
  return 28 + (seed % 35);
}

export function getMockRespiratoryRate(seed: number): number {
  return 13 + (seed % 6);
}

export function getMockReadinessScore(recoveryScore?: number, readinessImpact?: number): number {
  const base = recoveryScore ?? 68;
  const impact = readinessImpact ?? 0;
  return Math.max(20, Math.min(98, base + impact));
}

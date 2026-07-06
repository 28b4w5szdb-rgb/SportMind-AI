import type { WearableDailySnapshot } from '../types';
import { getProviderById } from '../registry/providerRegistry';

export function formatWearablesForAI(snapshot: WearableDailySnapshot, athleteName: string, isRTL: boolean, t: (key: string) => string): string {
  const providerLabel = snapshot.primaryProviderId ? t(getProviderById(snapshot.primaryProviderId).labelKey) : t('wearables.noDevice');

  if (!snapshot.restingHeartRate && !snapshot.hrv && !snapshot.sleepDurationHours && !snapshot.steps) {
    return isRTL
      ? `⌚ لا توجد بيانات أجهزة محفوظة لـ ${athleteName}.`
      : `⌚ No saved wearable data for ${athleteName}.`;
  }

  const lines: string[] = isRTL
    ? [`⌚ ملخص الأجهزة — ${athleteName}`, `المزود: ${providerLabel}`, `آخر مزامنة: ${snapshot.lastSyncAt ?? '—'}`]
    : [`⌚ Wearables summary — ${athleteName}`, `Provider: ${providerLabel}`, `Last sync: ${snapshot.lastSyncAt ?? '—'}`];

  if (snapshot.sleepDurationHours !== undefined) {
    lines.push(
      isRTL
        ? `النوم: ${snapshot.sleepDurationHours}h · جودة ${snapshot.sleepQuality ?? '—'}/10`
        : `Sleep: ${snapshot.sleepDurationHours}h · quality ${snapshot.sleepQuality ?? '—'}/10`
    );
  }
  if (snapshot.hrv !== undefined) {
    lines.push(isRTL ? `HRV: ${snapshot.hrv} ms` : `HRV: ${snapshot.hrv} ms`);
  }
  if (snapshot.restingHeartRate !== undefined) {
    lines.push(isRTL ? `نبض الراحة: ${snapshot.restingHeartRate} bpm` : `Resting HR: ${snapshot.restingHeartRate} bpm`);
  }
  if (snapshot.steps !== undefined) {
    lines.push(isRTL ? `الخطوات: ${snapshot.steps}` : `Steps: ${snapshot.steps}`);
  }
  if (snapshot.calories !== undefined) {
    lines.push(isRTL ? `السعرات: ${snapshot.calories} kcal` : `Calories: ${snapshot.calories} kcal`);
  }
  if (snapshot.trainingLoad !== undefined) {
    lines.push(isRTL ? `حمل التدريب: ${snapshot.trainingLoad} AU` : `Training load: ${snapshot.trainingLoad} AU`);
  }

  lines.push(
    isRTL
      ? `تأثير الجاهزية: ${snapshot.readinessImpact >= 0 ? '+' : ''}${snapshot.readinessImpact}`
      : `Readiness impact: ${snapshot.readinessImpact >= 0 ? '+' : ''}${snapshot.readinessImpact}`
  );

  return lines.join('\n');
}

export function buildWearableReportSummary(snapshot: WearableDailySnapshot, isRTL: boolean, t: (key: string) => string): string {
  const provider = snapshot.primaryProviderId ? t(getProviderById(snapshot.primaryProviderId).labelKey) : '—';
  if (isRTL) {
    return (
      `الجهاز: ${provider} · آخر مزامنة: ${snapshot.lastSyncAt ?? '—'}\n` +
      `النوم: ${snapshot.sleepDurationHours ?? '—'}h · HRV: ${snapshot.hrv ?? '—'} ms · نبض الراحة: ${snapshot.restingHeartRate ?? '—'} bpm\n` +
      `الخطوات: ${snapshot.steps ?? '—'} · السعرات: ${snapshot.calories ?? '—'} · حمل التدريب: ${snapshot.trainingLoad ?? '—'} AU`
    );
  }
  return (
    `Device: ${provider} · Last sync: ${snapshot.lastSyncAt ?? '—'}\n` +
    `Sleep: ${snapshot.sleepDurationHours ?? '—'}h · HRV: ${snapshot.hrv ?? '—'} ms · Resting HR: ${snapshot.restingHeartRate ?? '—'} bpm\n` +
    `Steps: ${snapshot.steps ?? '—'} · Calories: ${snapshot.calories ?? '—'} · Training load: ${snapshot.trainingLoad ?? '—'} AU`
  );
}

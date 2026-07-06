/**
 * Priority normative reference profiles — conservative placeholder bands.
 * sourceQuality: placeholder unless noted. Do not use for clinical claims.
 */

import type { NormativeSeedSpec } from './normativeReferenceBuilder';

const P = (
  partial: NormativeSeedSpec & { assessmentDefinitionKey: string; key: string; nameEn: string; nameAr: string; unit: string; elite: number; good: number; average: number }
): NormativeSeedSpec => ({
  sourceQuality: 'placeholder',
  evidenceTier: 'field',
  ...partial,
});

export const PRIORITY_NORMATIVE_SPECS: NormativeSeedSpec[] = [
  P({ key: 'bmi_adult_field', assessmentDefinitionKey: 'bmi', nameEn: 'BMI — Adult Field Sport', nameAr: 'مؤشر كتلة الجسم — رياضة ميدانية', unit: 'kg/m²', elite: 22, good: 24, average: 26, lowerIsBetter: true }),
  P({ key: 'body_fat_male_field', assessmentDefinitionKey: 'body_fat', nameEn: 'Body Fat % — Male Field', nameAr: 'نسبة الدهون — ذكور ميداني', unit: '%', elite: 8, good: 12, average: 16, lowerIsBetter: true, sex: 'male' }),
  P({ key: 'waist_hip_ratio_male', assessmentDefinitionKey: 'waist_hip_ratio', nameEn: 'Waist-to-Hip Ratio — Male', nameAr: 'نسبة الخصر إلى الورك — ذكور', unit: 'ratio', elite: 0.85, good: 0.9, average: 0.95, lowerIsBetter: true, sex: 'male' }),
  P({ key: 'vo2max_field_estimate', assessmentDefinitionKey: 'vo2max_est', nameEn: 'VO2 Max Field Estimate', nameAr: 'تقدير VO2 Max ميداني', unit: 'ml/kg/min', elite: 58, good: 52, average: 46 }),
  P({ key: 'cooper_12min', assessmentDefinitionKey: 'cooper', nameEn: 'Cooper 12-Minute Run', nameAr: 'اختبار Cooper 12 دقيقة', unit: 'm', elite: 2800, good: 2400, average: 2000 }),
  P({ key: 'yoyo_ir1', assessmentDefinitionKey: 'yoyo', nameEn: 'Yo-Yo IR1', nameAr: 'Yo-Yo IR1', unit: 'm', elite: 1800, good: 1500, average: 1200, evidenceTier: 'professional' }),
  P({ key: 'beep_test', assessmentDefinitionKey: 'beep', nameEn: 'Beep Test', nameAr: 'اختبار Beep', unit: 'level', elite: 13, good: 11, average: 9 }),
  P({ key: 'mas_field', assessmentDefinitionKey: 'mas', nameEn: 'MAS', nameAr: 'MAS', unit: 'km/h', elite: 18, good: 16, average: 14 }),
  P({ key: 'hr_recovery_1min', assessmentDefinitionKey: 'heart_rate_recovery', nameEn: 'Heart Rate Recovery (1 min)', nameAr: 'تعافي معدل ضربات القلب (1 د)', unit: 'bpm', elite: 30, good: 22, average: 15 }),
  P({ key: 'resting_hr', assessmentDefinitionKey: 'resting_heart_rate', nameEn: 'Resting Heart Rate', nameAr: 'معدل ضربات القلب أثناء الراحة', unit: 'bpm', elite: 48, good: 55, average: 62, lowerIsBetter: true }),
  P({ key: 'hrv_rmssd', assessmentDefinitionKey: 'hrv_rmssd', nameEn: 'HRV RMSSD', nameAr: 'HRV RMSSD', unit: 'ms', elite: 65, good: 50, average: 35, evidenceTier: 'professional', zScoreMean: 45, zScoreSd: 15 }),
  P({ key: 'cmj_jump_mat', assessmentDefinitionKey: 'cmj', nameEn: 'CMJ — Jump Mat', nameAr: 'CMJ — بساط القفز', unit: 'cm', elite: 48, good: 42, average: 36 }),
  P({ key: 'force_plate_cmj', assessmentDefinitionKey: 'force_plate_cmj', nameEn: 'Force Plate CMJ', nameAr: 'CMJ — لوحة القوة', unit: 'cm', elite: 50, good: 44, average: 38, evidenceTier: 'research', sourceQuality: 'internal' }),
  P({ key: 'squat_1rm_relative', assessmentDefinitionKey: 'squat_1rm', metricKey: 'relative_1rm', nameEn: 'Squat 1RM Relative Strength', nameAr: 'قوة Squat 1RM نسبية', unit: '× BW', elite: 2.0, good: 1.7, average: 1.4, evidenceTier: 'professional' }),
  P({ key: 'bench_1rm_relative', assessmentDefinitionKey: 'bench_1rm', metricKey: 'relative_1rm', nameEn: 'Bench Press 1RM Relative Strength', nameAr: 'قوة Bench 1RM نسبية', unit: '× BW', elite: 1.5, good: 1.25, average: 1.0, evidenceTier: 'professional' }),
  P({ key: 'deadlift_1rm_relative', assessmentDefinitionKey: 'deadlift_1rm', metricKey: 'relative_1rm', nameEn: 'Deadlift 1RM Relative Strength', nameAr: 'قوة Deadlift 1RM نسبية', unit: '× BW', elite: 2.5, good: 2.1, average: 1.7, evidenceTier: 'professional' }),
  P({ key: 'nordic_hamstring', assessmentDefinitionKey: 'nordic_hamstring', nameEn: 'Nordic Hamstring Force', nameAr: 'قوة Nordic Hamstring', unit: 'N', elite: 420, good: 360, average: 300, evidenceTier: 'research' }),
  P({ key: 'sprint_5m', assessmentDefinitionKey: 'sprint5', nameEn: '5m Sprint', nameAr: 'Sprint 5m', unit: 's', elite: 1.05, good: 1.12, average: 1.2, lowerIsBetter: true }),
  P({ key: 'sprint_10m', assessmentDefinitionKey: 'sprint10', nameEn: '10m Sprint', nameAr: 'Sprint 10m', unit: 's', elite: 1.75, good: 1.85, average: 1.95, lowerIsBetter: true }),
  P({ key: 'sprint_20m', assessmentDefinitionKey: 'sprint20', nameEn: '20m Sprint', nameAr: 'Sprint 20m', unit: 's', elite: 2.85, good: 3.0, average: 3.15, lowerIsBetter: true }),
  P({ key: 'sprint_30m', assessmentDefinitionKey: 'sprint30', nameEn: '30m Sprint', nameAr: 'Sprint 30m', unit: 's', elite: 3.95, good: 4.15, average: 4.35, lowerIsBetter: true }),
  P({ key: 'flying_sprint', assessmentDefinitionKey: 'flying_sprint', nameEn: 'Flying Sprint', nameAr: 'Flying Sprint', unit: 's', elite: 2.2, good: 2.35, average: 2.5, lowerIsBetter: true }),
  P({ key: 'test_505', assessmentDefinitionKey: 'test_505', nameEn: '505 Agility', nameAr: '505 Agility', unit: 's', elite: 2.15, good: 2.3, average: 2.45, lowerIsBetter: true }),
  P({ key: 'illinois_agility', assessmentDefinitionKey: 'illinois', nameEn: 'Illinois Agility', nameAr: 'Illinois Agility', unit: 's', elite: 14.5, good: 15.5, average: 16.5, lowerIsBetter: true }),
  P({ key: 't_test', assessmentDefinitionKey: 't_test', nameEn: 'T-Test', nameAr: 'T-Test', unit: 's', elite: 9.0, good: 9.8, average: 10.5, lowerIsBetter: true }),
  P({ key: 'y_balance_composite', assessmentDefinitionKey: 'y_balance', nameEn: 'Y-Balance Composite', nameAr: 'Y-Balance مركب', unit: 'cm', elite: 105, good: 98, average: 90, evidenceTier: 'screening' }),
  P({ key: 'fms_total', assessmentDefinitionKey: 'fms', nameEn: 'FMS Total Score', nameAr: 'مجموع FMS', unit: 'score', elite: 17, good: 15, average: 13, evidenceTier: 'screening' }),
  P({ key: 'hooper_index', assessmentDefinitionKey: 'hooper_index', nameEn: 'Hooper Index', nameAr: 'مؤشر Hooper', unit: 'score', elite: 8, good: 12, average: 16, lowerIsBetter: true, evidenceTier: 'screening' }),
  P({ key: 'tqr', assessmentDefinitionKey: 'tqr', nameEn: 'TQR', nameAr: 'TQR', unit: 'score', elite: 8, good: 6, average: 5 }),
  P({ key: 'urine_specific_gravity', assessmentDefinitionKey: 'urine_specific_gravity', nameEn: 'Urine Specific Gravity', nameAr: 'الكثافة النوعية للبول', unit: 'sg', elite: 1.005, good: 1.015, average: 1.025, lowerIsBetter: true }),
  P({ key: 'sweat_rate', assessmentDefinitionKey: 'sweat_rate', nameEn: 'Sweat Rate', nameAr: 'معدل التعرق', unit: 'L/h', elite: 1.8, good: 1.4, average: 1.0, evidenceTier: 'research' }),
  P({ key: 'acwr_ratio', assessmentDefinitionKey: 'playerload', metricKey: 'acwr', nameEn: 'ACWR', nameAr: 'ACWR', unit: 'ratio', elite: 1.0, good: 1.15, average: 1.3, lowerIsBetter: true, evidenceTier: 'professional', sourceQuality: 'internal' }),
  P({ key: 'training_monotony', assessmentDefinitionKey: 'training_monotony', nameEn: 'Training Monotony', nameAr: 'رتابة التدريب', unit: 'ratio', elite: 1.5, good: 2.0, average: 2.5, lowerIsBetter: true, evidenceTier: 'research' }),
  P({ key: 'training_strain', assessmentDefinitionKey: 'training_strain', nameEn: 'Training Strain', nameAr: 'إجهاد التدريب', unit: 'AU', elite: 2500, good: 3500, average: 4500, lowerIsBetter: true, evidenceTier: 'research' }),
];

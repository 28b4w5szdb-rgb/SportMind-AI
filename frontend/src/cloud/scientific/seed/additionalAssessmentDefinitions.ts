/**
 * High-value assessments from Phase 6C.0.1 scientific audit — not in Performance Lab registry.
 */

import type { CompactAssessmentSpec } from './definitionBuilder';

export const ADDITIONAL_ASSESSMENT_SPECS: CompactAssessmentSpec[] = [
  // Anthropometry
  { key: 'standing_height', category: 'anthropometry', subcategory: 'stature', nameEn: 'Standing Height Protocol', nameAr: 'بروتوكول الطول وقوفاً', unit: 'cm', tier: 'field', retestDays: 180 },
  { key: 'sitting_height', category: 'anthropometry', subcategory: 'stature', nameEn: 'Sitting Height', nameAr: 'الطول جلوساً', unit: 'cm', tier: 'field', retestDays: 180 },
  { key: 'arm_span', category: 'anthropometry', subcategory: 'limb_dimensions', nameEn: 'Arm Span', nameAr: 'بسط الذراعين', unit: 'cm', tier: 'field', retestDays: 180 },
  { key: 'limb_lengths', category: 'anthropometry', subcategory: 'limb_dimensions', nameEn: 'Limb Lengths', nameAr: 'أطوال الأطراف', unit: 'cm', tier: 'field', retestDays: 180 },
  { key: 'girth_measurements', category: 'anthropometry', subcategory: 'circumference', nameEn: 'Girth Measurements', nameAr: 'قياسات المحيط', unit: 'cm', tier: 'field', retestDays: 90 },
  { key: 'somatotype', category: 'anthropometry', subcategory: 'morphology', nameEn: 'Somatotype Assessment', nameAr: 'تقييم النمط الجسمي', unit: 'score', tier: 'research', retestDays: 180 },
  { key: 'maturity_offset', category: 'anthropometry', subcategory: 'maturation', nameEn: 'Maturity Offset', nameAr: 'إزاحة النضج', unit: 'years', tier: 'research', retestDays: 90 },
  { key: 'phv_estimate', category: 'anthropometry', subcategory: 'maturation', nameEn: 'PHV Estimate', nameAr: 'تقدير PHV', unit: 'years', tier: 'research', retestDays: 90 },

  // Body composition
  { key: 'dexa_scan', category: 'body_composition', subcategory: 'imaging', nameEn: 'DEXA Body Composition', nameAr: 'تركيب الجسم DEXA', unit: '%', tier: 'clinical', sources: ['dexa'], retestDays: 90 },
  { key: 'bia_analysis', category: 'body_composition', subcategory: 'impedance', nameEn: 'BIA Analysis', nameAr: 'تحليل BIA', unit: '%', tier: 'field', sources: ['bia'], retestDays: 28 },
  { key: 'skinfold_sum', category: 'body_composition', subcategory: 'skinfold', nameEn: 'Skinfold Sum', nameAr: 'مجموع طيات الجلد', unit: 'mm', tier: 'field', lowerIsBetter: true, retestDays: 28 },
  { key: 'waist_to_height_ratio', category: 'body_composition', subcategory: 'anthropometric_index', nameEn: 'Waist-to-Height Ratio', nameAr: 'نسبة الخصر إلى الطول', unit: 'ratio', tier: 'screening', lowerIsBetter: true, retestDays: 28 },
  { key: 'bone_mineral_content', category: 'body_composition', subcategory: 'bone', nameEn: 'Bone Mineral Content', nameAr: 'محتوى المعادن في العظم', unit: 'g', tier: 'clinical', sources: ['dexa'], retestDays: 180 },

  // Cardiorespiratory
  { key: 'cpet_vo2max', category: 'cardiorespiratory', subcategory: 'laboratory', nameEn: 'CPET VO2max', nameAr: 'VO2max CPET', unit: 'ml/kg/min', tier: 'clinical', sources: ['spirometry'], retestDays: 90 },
  { key: 'ventilatory_threshold', category: 'cardiorespiratory', subcategory: 'laboratory', nameEn: 'Ventilatory Threshold VT1/VT2', nameAr: 'عتبة التهوية VT1/VT2', unit: 'ml/kg/min', tier: 'clinical', sources: ['spirometry'], retestDays: 90 },
  { key: 'blood_lactate_step_test', category: 'cardiorespiratory', subcategory: 'lactate', nameEn: 'Blood Lactate Step Test', nameAr: 'اختبار خطوات اللاكتات', unit: 'mmol/L', tier: 'professional', sources: ['blood'], retestDays: 56 },
  { key: 'lactate_lt1_lt2', category: 'cardiorespiratory', subcategory: 'lactate', nameEn: 'Lactate Threshold LT1/LT2', nameAr: 'عتبة اللاكتات LT1/LT2', unit: 'km/h', tier: 'professional', sources: ['blood'], retestDays: 56 },
  { key: 'heart_rate_recovery', category: 'cardiorespiratory', subcategory: 'autonomic', nameEn: 'Heart Rate Recovery', nameAr: 'تعافي معدل ضربات القلب', unit: 'bpm', tier: 'field', lowerIsBetter: false, retestDays: 14, sources: ['wearable'] },
  { key: 'resting_heart_rate', category: 'cardiorespiratory', subcategory: 'autonomic', nameEn: 'Resting Heart Rate', nameAr: 'معدل ضربات القلب أثناء الراحة', unit: 'bpm', tier: 'screening', lowerIsBetter: true, retestDays: 7, sources: ['wearable', 'manual'] },
  { key: 'hrv_rmssd', category: 'cardiorespiratory', subcategory: 'autonomic', nameEn: 'HRV RMSSD', nameAr: 'HRV RMSSD', unit: 'ms', tier: 'professional', retestDays: 7, sources: ['wearable'] },
  { key: 'running_economy', category: 'cardiorespiratory', subcategory: 'economy', nameEn: 'Running Economy', nameAr: 'اقتصاد الجري', unit: 'ml/kg/km', tier: 'research', lowerIsBetter: true, retestDays: 56 },
  { key: 'critical_speed', category: 'cardiorespiratory', subcategory: 'speed_endurance', nameEn: 'Critical Speed', nameAr: 'السرعة الحرجة', unit: 'm/s', tier: 'research', retestDays: 56 },

  // Strength
  { key: 'isokinetic_knee_profile', category: 'strength', subcategory: 'isokinetic', nameEn: 'Isokinetic Knee Profile', nameAr: 'ملف الركبة الأيزوكينتيك', unit: 'Nm', tier: 'clinical', retestDays: 90 },
  { key: 'handheld_dynamometry', category: 'strength', subcategory: 'dynamometry', nameEn: 'Handheld Dynamometry', nameAr: 'قياس القوة باليد', unit: 'N', tier: 'field', retestDays: 28 },
  { key: 'vbt_load_velocity_profile', category: 'strength', subcategory: 'velocity_based', nameEn: 'VBT Load-Velocity Profile', nameAr: 'ملف الحمل-السرعة VBT', unit: 'm/s', tier: 'research', retestDays: 56 },

  // Power
  { key: 'force_plate_cmj', category: 'power', subcategory: 'force_plate', nameEn: 'Force Plate CMJ', nameAr: 'قفزة CMJ بلوحة القوة', unit: 'cm', tier: 'research', sources: ['force_plate'], retestDays: 14 },
  { key: 'rsi_mod', category: 'power', subcategory: 'reactive_strength', nameEn: 'RSI-mod', nameAr: 'RSI-mod', unit: 'ratio', tier: 'research', retestDays: 14 },
  { key: 'wingate_peak_power', category: 'power', subcategory: 'anaerobic', nameEn: 'Wingate Peak Power', nameAr: 'ذروة قدرة Wingate', unit: 'W/kg', tier: 'professional', retestDays: 56 },
  { key: 'wingate_mean_power', category: 'power', subcategory: 'anaerobic', nameEn: 'Wingate Mean Power', nameAr: 'متوسط قدرة Wingate', unit: 'W/kg', tier: 'professional', retestDays: 56 },
  { key: 'wingate_fatigue_index', category: 'power', subcategory: 'anaerobic', nameEn: 'Wingate Fatigue Index', nameAr: 'مؤشر إجهاد Wingate', unit: '%', tier: 'professional', lowerIsBetter: true, retestDays: 56 },

  // Speed / agility
  { key: 'cod_deficit', category: 'agility', subcategory: 'change_of_direction', nameEn: 'COD Deficit', nameAr: 'عجز تغيير الاتجاه', unit: 's', tier: 'research', lowerIsBetter: true, retestDays: 28 },
  { key: 'rsa_fatigue_index', category: 'speed', subcategory: 'repeated_sprint', nameEn: 'RSA Fatigue Index', nameAr: 'مؤشر إجهاد RSA', unit: '%', tier: 'professional', lowerIsBetter: true, retestDays: 14 },

  // Recovery / fatigue
  { key: 'hooper_index', category: 'recovery', subcategory: 'wellness', nameEn: 'Hooper Index', nameAr: 'مؤشر Hooper', unit: 'score', tier: 'screening', sources: ['questionnaire'], retestDays: 1 },
  { key: 'restq_sport', category: 'recovery', subcategory: 'wellness', nameEn: 'RESTQ-Sport', nameAr: 'RESTQ-Sport', unit: 'score', tier: 'professional', sources: ['questionnaire'], retestDays: 7 },
  { key: 'poms', category: 'recovery', subcategory: 'mood', nameEn: 'POMS', nameAr: 'POMS', unit: 'score', tier: 'research', sources: ['questionnaire'], retestDays: 7 },
  { key: 'tqr', category: 'recovery', subcategory: 'wellness', nameEn: 'TQR', nameAr: 'TQR', unit: 'score', tier: 'field', sources: ['questionnaire'], retestDays: 1 },
  { key: 'cmj_fatigue_monitoring', category: 'fatigue', subcategory: 'neuromuscular', nameEn: 'CMJ Fatigue Monitoring', nameAr: 'مراقبة إجهاد CMJ', unit: 'cm', tier: 'professional', retestDays: 1 },

  // Hydration
  { key: 'urine_specific_gravity', category: 'hydration', subcategory: 'hydration_status', nameEn: 'Urine Specific Gravity', nameAr: 'الكثافة النوعية للبول', unit: 'sg', tier: 'field', retestDays: 1 },
  { key: 'sweat_rate', category: 'hydration', subcategory: 'sweat', nameEn: 'Sweat Rate', nameAr: 'معدل التعرق', unit: 'L/h', tier: 'research', retestDays: 30 },
  { key: 'sweat_sodium', category: 'hydration', subcategory: 'sweat', nameEn: 'Sweat Sodium', nameAr: 'صوديوم العرق', unit: 'mmol/L', tier: 'research', retestDays: 90 },
  { key: 'fluid_loss_percent', category: 'hydration', subcategory: 'hydration_status', nameEn: 'Fluid Loss %', nameAr: 'نسبة فقد السوائل', unit: '%', tier: 'field', lowerIsBetter: true, retestDays: 1 },

  // Nutrition
  { key: 'rmr', category: 'nutrition', subcategory: 'metabolism', nameEn: 'RMR', nameAr: 'معدل الأيض الراحة', unit: 'kcal/day', tier: 'clinical', retestDays: 180 },
  { key: 'tdee', category: 'nutrition', subcategory: 'metabolism', nameEn: 'TDEE', nameAr: 'إجمالي expenditure اليومي', unit: 'kcal/day', tier: 'professional', retestDays: 90 },
  { key: 'energy_availability', category: 'nutrition', subcategory: 'availability', nameEn: 'Energy Availability', nameAr: 'توفر الطاقة', unit: 'kcal/kg/ffm', tier: 'research', retestDays: 28 },
  { key: 'reds_screening', category: 'nutrition', subcategory: 'clinical_screening', nameEn: 'RED-S Screening', nameAr: 'فحص RED-S', unit: 'score', tier: 'clinical', sources: ['questionnaire'], retestDays: 28 },
  { key: 'match_day_carb_plan', category: 'nutrition', subcategory: 'periodization', nameEn: 'Match-Day Carbohydrate Plan', nameAr: 'خطة الكربohydrates يوم المباراة', unit: 'g/kg', tier: 'professional', retestDays: 7 },

  // Sports medicine
  { key: 'scat6', category: 'sports_medicine', subcategory: 'concussion', nameEn: 'SCAT6', nameAr: 'SCAT6', unit: 'score', tier: 'clinical', sources: ['questionnaire'], retestDays: 1 },
  { key: 'ostrc_full', category: 'sports_medicine', subcategory: 'injury_surveillance', nameEn: 'OSTRC-Full', nameAr: 'OSTRC-Full', unit: 'score', tier: 'professional', sources: ['questionnaire'], retestDays: 7 },
  { key: 'less', category: 'sports_medicine', subcategory: 'landing_mechanics', nameEn: 'LESS', nameAr: 'LESS', unit: 'score', tier: 'professional', lowerIsBetter: true, retestDays: 90 },
  { key: 'rtp_functional_battery', category: 'sports_medicine', subcategory: 'return_to_play', nameEn: 'RTP Functional Test Battery', nameAr: 'بطارية RTP الوظيفية', unit: 'score', tier: 'clinical', retestDays: 14 },
  { key: 'pain_scale', category: 'sports_medicine', subcategory: 'symptoms', nameEn: 'Pain Scale', nameAr: 'مقياس الألم', unit: 'score', tier: 'screening', lowerIsBetter: true, retestDays: 1 },
  { key: 'rom_assessment', category: 'sports_medicine', subcategory: 'range_of_motion', nameEn: 'ROM Assessment', nameAr: 'تقييم مدى الحركة', unit: 'deg', tier: 'field', retestDays: 14 },

  // Monitoring
  { key: 'gps_external_load', category: 'monitoring', subcategory: 'external_load', nameEn: 'GPS External Load', nameAr: 'الحمل الخارجي GPS', unit: 'AU', tier: 'professional', sources: ['gps'], retestDays: 1 },
  { key: 'hsr_distance', category: 'monitoring', subcategory: 'external_load', nameEn: 'HSR Distance', nameAr: 'مسافة HSR', unit: 'm', tier: 'professional', sources: ['gps'], retestDays: 1 },
  { key: 'sprint_count', category: 'monitoring', subcategory: 'external_load', nameEn: 'Sprint Count', nameAr: 'عدد Sprint', unit: 'count', tier: 'professional', sources: ['gps'], retestDays: 1 },
  { key: 'acceleration_deceleration_count', category: 'monitoring', subcategory: 'external_load', nameEn: 'Acceleration / Deceleration Count', nameAr: 'عدد التسارع / التباطؤ', unit: 'count', tier: 'professional', sources: ['gps'], retestDays: 1 },
  { key: 'playerload', category: 'monitoring', subcategory: 'external_load', nameEn: 'PlayerLoad', nameAr: 'PlayerLoad', unit: 'AU', tier: 'professional', sources: ['gps', 'wearable'], retestDays: 1 },
  { key: 'training_monotony', category: 'monitoring', subcategory: 'load_monitoring', nameEn: 'Training Monotony', nameAr: 'رتابة التدريب', unit: 'ratio', tier: 'research', retestDays: 7 },
  { key: 'training_strain', category: 'monitoring', subcategory: 'load_monitoring', nameEn: 'Training Strain', nameAr: 'إجهاد التدريب', unit: 'AU', tier: 'research', retestDays: 7 },
];

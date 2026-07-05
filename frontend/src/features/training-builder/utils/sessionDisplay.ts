import type { TrainingDailySession, TrainingPlan, TrainingComplianceSnapshot } from '../types';
import { templateLabelKey } from './templateLabelKey';
import type { TrainingTemplateId } from '../types';

const TEMPLATE_TITLES: Record<TrainingTemplateId, { en: string; ar: string }> = {
  strength: { en: 'Strength', ar: 'قوة' },
  hypertrophy: { en: 'Hypertrophy', ar: 'Hypertrophy' },
  power: { en: 'Power', ar: 'Power' },
  speed: { en: 'Speed', ar: 'سرعة' },
  acceleration: { en: 'Acceleration', ar: 'تسارع' },
  agility: { en: 'Agility', ar: 'Agility' },
  endurance: { en: 'Endurance', ar: 'تحمل' },
  aerobic: { en: 'Aerobic', ar: 'هوائي' },
  anaerobic: { en: 'Anaerobic', ar: 'لاهوائي' },
  recovery: { en: 'Recovery', ar: 'تعافٍ' },
  mobility: { en: 'Mobility', ar: 'حركية' },
  injury_prevention: { en: 'Injury prevention', ar: 'وقاية إصابات' },
  return_to_play: { en: 'Return to play', ar: 'عودة للعب' },
};

export function sessionDisplayTitle(session: TrainingDailySession, locale: 'en' | 'ar'): string {
  return TEMPLATE_TITLES[session.templateId]?.[locale] ?? session.templateId;
}

export function sessionTimelineCopy(session: TrainingDailySession): {
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
} {
  const titleEn = sessionDisplayTitle(session, 'en');
  const titleAr = sessionDisplayTitle(session, 'ar');
  const statusLabel = { completed: 'Completed', skipped: 'Skipped', modified: 'Modified', planned: 'Planned' };
  const statusLabelAr = { completed: 'مكتمل', skipped: 'تخطي', modified: 'معدّل', planned: 'مخطط' };

  if (session.execution) {
    const ex = session.execution;
    return {
      titleEn: `${titleEn} · ${statusLabel[session.status]}`,
      titleAr: `${titleAr} · ${statusLabelAr[session.status]}`,
      subtitleEn: `${ex.actual_duration_min} min · RPE ${ex.actual_rpe} · ${ex.actual_session_load} AU`,
      subtitleAr: `${ex.actual_duration_min} د · RPE ${ex.actual_rpe} · ${ex.actual_session_load} AU`,
    };
  }

  return {
    titleEn: `${titleEn} · ${statusLabel[session.status]}`,
    titleAr: `${titleAr} · ${statusLabelAr[session.status]}`,
    subtitleEn: `${session.duration_min} min · RPE ${session.target_rpe} · planned ${session.session_load} AU`,
    subtitleAr: `${session.duration_min} د · RPE ${session.target_rpe} · مخطط ${session.session_load} AU`,
  };
}

export { templateLabelKey };

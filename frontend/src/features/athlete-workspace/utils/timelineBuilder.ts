import type { RecommendationItem } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest, MockReport, DailyCheckIn, InjuryRecord, TrainingPlan } from '@/src/data/mock/types';
import type { AthleteTimelineEvent } from '../types';

const MOCK_EXTRAS: Record<
  string,
  Omit<AthleteTimelineEvent, 'id' | 'athleteId'>[]
> = {
  '1': [
    {
      type: 'recovery',
      titleEn: 'Cold water immersion protocol',
      titleAr: 'بروتوكول الغمر بالماء البارد',
      subtitleEn: '12 min · subjective recovery +2',
      subtitleAr: '12 د · تعافٍ ذاتي +2',
      date: '2026-07-02',
    },
    {
      type: 'nutrition',
      titleEn: 'Match-day nutrition plan logged',
      titleAr: 'تسجيل خطة تغذية يوم المباراة',
      subtitleEn: 'Carb periodization phase',
      subtitleAr: 'مرحلة توزيع الكربohydrates',
      date: '2026-06-30',
    },
  ],
  '2': [
    {
      type: 'recovery',
      titleEn: 'Sleep hygiene check-in',
      titleAr: 'متابعة نظافة النوم',
      subtitleEn: '7.5 h sleep · HRV stable',
      subtitleAr: '7.5 س نوم · HRV مستقر',
      date: '2026-06-29',
    },
  ],
  '3': [
    {
      type: 'injury',
      titleEn: 'Hamstring strain — grade 1',
      titleAr: 'إجهاد hamstring — درجة 1',
      subtitleEn: 'Return-to-play protocol initiated',
      subtitleAr: 'بدء بروتوكول العودة للعب',
      date: '2026-06-15',
    },
    {
      type: 'recovery',
      titleEn: 'Physio session — eccentric loading',
      titleAr: 'جلسة علاج طبيعي — تحميل eccentric',
      subtitleEn: 'Progressive Nordic progression',
      subtitleAr: 'تقدم Nordic تدريجي',
      date: '2026-07-02',
    },
    {
      type: 'training',
      titleEn: 'Modified upper-body maintenance',
      titleAr: 'صيانة علوية معدّلة',
      subtitleEn: 'Low load · no sprinting',
      subtitleAr: 'حمل منخفض · بدون sprint',
      date: '2026-06-28',
    },
  ],
  '4': [
    {
      type: 'training',
      titleEn: 'Goalkeeper reaction + plyometrics',
      titleAr: 'تفاعل حارس + plyometrics',
      subtitleEn: '60 min · neuromuscular focus',
      subtitleAr: '60 د · تركيز عصبي عضلي',
      date: '2026-07-04',
    },
    {
      type: 'nutrition',
      titleEn: 'Hydration strategy review',
      titleAr: 'مراجعة استراتيجية الترطيب',
      subtitleEn: 'Pre-season electrolyte plan',
      subtitleAr: 'خطة إلكتروليتات ما قبل الموسم',
      date: '2026-06-26',
    },
  ],
};

function testToEvent(test: MockPerformanceTest): AthleteTimelineEvent {
  return {
    id: `test_${test.id}`,
    athleteId: test.athlete_id,
    type: 'test',
    titleEn: test.test_type,
    titleAr: test.test_type,
    subtitleEn: `${test.value} ${test.unit}`,
    subtitleAr: `${test.value} ${test.unit}`,
    date: test.date,
  };
}

function reportToEvent(report: MockReport): AthleteTimelineEvent | null {
  if (!report.athlete_id) return null;
  return {
    id: `report_${report.id}`,
    athleteId: report.athlete_id,
    type: 'report',
    titleEn: report.title,
    titleAr: report.title,
    subtitleEn: report.status,
    subtitleAr: report.status,
    date: report.created_at.slice(0, 10),
  };
}

function recommendationToEvent(rec: RecommendationItem, athleteId: string, index: number): AthleteTimelineEvent {
  return {
    id: `ai_${rec.id}_${index}`,
    athleteId,
    type: 'ai_recommendation',
    titleEn: rec.titleKey,
    titleAr: rec.titleKey,
    subtitleEn: rec.priority,
    subtitleAr: rec.priority,
    date: '2026-07-04',
  };
}

export function buildAthleteTimeline(
  athlete: MockAthlete,
  tests: MockPerformanceTest[],
  reports: MockReport[],
  recommendations: RecommendationItem[],
  latestCheckIn?: DailyCheckIn,
  injuries: InjuryRecord[] = [],
  trainingPlans: TrainingPlan[] = []
): AthleteTimelineEvent[] {
  const athleteTests = tests.filter((t) => t.athlete_id === athlete.id).map(testToEvent);
  const athleteReports = reports
    .filter((r) => r.athlete_id === athlete.id)
    .map(reportToEvent)
    .filter((e): e is AthleteTimelineEvent => e !== null);
  const extras = (MOCK_EXTRAS[athlete.id] ?? []).map((e, i) => ({
    ...e,
    id: `mock_${athlete.id}_${i}`,
    athleteId: athlete.id,
  }));
  const aiEvents = recommendations.slice(0, 2).map((r, i) => recommendationToEvent(r, athlete.id, i));
  const checkInEvents: AthleteTimelineEvent[] = latestCheckIn
    ? [
        {
          id: `checkin_${latestCheckIn.id}`,
          athleteId: athlete.id,
          type: 'recovery',
          titleEn: 'Daily wellness check-in',
          titleAr: 'تسجيل يومي للعافية',
          subtitleEn: `Recovery score context · fatigue ${latestCheckIn.fatigue}/10`,
          subtitleAr: `سياق التعافي · إرهاق ${latestCheckIn.fatigue}/10`,
          date: latestCheckIn.date,
        },
      ]
    : [];

  const injuryEvents: AthleteTimelineEvent[] = injuries
    .filter((i) => i.athlete_id === athlete.id)
    .slice(0, 5)
    .map((inj) => ({
      id: `injury_${inj.id}`,
      athleteId: athlete.id,
      type: 'injury' as const,
      titleEn: `${inj.body_region} injury`,
      titleAr: `إصابة ${inj.body_region}`,
      subtitleEn: `${inj.status} · pain ${inj.pain_level}/10`,
      subtitleAr: `${inj.status} · ألم ${inj.pain_level}/10`,
      date: inj.injury_date,
    }));

  const trainingEvents: AthleteTimelineEvent[] = trainingPlans
    .filter((p) => p.athlete_id === athlete.id)
    .flatMap((p) =>
      p.sessions
        .filter((s) => s.status === 'completed' || s.status === 'planned')
        .slice(0, 6)
        .map((s) => ({
          id: `training_${s.id}`,
          athleteId: athlete.id,
          type: 'training' as const,
          titleEn: s.titleKey,
          titleAr: s.titleKey,
          subtitleEn: `${s.duration_min} min · RPE ${s.target_rpe} · ${s.session_load} AU · ${s.status}`,
          subtitleAr: `${s.duration_min} د · RPE ${s.target_rpe} · ${s.session_load} AU · ${s.status}`,
          date: s.date,
        }))
    );

  return [...injuryEvents, ...trainingEvents, ...checkInEvents, ...athleteTests, ...athleteReports, ...extras, ...aiEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function daysSinceLastInjury(athlete: MockAthlete, timeline: AthleteTimelineEvent[]): number | null {
  const injuryEvents = timeline.filter((e) => e.type === 'injury');
  if (injuryEvents.length > 0) {
    const latest = injuryEvents[0];
    const diff = Date.now() - new Date(latest.date).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }
  if (athlete.status === 'injured') return 14;
  return null;
}

import type { TrainingTemplate, TrainingTemplateId } from '../types';

function ex(
  nameKey: string,
  opts?: { sets?: number; reps?: string; intensityKey?: string; durationMin?: number; restSec?: number }
) {
  return { nameKey, ...opts };
}

const BASE_WARMUP = [
  ex('trainingBuilder.exercises.generalWarmup', { durationMin: 5 }),
  ex('trainingBuilder.exercises.dynamicStretch', { durationMin: 5 }),
];

const BASE_ACTIVATION = [
  ex('trainingBuilder.exercises.gluteBridge', { sets: 2, reps: '12', restSec: 45 }),
  ex('trainingBuilder.exercises.bandWalk', { sets: 2, reps: '10', restSec: 30 }),
];

const BASE_COOLDOWN = [
  ex('trainingBuilder.exercises.easyWalk', { durationMin: 5 }),
  ex('trainingBuilder.exercises.staticStretch', { durationMin: 5 }),
];

function buildTemplate(
  id: TrainingTemplateId,
  labelKey: string,
  focusKey: string,
  mainExercises: ReturnType<typeof ex>[],
  opts?: { defaultDurationMin?: number; defaultRpe?: number }
): TrainingTemplate {
  return {
    id,
    labelKey,
    focusKey,
    warmUp: BASE_WARMUP,
    activation: BASE_ACTIVATION,
    mainExercises,
    coolDown: BASE_COOLDOWN,
    defaultDurationMin: opts?.defaultDurationMin ?? 60,
    defaultRpe: opts?.defaultRpe ?? 6,
  };
}

export const TRAINING_TEMPLATES: Record<TrainingTemplateId, TrainingTemplate> = {
  strength: buildTemplate('strength', 'trainingBuilder.templates.strength', 'trainingBuilder.focus.strength', [
    ex('trainingBuilder.exercises.backSquat', { sets: 4, reps: '5', intensityKey: 'trainingBuilder.intensity.heavy', restSec: 180 }),
    ex('trainingBuilder.exercises.rdl', { sets: 3, reps: '8', intensityKey: 'trainingBuilder.intensity.moderate', restSec: 120 }),
    ex('trainingBuilder.exercises.splitSquat', { sets: 3, reps: '8', restSec: 90 }),
  ], { defaultDurationMin: 65, defaultRpe: 7 }),

  hypertrophy: buildTemplate('hypertrophy', 'trainingBuilder.templates.hypertrophy', 'trainingBuilder.focus.hypertrophy', [
    ex('trainingBuilder.exercises.legPress', { sets: 4, reps: '10-12', intensityKey: 'trainingBuilder.intensity.moderate', restSec: 90 }),
    ex('trainingBuilder.exercises.lunge', { sets: 3, reps: '12', restSec: 60 }),
    ex('trainingBuilder.exercises.calfRaise', { sets: 3, reps: '15', restSec: 45 }),
  ], { defaultDurationMin: 60, defaultRpe: 6 }),

  power: buildTemplate('power', 'trainingBuilder.templates.power', 'trainingBuilder.focus.power', [
    ex('trainingBuilder.exercises.boxJump', { sets: 4, reps: '4', intensityKey: 'trainingBuilder.intensity.max', restSec: 120 }),
    ex('trainingBuilder.exercises.medBallThrow', { sets: 4, reps: '6', restSec: 90 }),
    ex('trainingBuilder.exercises.trapBarJump', { sets: 3, reps: '3', restSec: 150 }),
  ], { defaultDurationMin: 55, defaultRpe: 7 }),

  speed: buildTemplate('speed', 'trainingBuilder.templates.speed', 'trainingBuilder.focus.speed', [
    ex('trainingBuilder.exercises.sprintAccel', { sets: 6, reps: '30m', intensityKey: 'trainingBuilder.intensity.max', restSec: 180 }),
    ex('trainingBuilder.exercises.flyingSprint', { sets: 4, reps: '20m', restSec: 240 }),
  ], { defaultDurationMin: 50, defaultRpe: 8 }),

  acceleration: buildTemplate('acceleration', 'trainingBuilder.templates.acceleration', 'trainingBuilder.focus.acceleration', [
    ex('trainingBuilder.exercises.sledPush', { sets: 5, reps: '15m', intensityKey: 'trainingBuilder.intensity.heavy', restSec: 120 }),
    ex('trainingBuilder.exercises.resistedSprint', { sets: 4, reps: '20m', restSec: 180 }),
  ], { defaultDurationMin: 45, defaultRpe: 7 }),

  agility: buildTemplate('agility', 'trainingBuilder.templates.agility', 'trainingBuilder.focus.agility', [
    ex('trainingBuilder.exercises.coneDrill', { sets: 4, reps: '6', restSec: 90 }),
    ex('trainingBuilder.exercises.cutPattern', { sets: 4, reps: '5', restSec: 120 }),
  ], { defaultDurationMin: 45, defaultRpe: 7 }),

  endurance: buildTemplate('endurance', 'trainingBuilder.templates.endurance', 'trainingBuilder.focus.endurance', [
    ex('trainingBuilder.exercises.tempoRun', { sets: 1, durationMin: 25, intensityKey: 'trainingBuilder.intensity.moderate' }),
    ex('trainingBuilder.exercises.strides', { sets: 4, reps: '100m', restSec: 60 }),
  ], { defaultDurationMin: 55, defaultRpe: 6 }),

  aerobic: buildTemplate('aerobic', 'trainingBuilder.templates.aerobic', 'trainingBuilder.focus.aerobic', [
    ex('trainingBuilder.exercises.steadyRun', { sets: 1, durationMin: 35, intensityKey: 'trainingBuilder.intensity.easy' }),
    ex('trainingBuilder.exercises.bikeZone2', { sets: 1, durationMin: 20, intensityKey: 'trainingBuilder.intensity.easy' }),
  ], { defaultDurationMin: 60, defaultRpe: 5 }),

  anaerobic: buildTemplate('anaerobic', 'trainingBuilder.templates.anaerobic', 'trainingBuilder.focus.anaerobic', [
    ex('trainingBuilder.exercises.intervalSprint', { sets: 8, reps: '30s', intensityKey: 'trainingBuilder.intensity.max', restSec: 90 }),
    ex('trainingBuilder.exercises.shuttleRepeat', { sets: 6, reps: '20m', restSec: 60 }),
  ], { defaultDurationMin: 40, defaultRpe: 8 }),

  recovery: buildTemplate('recovery', 'trainingBuilder.templates.recovery', 'trainingBuilder.focus.recovery', [
    ex('trainingBuilder.exercises.poolWalk', { sets: 1, durationMin: 20, intensityKey: 'trainingBuilder.intensity.easy' }),
    ex('trainingBuilder.exercises.lightBike', { sets: 1, durationMin: 15, intensityKey: 'trainingBuilder.intensity.easy' }),
  ], { defaultDurationMin: 40, defaultRpe: 3 }),

  mobility: buildTemplate('mobility', 'trainingBuilder.templates.mobility', 'trainingBuilder.focus.mobility', [
    ex('trainingBuilder.exercises.hipFlow', { sets: 1, durationMin: 15 }),
    ex('trainingBuilder.exercises.thoracicMob', { sets: 1, durationMin: 10 }),
    ex('trainingBuilder.exercises.ankleMob', { sets: 2, reps: '12', restSec: 30 }),
  ], { defaultDurationMin: 35, defaultRpe: 3 }),

  injury_prevention: buildTemplate(
    'injury_prevention',
    'trainingBuilder.templates.injuryPrevention',
    'trainingBuilder.focus.injuryPrevention',
    [
      ex('trainingBuilder.exercises.nordic', { sets: 3, reps: '5', restSec: 90 }),
      ex('trainingBuilder.exercises.singleLegBalance', { sets: 3, reps: '30s', restSec: 45 }),
      ex('trainingBuilder.exercises.copenhagen', { sets: 3, reps: '8', restSec: 60 }),
    ],
    { defaultDurationMin: 40, defaultRpe: 4 }
  ),

  return_to_play: buildTemplate('return_to_play', 'trainingBuilder.templates.returnToPlay', 'trainingBuilder.focus.returnToPlay', [
    ex('trainingBuilder.exercises.submaxRun', { sets: 4, reps: '60m', intensityKey: 'trainingBuilder.intensity.moderate', restSec: 120 }),
    ex('trainingBuilder.exercises.cutProgression', { sets: 3, reps: '4', restSec: 90 }),
    ex('trainingBuilder.exercises.landingMechanics', { sets: 3, reps: '6', restSec: 60 }),
  ], { defaultDurationMin: 50, defaultRpe: 5 }),
};

export const WEEKDAY_ORDER: Array<{ id: import('../types').WeekdayId; labelKey: string }> = [
  { id: 'monday', labelKey: 'trainingBuilder.days.monday' },
  { id: 'tuesday', labelKey: 'trainingBuilder.days.tuesday' },
  { id: 'wednesday', labelKey: 'trainingBuilder.days.wednesday' },
  { id: 'thursday', labelKey: 'trainingBuilder.days.thursday' },
  { id: 'friday', labelKey: 'trainingBuilder.days.friday' },
  { id: 'saturday', labelKey: 'trainingBuilder.days.saturday' },
  { id: 'sunday', labelKey: 'trainingBuilder.days.sunday' },
];

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { CheckInSliderField } from '@/src/features/daily-checkin/components/CheckInSliderField';
import { findSessionInPlans, sessionDisplayTitle } from '@/src/features/training-builder';
import type { SessionStatus, TrainingSessionLogInput } from '@/src/features/training-builder/types';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useFormAction } from '@/src/hooks/useFormAction';

const EXEC_STATUSES: Array<Exclude<SessionStatus, 'planned'>> = ['completed', 'skipped', 'modified'];

function StatusChipRow({
  value,
  onChange,
}: {
  value: Exclude<SessionStatus, 'planned'>;
  onChange: (v: Exclude<SessionStatus, 'planned'>) => void;
}) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
      {EXEC_STATUSES.map((status) => {
        const active = status === value;
        return (
          <TouchableOpacity
            key={status}
            onPress={() => onChange(status)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: active ? theme.colors.primary : theme.colors.surface,
              borderWidth: 1,
              borderColor: active ? theme.colors.primary : theme.colors.border,
            }}
          >
            <Text style={[type.caption, { color: active ? '#FFF' : theme.colors.text }]}>
              {t(`trainingBuilder.execution.status.${status}`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function LogTrainingSessionScreen() {
  const { sessionId, athleteId: athleteIdParam } = useLocalSearchParams<{ sessionId: string; athleteId?: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const logTrainingSession = useMockStore((s) => s.logTrainingSession);
  const { loading, success, run } = useFormAction();

  const match = useMemo(() => findSessionInPlans(trainingPlans, sessionId ?? ''), [trainingPlans, sessionId]);
  const session = match?.session;
  const plan = match?.plan;

  const [status, setStatus] = useState<Exclude<SessionStatus, 'planned'>>('completed');
  const [duration, setDuration] = useState(String(session?.duration_min ?? 60));
  const [rpe, setRpe] = useState(String(session?.target_rpe ?? 6));
  const [fatigue, setFatigue] = useState(5);
  const [pain, setPain] = useState(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!session) return;
    setDuration(String(session.execution?.actual_duration_min ?? session.duration_min));
    setRpe(String(session.execution?.actual_rpe ?? session.target_rpe));
    setFatigue(session.execution?.post_session_fatigue ?? 5);
    setPain(session.execution?.post_session_pain ?? 2);
    setNotes(session.execution?.notes ?? '');
    if (session.status !== 'planned') setStatus(session.status);
  }, [session]);

  if (!session || !plan) {
    return (
      <FeatureScrollScreen title={t('trainingBuilder.execution.title')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const title = sessionDisplayTitle(session, locale);
  const loadPreview = status === 'skipped' ? 0 : Number(duration || 0) * Number(rpe || 0);

  const handleSubmit = () => {
    const input: TrainingSessionLogInput = {
      status,
      actual_duration_min: status === 'skipped' ? 0 : Number(duration) || session.duration_min,
      actual_rpe: status === 'skipped' ? 0 : Number(rpe) || session.target_rpe,
      post_session_fatigue: fatigue,
      post_session_pain: pain,
      notes: notes.trim() || undefined,
    };
    run(() => {
      logTrainingSession(plan.id, session.id, input);
      if (athleteIdParam) {
        router.replace(APP_ROUTES.athleteDetail(athleteIdParam));
      } else {
        router.replace(APP_ROUTES.trainingBuilder(plan.athlete_id));
      }
    });
  };

  return (
    <FeatureScrollScreen title={t('trainingBuilder.execution.title')} subtitle={title}>
      <SuccessBanner visible={success} message={t('trainingBuilder.execution.success')} />

      <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
        {session.date} · {t('trainingBuilder.execution.plannedLoad', { load: session.session_load })}
      </Text>

      <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {t('trainingBuilder.execution.outcome')}
      </Text>
      <StatusChipRow value={status} onChange={setStatus} />

      {status !== 'skipped' ? (
        <View style={{ marginTop: theme.spacing.lg, gap: theme.spacing.md }}>
          <Input
            label={t('trainingBuilder.execution.duration')}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
          <Input label={t('trainingBuilder.execution.rpe')} value={rpe} onChangeText={setRpe} keyboardType="numeric" />
          <Text style={[type.caption, { color: theme.colors.primary, textAlign: textAlign('start') }]}>
            {t('trainingBuilder.execution.actualLoad', { load: loadPreview })}
          </Text>
        </View>
      ) : null}

      <View style={{ marginTop: theme.spacing.lg }}>
        <CheckInSliderField label={t('trainingBuilder.execution.postFatigue')} value={fatigue} onChange={setFatigue} minimumValue={1} maximumValue={10} />
        <CheckInSliderField label={t('trainingBuilder.execution.postPain')} value={pain} onChange={setPain} minimumValue={0} maximumValue={10} />
      </View>

      <Input
        label={t('trainingBuilder.execution.notes')}
        value={notes}
        onChangeText={setNotes}
        multiline
        style={{ marginTop: theme.spacing.md, minHeight: 80 }}
      />

      <Button title={t('trainingBuilder.execution.save')} onPress={handleSubmit} loading={loading} style={{ marginTop: theme.spacing.xl }} />
    </FeatureScrollScreen>
  );
}

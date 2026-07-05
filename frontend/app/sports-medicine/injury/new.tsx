import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { CheckInSliderField } from '@/src/features/daily-checkin/components/CheckInSliderField';
import type { BodyRegion, InjuryRecordInput, InjurySeverity, InjuryStatus, RTPPhaseId, TissueType } from '@/src/features/sports-medicine/types';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useFormAction } from '@/src/hooks/useFormAction';

const REGIONS: BodyRegion[] = ['hamstring', 'knee', 'ankle', 'groin', 'shoulder', 'back', 'hip', 'calf', 'other'];
const TISSUES: TissueType[] = ['muscle', 'ligament', 'tendon', 'bone', 'joint', 'other'];
const SEVERITIES: InjurySeverity[] = ['grade_1', 'grade_2', 'grade_3'];
const STATUSES: InjuryStatus[] = ['active', 'rehab', 'return_to_play', 'resolved'];
const RTP: RTPPhaseId[] = ['phase_1', 'phase_2', 'phase_3', 'phase_4', 'phase_5', 'ready'];

function ChipRow<T extends string>({ options, value, onChange, labelPrefix }: { options: T[]; value: T; onChange: (v: T) => void; labelPrefix: string }) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: active ? theme.colors.primary : theme.colors.surface,
              borderWidth: 1,
              borderColor: active ? theme.colors.primary : theme.colors.border,
            }}
          >
            <Text style={[type.caption, { color: active ? '#FFF' : theme.colors.text }]}>{t(`${labelPrefix}.${opt}`)}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function AddInjuryScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athletes = useMockStore((s) => s.athletes);
  const addInjuryRecord = useMockStore((s) => s.addInjuryRecord);
  const { loading, success, run } = useFormAction();

  const [athleteId, setAthleteId] = useState(athleteIdParam ?? athletes[0]?.id ?? '');
  const [bodyRegion, setBodyRegion] = useState<BodyRegion>('hamstring');
  const [tissueType, setTissueType] = useState<TissueType>('muscle');
  const [severity, setSeverity] = useState<InjurySeverity>('grade_1');
  const [status, setStatus] = useState<InjuryStatus>('active');
  const [rtpPhase, setRtpPhase] = useState<RTPPhaseId>('phase_1');
  const [pain, setPain] = useState(4);
  const [swelling, setSwelling] = useState(3);
  const [rom, setRom] = useState(3);
  const [absenceDays, setAbsenceDays] = useState(14);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (athleteIdParam) setAthleteId(athleteIdParam);
  }, [athleteIdParam]);

  const handleSubmit = () => {
    if (!athleteId) return;
    const input: InjuryRecordInput = {
      athlete_id: athleteId,
      injury_date: new Date().toISOString().slice(0, 10),
      body_region: bodyRegion,
      tissue_type: tissueType,
      severity_grade: severity,
      pain_level: pain,
      swelling,
      rom_limitation: rom,
      status,
      expected_absence_days: absenceDays,
      rtp_phase: rtpPhase,
      notes: notes.trim() || undefined,
    };
    run(() => {
      addInjuryRecord(input);
      setTimeout(() => router.replace(APP_ROUTES.sportsMedicine(athleteId)), 600);
    });
  };

  return (
    <FeatureScrollScreen title={t('sportsMedicine.addInjuryTitle')} subtitle={t('sportsMedicine.addInjurySubtitle')}>
      {success ? <SuccessBanner message={t('sportsMedicine.addInjurySuccess')} visible={success} /> : null}
      <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>{t('dailyCheckIn.selectAthlete')}</Text>
      <AthleteSelectorChips athletes={athletes} selectedId={athleteId} onSelect={setAthleteId} />

      <Text style={[type.label, { color: theme.colors.textSecondary, marginTop: theme.spacing.lg, marginBottom: 8 }]}>{t('sportsMedicine.fields.region')}</Text>
      <ChipRow options={REGIONS} value={bodyRegion} onChange={setBodyRegion} labelPrefix="sportsMedicine.regions" />

      <Text style={[type.label, { color: theme.colors.textSecondary, marginTop: theme.spacing.md, marginBottom: 8 }]}>{t('sportsMedicine.fields.tissue')}</Text>
      <ChipRow options={TISSUES} value={tissueType} onChange={setTissueType} labelPrefix="sportsMedicine.tissue" />

      <Text style={[type.label, { color: theme.colors.textSecondary, marginTop: theme.spacing.md, marginBottom: 8 }]}>{t('sportsMedicine.fields.severity')}</Text>
      <ChipRow options={SEVERITIES} value={severity} onChange={setSeverity} labelPrefix="sportsMedicine.severity" />

      <CheckInSliderField label={t('sportsMedicine.pain')} value={pain} onChange={(v) => setPain(Math.round(v))} minimumValue={0} maximumValue={10} />
      <CheckInSliderField label={t('sportsMedicine.swelling')} value={swelling} onChange={(v) => setSwelling(Math.round(v))} minimumValue={0} maximumValue={10} />
      <CheckInSliderField label={t('sportsMedicine.rom')} value={rom} onChange={(v) => setRom(Math.round(v))} minimumValue={0} maximumValue={10} />
      <CheckInSliderField label={t('sportsMedicine.fields.absenceDays')} value={absenceDays} onChange={(v) => setAbsenceDays(Math.round(v))} minimumValue={0} maximumValue={90} />

      <Text style={[type.label, { color: theme.colors.textSecondary, marginTop: theme.spacing.md, marginBottom: 8 }]}>{t('sportsMedicine.fields.status')}</Text>
      <ChipRow options={STATUSES} value={status} onChange={setStatus} labelPrefix="sportsMedicine.status" />

      <Text style={[type.label, { color: theme.colors.textSecondary, marginTop: theme.spacing.md, marginBottom: 8 }]}>{t('sportsMedicine.fields.rtpPhase')}</Text>
      <ChipRow options={RTP} value={rtpPhase} onChange={setRtpPhase} labelPrefix="sportsMedicine.rtp" />

      <Input label={t('dailyCheckIn.fields.notes')} value={notes} onChangeText={setNotes} multiline numberOfLines={3} style={{ marginTop: theme.spacing.md }} />
      <View style={{ marginTop: theme.spacing.lg }}>
        <Button title={t('sportsMedicine.saveInjury')} onPress={handleSubmit} loading={loading} fullWidth icon="medkit" />
      </View>
    </FeatureScrollScreen>
  );
}

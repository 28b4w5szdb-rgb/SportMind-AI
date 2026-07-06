/**
 * SportMind AI - Athletes Screen
 * Premium athlete management interface with responsive design for web/tablet/mobile
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { Chip } from '@/src/components/common/Chip';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ReadinessScore } from '@/src/components/features/ReadinessScore';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { MockAthlete } from '@/src/data/mock/types';
import { computeReadinessScore, readinessLabel } from '@/src/utils/athleteMetrics';

const filterChips = [
  { id: 'all', labelEn: 'All', labelAr: 'الكل' },
  { id: 'active', labelEn: 'Active', labelAr: 'نشط' },
  { id: 'injured', labelEn: 'Injured', labelAr: 'مصاب' },
  { id: 'rest', labelEn: 'Rest', labelAr: 'راحة' },
];

export default function AthletesScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const athletes = useMockStore((s) => s.athletes);
  const { width: windowWidth } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const isWeb = Platform.OS === 'web';
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const gridConfig = useMemo(() => {
    if (isDesktop) return { columns: 3, cardWidth: 380 };
    if (isTablet) return { columns: 2, cardWidth: 300 };
    return { columns: 1, cardWidth: windowWidth - 32 };
  }, [windowWidth, isDesktop, isTablet]);

  const filteredAthletes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return athletes.filter((a) => {
      const matchesFilter = selectedFilter === 'all' || a.status === selectedFilter;
      if (!matchesFilter) return false;
      if (!query) return true;
      const name = `${a.first_name} ${a.last_name}`.toLowerCase();
      return name.includes(query) || a.position.toLowerCase().includes(query);
    });
  }, [selectedFilter, searchQuery, athletes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'injured':
        return theme.colors.warning;
      case 'rest':
        return theme.colors.info;
      default:
        return theme.colors.textTertiary;
    }
  };

  const getRiskLevel = (item: MockAthlete): 'low' | 'medium' | 'high' => {
    if (item.status === 'injured') return 'high';
    if (item.trend_percent < 0) return 'medium';
    return 'low';
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    if (risk === 'high') return theme.colors.error;
    if (risk === 'medium') return theme.colors.warning;
    return theme.colors.success;
  };

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: athletes.length };
    filterChips.forEach((chip) => {
      if (chip.id !== 'all') counts[chip.id] = athletes.filter((a) => a.status === chip.id).length;
    });
    return counts;
  }, [athletes]);

  const renderAthlete = ({ item }: { item: MockAthlete }) => {
    const statusColor = getStatusColor(item.status);
    const fullName = `${item.first_name} ${item.last_name}`;
    const initials = `${item.first_name[0] ?? ''}${item.last_name[0] ?? ''}`.toUpperCase();
    const risk = getRiskLevel(item);
    const riskColor = getRiskColor(risk);
    const readiness = computeReadinessScore(item);
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={{ flex: 1, maxWidth: gridConfig.cardWidth }}
        onPress={() => router.push(APP_ROUTES.athleteDetail(item.id))}
      >
        <Card
          variant="elevated"
          padding="lg"
          style={{
            borderRadius: theme.borderRadius['2xl'],
            marginBottom: theme.spacing[3],
            borderStartWidth: risk === 'high' ? 3 : 0,
            borderStartColor: riskColor,
          }}
        >
          <View style={[styles.athleteRow, { flexDirection: flexRow(true) }]}>
            <LinearGradient
              colors={['#0066FF', '#0D9488']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.athleteAvatar,
                { borderRadius: theme.borderRadius.xl },
              ]}
            >
              <Text style={[type.label, { color: '#FFF', fontWeight: '700' }]}>{initials}</Text>
            </LinearGradient>
            <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8 }}>
                <Text style={[type.h5, { color: theme.colors.text, flex: 1 }]}>{fullName}</Text>
                {item.jersey_number != null && (
                  <View style={[styles.jerseyBadge, { backgroundColor: theme.colors.backgroundSecondary, borderRadius: theme.borderRadius.sm }]}>
                    <Text style={[type.caption, { color: theme.colors.textSecondary, fontWeight: '700' }]}>#{item.jersey_number}</Text>
                  </View>
                )}
              </View>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                {item.position}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusColor + '15',
                    borderRadius: theme.borderRadius.full,
                  },
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: statusColor, borderRadius: 4 }]} />
                <Text style={[type.caption, { color: statusColor, marginStart: 6 }]}>
                  {isRTL
                    ? filterChips.find((f) => f.id === item.status)?.labelAr
                    : filterChips.find((f) => f.id === item.status)?.labelEn}
                </Text>
              </View>
              <View style={[styles.riskBadge, { backgroundColor: riskColor + '15', borderRadius: theme.borderRadius.sm }]}>
                <Ionicons name="shield" size={12} color={riskColor} />
                <Text style={[type.caption, { color: riskColor, marginStart: 4, fontSize: 10 }]}>
                  {risk === 'high' ? (isRTL ? 'خطر' : 'Risk') : risk === 'medium' ? (isRTL ? 'انتباه' : 'Watch') : (isRTL ? 'جيد' : 'OK')}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.athleteStats, { flexDirection: flexRow(true), marginTop: theme.spacing[4], alignItems: 'center' }]}>
            <ReadinessScore score={readiness} label={readinessLabel(readiness, isRTL)} size="sm" />
            <View style={[styles.statItem, { flex: 1, marginStart: theme.spacing[3] }]}>
              <Text style={[type.numberSm, { color: theme.colors.text }]}>{item.tests_count}</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
                {isRTL ? 'الاختبارات' : 'Tests'}
              </Text>
            </View>
            <View style={[styles.statItem, { borderStartWidth: 1, borderStartColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[type.numberSm, { color: theme.colors.text }]}>8</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
                {isRTL ? 'الجلسات' : 'Sessions'}
              </Text>
            </View>
            <View style={[styles.statItem, { borderStartWidth: 1, borderStartColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[type.numberSm, { color: item.trend_percent >= 0 ? theme.colors.success : theme.colors.warning }]}>
                {item.trend_percent > 0 ? '+' : ''}{item.trend_percent}%
              </Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
                {isRTL ? 'التحسن' : 'Progress'}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
            paddingTop: isDesktop ? theme.spacing[8] : theme.spacing[5],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <View style={[styles.headerRow, { flexDirection: flexRow(true) }]}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  type.overline,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: textAlign('start'),
                    letterSpacing: 2,
                  },
                ]}
              >
                {(isRTL ? 'إدارة الرياضيين' : 'TEAM MANAGEMENT').toUpperCase()}
              </Text>
              <Text
                style={[
                  type.displaySmall,
                  {
                    color: theme.colors.text,
                    textAlign: textAlign('start'),
                    marginTop: theme.spacing[1],
                  },
                ]}
              >
                {t('athletes.title')}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.athleteAdd)}>
              <LinearGradient
                colors={['#0066FF', '#0D9488']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.addButton,
                  { borderRadius: theme.borderRadius.lg },
                ]}
              >
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
            marginTop: theme.spacing[4],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card
            variant="outlined"
            padding="none"
            style={{ borderRadius: theme.borderRadius.xl }}
          >
            <View style={[styles.searchContainer, { flexDirection: flexRow(true) }]}>
              <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    textAlign: textAlign('start'),
                    writingDirection: isRTL ? 'rtl' : 'ltr',
                    color: theme.colors.text,
                  },
                ]}
                placeholder={isRTL ? 'بحث عن رياضي...' : 'Search athletes...'}
                placeholderTextColor={theme.colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </View>

        {/* Filter Chips */}
        <View
          style={{
            paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
            marginTop: theme.spacing[3],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing[2] }}
          >
            {filterChips.map((chip) => (
              <Chip
                key={chip.id}
                label={`${isRTL ? chip.labelAr : chip.labelEn} (${filterCounts[chip.id] ?? 0})`}
                selected={selectedFilter === chip.id}
                onPress={() => setSelectedFilter(chip.id)}
                variant="solid"
                size="sm"
              />
            ))}
          </ScrollView>
        </View>

        {/* Stats Summary */}
        <View
          style={{
            paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
            marginTop: theme.spacing[5],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card
            variant="filled"
            padding="none"
            style={{ borderRadius: theme.borderRadius['2xl'] }}
          >
            <LinearGradient
              colors={['#0066FF08', '#0D948808']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: theme.spacing[4] }}
            >
              <View style={[styles.statsSummary, { flexDirection: flexRow(true) }]}>
                <View style={styles.summaryItem}>
                  <Text style={[type.numberMedium, { color: theme.colors.text }]}>
                    {athletes.length}
                  </Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                    {isRTL ? 'نشط' : 'Active'}
                  </Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[type.numberMedium, { color: theme.colors.warning }]}>1</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                    {isRTL ? 'مصاب' : 'Injured'}
                  </Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[type.numberMedium, { color: theme.colors.info }]}>1</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                    {isRTL ? 'راحة' : 'Rest'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* Athletes List */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
            marginTop: theme.spacing[4],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          {filteredAthletes.length > 0 ? (
            <FlatList
              data={filteredAthletes}
              renderItem={renderAthlete}
              keyExtractor={(item) => item.id}
              numColumns={gridConfig.columns}
              contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={gridConfig.columns > 1 ? { gap: theme.spacing[3] } : undefined}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', paddingVertical: theme.spacing[12] }}>
              <EmptyState
                icon="people-outline"
                title={t('athletes.empty.title')}
                description={t('athletes.empty.description')}
                actionLabel={t('actions.addAthlete')}
                onAction={() => router.push(APP_ROUTES.athleteAdd)}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerRow: {
    alignItems: 'center',
    gap: 16,
  },
  addButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  statsSummary: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  athleteRow: {
    alignItems: 'center',
  },
  athleteAvatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jerseyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
  },
  athleteStats: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

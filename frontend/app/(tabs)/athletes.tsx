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

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const filterChips = [
  { id: 'all', labelEn: 'All', labelAr: 'الكل' },
  { id: 'active', labelEn: 'Active', labelAr: 'نشط' },
  { id: 'injured', labelEn: 'Injured', labelAr: 'مصاب' },
  { id: 'rest', labelEn: 'Rest', labelAr: 'راحة' },
];

const sampleAthletes = [
  { id: '1', name: 'Ahmed Hassan', position: 'Forward', status: 'active', avatar: null },
  { id: '2', name: 'Mohammed Ali', position: 'Midfielder', status: 'active', avatar: null },
  { id: '3', name: 'Omar Farouk', position: 'Defender', status: 'injured', avatar: null },
  { id: '4', name: 'Yusuf Ibrahim', position: 'Goalkeeper', status: 'rest', avatar: null },
];

export default function AthletesScreen() {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
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
    return sampleAthletes.filter((a) => {
      const matchesFilter = selectedFilter === 'all' || a.status === selectedFilter;
      if (!matchesFilter) return false;
      if (!query) return true;
      return (
        a.name.toLowerCase().includes(query) ||
        a.position.toLowerCase().includes(query)
      );
    });
  }, [selectedFilter, searchQuery]);

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

  const renderAthlete = ({ item }: { item: typeof sampleAthletes[0] }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity activeOpacity={0.85} style={{ flex: 1, maxWidth: gridConfig.cardWidth }}>
        <Card
          variant="elevated"
          padding="lg"
          style={{
            borderRadius: theme.borderRadius['2xl'],
            marginBottom: theme.spacing[3],
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
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ flex: 1, marginHorizontal: theme.spacing[3] }}>
              <Text style={[type.h5, { color: theme.colors.text }]}>{item.name}</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                {item.position}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColor + '15',
                  borderRadius: theme.borderRadius.full,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusColor, borderRadius: 4 },
                ]}
              />
              <Text style={[type.caption, { color: statusColor, marginLeft: 6 }]}>
                {isRTL
                  ? filterChips.find((f) => f.id === item.status)?.labelAr
                  : filterChips.find((f) => f.id === item.status)?.labelEn}
              </Text>
            </View>
          </View>
          <View style={[styles.athleteStats, { flexDirection: flexRow(true), marginTop: theme.spacing[4] }]}>
            <View style={styles.statItem}>
              <Text style={[type.numberSm, { color: theme.colors.text }]}>24</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
                {isRTL ? 'الاختبارات' : 'Tests'}
              </Text>
            </View>
            <View style={[styles.statItem, { borderLeftWidth: 1, borderLeftColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[type.numberSm, { color: theme.colors.text }]}>8</Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
                {isRTL ? 'الجلسات' : 'Sessions'}
              </Text>
            </View>
            <View style={[styles.statItem, { borderLeftWidth: 1, borderLeftColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[type.numberSm, { color: theme.colors.success }]}>+12%</Text>
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
            <TouchableOpacity activeOpacity={0.85}>
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
              <TouchableOpacity
                key={chip.id}
                onPress={() => setSelectedFilter(chip.id)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor:
                        selectedFilter === chip.id
                          ? theme.colors.primary
                          : theme.colors.backgroundSecondary,
                      borderRadius: theme.borderRadius.full,
                      borderWidth: selectedFilter === chip.id ? 0 : 1,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      type.label,
                      {
                        color:
                          selectedFilter === chip.id
                            ? '#FFFFFF'
                            : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {isRTL ? chip.labelAr : chip.labelEn}
                  </Text>
                </View>
              </TouchableOpacity>
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
                    {sampleAthletes.length}
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
              <Card
                variant="filled"
                padding="xl"
                style={{ borderRadius: theme.borderRadius['2xl'] }}
              >
                <View style={styles.emptyContent}>
                  <View
                    style={[
                      styles.emptyIcon,
                      {
                        backgroundColor: theme.colors.primary + '15',
                        borderRadius: theme.borderRadius['3xl'],
                      },
                    ]}
                  >
                    <Ionicons name="people-outline" size={48} color={theme.colors.primary} />
                  </View>
                  <Text
                    style={[
                      type.h4,
                      {
                        color: theme.colors.text,
                        marginTop: theme.spacing[5],
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {t('athletes.empty.title')}
                  </Text>
                  <Text
                    style={[
                      type.body,
                      {
                        color: theme.colors.textSecondary,
                        textAlign: 'center',
                        marginTop: theme.spacing[2],
                      },
                    ]}
                  >
                    {t('athletes.empty.description')}
                  </Text>
                  <Button
                    title={isRTL ? 'إضافة رياضي' : 'Add Athlete'}
                    variant="primary"
                    size="large"
                    icon="person-add"
                    onPress={() => console.log('Add athlete')}
                    style={{ marginTop: theme.spacing[6] }}
                    fullWidth
                  />
                </View>
              </Card>
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

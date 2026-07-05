/**
 * SportMind AI - Athletes Screen
 * Premium athlete management interface with search, filters, and empty state
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Button } from '@/src/components/common/Button';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const filterChips = [
  { id: 'all', labelEn: 'All', labelAr: 'الكل' },
  { id: 'active', labelEn: 'Active', labelAr: 'نشط' },
  { id: 'injured', labelEn: 'Injured', labelAr: 'مصاب' },
  { id: 'rest', labelEn: 'Rest', labelAr: 'راحة' },
];

export default function AthletesScreen() {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Header */}
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[5] }}>
          <View
            style={[
              styles.headerRow,
              { flexDirection: flexRow(true) },
            ]}
          >
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
                {(isRTL ? 'الرياضيون' : 'TEAM MANAGEMENT').toUpperCase()}
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
            <TouchableOpacity activeOpacity={0.8}>
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
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[4] }}>
          <Card
            variant="outlined"
            padding="none"
            style={{ borderRadius: theme.borderRadius.xl }}
          >
            <View
              style={[
                styles.searchContainer,
                { flexDirection: flexRow(true) },
              ]}
            >
              <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    textAlign: textAlign('start'),
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
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[3] }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filterChips.map((chip) => (
              <TouchableOpacity
                key={chip.id}
                onPress={() => setSelectedFilter(chip.id)}
                activeOpacity={0.8}
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
            paddingHorizontal: theme.spacing[4],
            marginTop: theme.spacing[5],
          }}
        >
          <View
            style={[
              styles.statsSummary,
              { flexDirection: flexRow(true) },
            ]}
          >
            <View style={styles.statItem}>
              <Text
                style={[
                  type.numberMedium,
                  { color: theme.colors.text },
                ]}
              >
                0
              </Text>
              <Text
                style={[
                  type.caption,
                  { color: theme.colors.textSecondary, marginTop: 2 },
                ]}
              >
                {isRTL ? 'النشطون' : 'Active'}
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text
                style={[
                  type.numberMedium,
                  { color: theme.colors.warning },
                ]}
              >
                0
              </Text>
              <Text
                style={[
                  type.caption,
                  { color: theme.colors.textSecondary, marginTop: 2 },
                ]}
              >
                {isRTL ? 'المصابون' : 'Injured'}
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statItem}>
              <Text
                style={[
                  type.numberMedium,
                  { color: theme.colors.info },
                ]}
              >
                0
              </Text>
              <Text
                style={[
                  type.caption,
                  { color: theme.colors.textSecondary, marginTop: 2 },
                ]}
              >
                {isRTL ? 'في راحة' : 'Resting'}
              </Text>
            </View>
          </View>
        </View>

        {/* Empty State */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: theme.spacing[4] }}>
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
  filtersContainer: {
    gap: 10,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  statsSummary: {
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
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

import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Input } from '@/src/components/common/Input';
import { Button } from '@/src/components/common/Button';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { TESTING_CATEGORIES } from '../registry/categories';
import { TEST_OBJECTIVES } from '../registry/objectives';
import type { TestCategoryId, TestLibraryFilters, TestObjective } from '../types';

interface TestLibraryFiltersBarProps {
  filters: TestLibraryFilters;
  onChange: (next: Partial<TestLibraryFilters>) => void;
}

export function TestLibraryFiltersBar({ filters, onChange }: TestLibraryFiltersBarProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { flexRow, isRTL } = useDirection();

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Input
        label={t('testingCenter.library.search')}
        value={filters.query}
        onChangeText={(query) => onChange({ query })}
        placeholder={t('testingCenter.library.searchPlaceholder')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: theme.spacing.sm }}>
        <Button
          title={t('testingCenter.library.allCategories')}
          size="small"
          variant={filters.categoryId === 'all' ? 'primary' : 'outline'}
          onPress={() => onChange({ categoryId: 'all' })}
        />
        {TESTING_CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            title={t(cat.nameKey)}
            size="small"
            variant={filters.categoryId === cat.id ? 'secondary' : 'outline'}
            onPress={() => onChange({ categoryId: cat.id as TestCategoryId })}
          />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: theme.spacing.sm }}>
        <Button
          title={t('testingCenter.library.allObjectives')}
          size="small"
          variant={filters.objective === 'all' ? 'primary' : 'outline'}
          onPress={() => onChange({ objective: 'all' })}
        />
        {TEST_OBJECTIVES.map((obj) => (
          <Button
            key={obj.id}
            title={t(obj.labelKey)}
            size="small"
            variant={filters.objective === obj.id ? 'secondary' : 'outline'}
            onPress={() => onChange({ objective: obj.id as TestObjective })}
          />
        ))}
        <Button
          title={t('testingCenter.library.favoritesOnly')}
          size="small"
          variant={filters.favoritesOnly ? 'primary' : 'outline'}
          onPress={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
          icon={filters.favoritesOnly ? 'star' : 'star-outline'}
        />
      </ScrollView>
    </View>
  );
}

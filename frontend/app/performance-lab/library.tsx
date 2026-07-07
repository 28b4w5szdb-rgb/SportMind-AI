import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import {
  TestLibraryFiltersBar,
  TestLibraryListItem,
  useTestLibraryActions,
} from '@/src/features/performance-lab';
import { useScientificTestLibrary } from '@/src/features/performance-lab/bridge';
import type { TestLibraryFilters } from '@/src/features/performance-lab/types';

export default function TestLibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const favorites = useMockStore((s) => s.favoriteTestKeys);
  const { toggleFavorite, pushRecent } = useTestLibraryActions();

  const [filters, setFilters] = useState<TestLibraryFilters>({
    query: '',
    categoryId: 'all',
    objective: 'all',
    favoritesOnly: false,
    evidenceTier: 'all',
    usabilityMode: 'all',
  });

  const { items, favoriteItems, recentItems, totalCount, loading, readErrorKey } =
    useScientificTestLibrary(filters);

  const openTest = (key: string) => {
    pushRecent(key);
    router.push(APP_ROUTES.performanceLabTest(key));
  };

  return (
    <FeatureScrollScreen title={t('testingCenter.library.title')}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
        {t('testingCenter.library.subtitle', { count: totalCount })}
      </Text>

      {readErrorKey ? (
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
          {t(readErrorKey)}
        </Text>
      ) : null}

      <Button
        title={t('testingCenter.library.createCustom')}
        onPress={() => router.push(APP_ROUTES.performanceLabCustomNew)}
        variant="outline"
        icon="add-circle"
        fullWidth
        style={{ marginBottom: theme.spacing.md }}
      />

      <TestLibraryFiltersBar filters={filters} onChange={(next) => setFilters((f) => ({ ...f, ...next }))} />

      {loading ? (
        <View style={{ alignItems: 'center', paddingVertical: theme.spacing.lg }}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
            {t('testingCenter.bridge.loading')}
          </Text>
        </View>
      ) : null}

      {recentItems.length > 0 && !filters.query && filters.categoryId === 'all' && !filters.favoritesOnly && (
        <FormSection title={t('testingCenter.library.recent')}>
          {recentItems.slice(0, 5).map((test) => (
            <TestLibraryListItem
              key={test.key}
              test={test}
              isFavorite={favorites.includes(test.key)}
              onPress={() => openTest(test.key)}
              onToggleFavorite={() => toggleFavorite(test.key)}
            />
          ))}
        </FormSection>
      )}

      {favoriteItems.length > 0 && !filters.favoritesOnly && (
        <FormSection title={t('testingCenter.library.favorites')}>
          {favoriteItems.slice(0, 5).map((test) => (
            <TestLibraryListItem
              key={test.key}
              test={test}
              isFavorite
              onPress={() => openTest(test.key)}
              onToggleFavorite={() => toggleFavorite(test.key)}
            />
          ))}
        </FormSection>
      )}

      <FormSection title={t('testingCenter.library.results', { count: items.length })}>
        {items.length === 0 ? (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
            {t('testingCenter.library.noResults')}
          </Text>
        ) : (
          items.map((test) => (
            <TestLibraryListItem
              key={test.key}
              test={test}
              isFavorite={favorites.includes(test.key)}
              onPress={() => openTest(test.key)}
              onToggleFavorite={() => toggleFavorite(test.key)}
            />
          ))
        )}
      </FormSection>
    </FeatureScrollScreen>
  );
}

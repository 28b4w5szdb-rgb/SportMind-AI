/**
 * SportMind AI - More Screen
 * Premium settings hub with modern card-based menu
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const menuItems = [
  { id: '1', key: 'more.teamManagement', icon: 'people-circle' as const, color: '#0066FF', gradient: ['#0066FF', '#0D9488'], route: '/team-management' },
  { id: '2', key: 'more.reports', icon: 'document-text' as const, color: '#10B981', gradient: ['#10B981', '#059669'], route: '/reports' },
  { id: '3', key: 'more.research', icon: 'book' as const, color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'], route: '/research' },
  { id: '4', key: 'more.settings', icon: 'settings' as const, color: '#64748B', gradient: ['#64748B', '#475569'], route: '/settings' },
];

const supportItems = [
  { id: 'help', key: 'more.helpSupport', icon: 'help-circle' as const, route: '/help' },
  { id: 'knowledge', key: 'more.knowledgeCenter', icon: 'library' as const, route: '/knowledge' },
];

const menuLabels: Record<string, { en: string; ar: string }> = {
  'more.teamManagement': { en: 'Team Management', ar: 'إدارة الفريق' },
  'more.reports': { en: 'Reports Center', ar: 'مركز التقارير' },
  'more.research': { en: 'Research Assistant', ar: 'مساعد البحث' },
  'more.settings': { en: 'Settings', ar: 'الإعدادات' },
  'more.helpSupport': { en: 'Help & Support', ar: 'المساعدة والدعم' },
  'more.knowledgeCenter': { en: 'Knowledge Center', ar: 'مركز المعرفة' },
  'more.signOut': { en: 'Sign Out', ar: 'تسجيل الخروج' },
};

export default function MoreScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: theme.spacing[16] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[5] }}>
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
            {(isRTL ? 'القائمة' : 'MENU').toUpperCase()}
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
            {t('more.title')}
          </Text>
          <Text
            style={[
              type.body,
              {
                color: theme.colors.textSecondary,
                textAlign: textAlign('start'),
                marginTop: theme.spacing[2],
              },
            ]}
          >
            {isRTL ? 'أدوات وإعدادات إضافية' : 'Additional tools and settings'}
          </Text>
        </View>

        {/* Main Menu Items */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
          <Text
            style={[
              type.label,
              {
                color: theme.colors.textTertiary,
                marginBottom: theme.spacing[3],
                textAlign: textAlign('start'),
              },
            ]}
          >
            {isRTL ? 'الرئيسية' : 'MAIN'}
          </Text>
          {menuItems.map((item, index) => {
            const labels = menuLabels[item.key];
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(item.route as never)}
                activeOpacity={0.75}
              >
                <Card
                  variant="elevated"
                  padding="md"
                  style={[
                    styles.menuCard,
                    {
                      marginBottom: index < menuItems.length - 1 ? theme.spacing[2] : 0,
                      borderRadius: theme.borderRadius.xl,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.menuContent,
                      { flexDirection: flexRow(true) },
                    ]}
                  >
                    <View style={styles.menuLeft}>
                      <LinearGradient
                        colors={item.gradient as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.menuIcon,
                          { borderRadius: theme.borderRadius.lg },
                        ]}
                      >
                        <Ionicons name={item.icon} size={22} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={[type.body, { color: theme.colors.text }]}>
                        {isRTL ? labels.ar : labels.en}
                      </Text>
                    </View>
                    <View style={styles.menuRight}>
                      <Ionicons
                        name={isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={20}
                        color={theme.colors.textTertiary}
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Support Section */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
          <Text
            style={[
              type.label,
              {
                color: theme.colors.textTertiary,
                marginBottom: theme.spacing[3],
                textAlign: textAlign('start'),
              },
            ]}
          >
            {isRTL ? 'الدعم' : 'SUPPORT'}
          </Text>
          {supportItems.map((item, index) => {
            const labels = menuLabels[item.key];
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(item.route as never)}
                activeOpacity={0.75}
              >
                <Card
                  variant="outlined"
                  padding="md"
                  style={[
                    styles.menuCard,
                    {
                      marginBottom: index < supportItems.length - 1 ? theme.spacing[2] : 0,
                      borderRadius: theme.borderRadius.xl,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.menuContent,
                      { flexDirection: flexRow(true) },
                    ]}
                  >
                    <View style={styles.menuLeft}>
                      <View
                        style={[
                          styles.menuIconOutline,
                          {
                            backgroundColor: theme.colors.backgroundSecondary,
                            borderRadius: theme.borderRadius.lg,
                          },
                        ]}
                      >
                        <Ionicons name={item.icon} size={22} color={theme.colors.textSecondary} />
                      </View>
                      <Text style={[type.body, { color: theme.colors.text }]}>
                        {isRTL ? labels.ar : labels.en}
                      </Text>
                    </View>
                    <View style={styles.menuRight}>
                      <Ionicons
                        name={isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={20}
                        color={theme.colors.textTertiary}
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info Card */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
          <Card
            variant="filled"
            padding="lg"
            style={{ borderRadius: theme.borderRadius['2xl'] }}
          >
            <View style={styles.appInfoContent}>
              <LinearGradient
                colors={['#0066FF', '#0D9488']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.appLogo,
                  { borderRadius: theme.borderRadius['2xl'] },
                ]}
              >
                <Ionicons name="fitness" size={28} color="#FFFFFF" />
              </LinearGradient>
              <View style={{ flex: 1, marginLeft: theme.spacing[4] }}>
                <Text style={[type.h4, { color: theme.colors.text }]}>
                  SportMind AI
                </Text>
                <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                  {t('more.version')} 1.0.0
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.signOutButton,
                  { borderRadius: theme.borderRadius.lg },
                ]}
              >
                <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Quick Stats */}
        <View style={{ paddingHorizontal: theme.spacing[4], marginTop: theme.spacing[6] }}>
          <View
            style={[
              styles.statsContainer,
              { flexDirection: flexRow(true) },
            ]}
          >
            <View style={styles.statBox}>
              <Text
                style={[
                  type.number,
                  { color: theme.colors.primary },
                ]}
              >
                14
              </Text>
              <Text
                style={[
                  type.caption,
                  { color: theme.colors.textSecondary, marginTop: 4 },
                ]}
              >
                {isRTL ? 'اختبار' : 'Tests'}
              </Text>
            </View>
            <View style={[styles.statBoxDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statBox}>
              <Text
                style={[
                  type.number,
                  { color: theme.colors.success },
                ]}
              >
                8
              </Text>
              <Text
                style={[
                  type.caption,
                  { color: theme.colors.textSecondary, marginTop: 4 },
                ]}
              >
                {isRTL ? 'حاسبة' : 'Calculators'}
              </Text>
            </View>
            <View style={[styles.statBoxDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.statBox}>
              <Text
                style={[
                  type.number,
                  { color: theme.colors.accent },
                ]}
              >
                12
              </Text>
              <Text
                style={[
                  type.caption,
                  { color: theme.colors.textSecondary, marginTop: 4 },
                ]}
              >
                {isRTL ? 'لغة' : 'Languages'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  menuCard: {
    overflow: 'hidden',
  },
  menuContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuRight: {},
  menuIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconOutline: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF444415',
  },
  statsContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statBoxDivider: {
    width: 1,
    height: 40,
  },
});

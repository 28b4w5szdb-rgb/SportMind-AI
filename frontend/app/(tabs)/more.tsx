/**
 * SportMind AI - More Screen
 * Premium settings hub with responsive design for web/tablet/mobile
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useAuth } from '@/src/providers/AuthProvider';
import { AUTH_ROUTES } from '@/src/core/constants/routes';
import { LOGOUT } from '@/constants/testIds/auth';

const mainMenuItems = [
  { id: '1', key: 'more.teamManagement', icon: 'people-circle' as const, color: '#0066FF', route: '/team-management' },
  { id: '2', key: 'more.reports', icon: 'document-text' as const, color: '#10B981', route: '/reports' },
  { id: '3', key: 'more.research', icon: 'book' as const, color: '#8B5CF6', route: '/research' },
  { id: '4', key: 'more.settings', icon: 'settings' as const, color: '#64748B', route: '/settings' },
];

const supportItems = [
  { id: 'help', key: 'more.helpSupport', icon: 'help-circle' as const, color: '#F97316', route: '/help' },
  { id: 'knowledge', key: 'more.knowledgeCenter', icon: 'library' as const, color: '#0EA5E9', route: '/knowledge' },
];

const menuItemLabels: Record<string, { en: string; ar: string }> = {
  'more.teamManagement': { en: 'Team Management', ar: 'إدارة الفريق' },
  'more.reports': { en: 'Reports Center', ar: 'مركز التقارير' },
  'more.research': { en: 'Research Assistant', ar: 'مساعد البحث' },
  'more.settings': { en: 'Settings', ar: 'الإعدادات' },
  'more.helpSupport': { en: 'Help & Support', ar: 'المساعدة والدعم' },
  'more.knowledgeCenter': { en: 'Knowledge Center', ar: 'مركز المعرفة' },
};

const appFeatures = [
  { id: 'tests', icon: 'analytics', label: 'Tests', labelAr: 'اختبار', value: '14' },
  { id: 'calc', icon: 'calculator', label: 'Calculators', labelAr: 'حاسبة', value: '8' },
  { id: 'lang', icon: 'language', label: 'Languages', labelAr: 'لغة', value: '2' },
];

export default function MoreScreen() {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { user, profile, signOut, actionLoading } = useAuth();
  const { width: windowWidth } = useWindowDimensions();

  const displayName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    t('auth.signIn.title');

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace(AUTH_ROUTES.signIn);
    } catch {
      // AuthProvider surfaces errors via context if needed
    }
  };

  const isWeb = Platform.OS === 'web';
  const isTablet = windowWidth >= 768;
  const isDesktop = windowWidth >= 1024;

  const gridConfig = useMemo(() => {
    if (isDesktop) return { columns: 2, cardWidth: 700, gap: 16 };
    return { columns: 1, cardWidth: windowWidth - 32, gap: 12 };
  }, [windowWidth, isDesktop]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          paddingBottom: theme.spacing[20],
          paddingHorizontal: isWeb && isDesktop ? theme.spacing[12] : theme.spacing[4],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
            paddingTop: isDesktop ? theme.spacing[8] : theme.spacing[5],
          }}
        >
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

        {/* User Profile Card */}
        <View
          style={{
            marginTop: theme.spacing[5],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card
            variant="elevated"
            padding="none"
            style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#0066FF10', '#0D948810']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: theme.spacing[5] }}
            >
              <View
                style={[
                  styles.profileRow,
                  { flexDirection: flexRow(true), alignItems: 'center' },
                ]}
              >
                <View style={styles.profileAvatarContainer}>
                  <LinearGradient
                    colors={['#0066FF', '#0D9488']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.profileAvatar,
                      { borderRadius: theme.borderRadius['2xl'] },
                    ]}
                  >
                    <Ionicons name="person" size={isDesktop ? 32 : 28} color="#FFFFFF" />
                  </LinearGradient>
                  <View
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor: theme.colors.success,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: theme.colors.surface,
                      },
                    ]}
                  />
                </View>
                <View style={{ flex: 1, marginHorizontal: theme.spacing[4], marginLeft: isRTL ? 0 : theme.spacing[4], marginRight: isRTL ? theme.spacing[4] : 0 }}>
                  <Text style={[type.h4, { color: theme.colors.text }]}>
                    {displayName}
                  </Text>
                  <Text
                    style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}
                  >
                    {user?.email ?? (isRTL ? 'فريق رياضي' : 'Sports Team')}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert(
                      isRTL ? 'الإشعارات' : 'Notifications',
                      isRTL ? 'لا توجد إشعارات جديدة.' : 'No new notifications.'
                    )
                  }
                >
                  <Ionicons name="notifications-outline" size={24} color={theme.colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* Main Menu Items */}
        <View
          style={{
            marginTop: theme.spacing[5],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
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
          <View style={[styles.menuGrid, { flexDirection: flexRow(true), gap: gridConfig.gap }]}>
            {mainMenuItems.map((item) => {
              const labels = menuItemLabels[item.key];
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.route as never)}
                  activeOpacity={0.85}
                  style={{ flex: 1, maxWidth: gridConfig.cardWidth }}
                >
                  <Card
                    variant="elevated"
                    padding="lg"
                    style={{ borderRadius: theme.borderRadius['2xl'] }}
                  >
                    <View
                      style={[
                        styles.menuContent,
                        { flexDirection: flexRow(true), alignItems: 'center' },
                      ]}
                    >
                      <LinearGradient
                        colors={[item.color, item.color + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.menuIcon,
                          { borderRadius: theme.borderRadius.xl },
                        ]}
                      >
                        <Ionicons name={item.icon} size={24} color="#FFFFFF" />
                      </LinearGradient>
                      <View style={{ flex: 1, marginHorizontal: theme.spacing[4], marginLeft: isRTL ? 0 : theme.spacing[4], marginRight: isRTL ? theme.spacing[4] : 0 }}>
                        <Text style={[type.h5, { color: theme.colors.text }]}>
                          {isRTL ? labels.ar : labels.en}
                        </Text>
                        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                          {isRTL ? 'إدارة متقدمة' : 'Manage & configure'}
                        </Text>
                      </View>
                      <Ionicons
                        name={isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={20}
                        color={theme.colors.textTertiary}
                      />
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Support Section */}
        <View
          style={{
            marginTop: theme.spacing[5],
            maxWidth: isDesktop ? 1400 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
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
          {supportItems.map((item) => {
            const labels = menuItemLabels[item.key];
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(item.route as never)}
                activeOpacity={0.85}
              >
                <Card
                  variant="outlined"
                  padding="md"
                  style={{
                    borderRadius: theme.borderRadius.xl,
                    marginBottom: theme.spacing[2],
                  }}
                >
                  <View
                    style={[
                      styles.menuContent,
                      { flexDirection: flexRow(true), alignItems: 'center' },
                    ]}
                  >
                    <View
                      style={[
                        styles.menuIconOutline,
                        {
                          backgroundColor: item.color + '15',
                          borderRadius: theme.borderRadius.xl,
                        },
                      ]}
                    >
                      <Ionicons name={item.icon} size={24} color={item.color} />
                    </View>
                    <Text style={[type.body, { color: theme.colors.text, flex: 1, marginHorizontal: theme.spacing[4] }]}>
                      {isRTL ? labels.ar : labels.en}
                    </Text>
                    <Ionicons
                      name={isRTL ? 'chevron-back' : 'chevron-forward'}
                      size={20}
                      color={theme.colors.textTertiary}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info Card */}
        <View
          style={{
            marginTop: theme.spacing[6],
            maxWidth: isDesktop ? 600 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card
            variant="filled"
            padding="none"
            style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#F9731608', '#EA580C08']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: theme.spacing[5] }}
            >
              <View style={[styles.appInfoContent, { flexDirection: flexRow(true), alignItems: 'center' }]}>
                <LinearGradient
                  colors={['#0066FF', '#0D9488']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.appLogo,
                    { borderRadius: theme.borderRadius['3xl'] },
                  ]}
                >
                  <Ionicons name="fitness" size={isDesktop ? 32 : 28} color="#FFFFFF" />
                </LinearGradient>
                <View style={{ flex: 1, marginStart: theme.spacing[4] }}>
                  <Text style={[type.h4, { color: theme.colors.text }]}>
                    SportMind AI
                  </Text>
                  <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
                    {t('more.version')} 1.0.0
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSignOut}
                  disabled={actionLoading}
                  testID={LOGOUT.button}
                  accessibilityLabel={t('more.signOut')}
                >
                  <View
                    style={[
                      styles.signOutButton,
                      {
                        backgroundColor: theme.colors.error + '15',
                        borderRadius: theme.borderRadius.lg,
                        opacity: actionLoading ? 0.5 : 1,
                      },
                    ]}
                  >
                    <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* Feature Stats */}
        <View
          style={{
            marginTop: theme.spacing[5],
            maxWidth: isDesktop ? 600 : undefined,
            marginHorizontal: isDesktop ? 'auto' : undefined,
            width: '100%',
          }}
        >
          <Card variant="outlined" padding="none" style={{ borderRadius: theme.borderRadius['2xl'] }}>
            <View style={[styles.featureStats, { flexDirection: flexRow(true) }]}>
              {appFeatures.map((feature, index) => (
                <View key={feature.id} style={styles.featureStatItem}>
                  <Ionicons name={feature.icon as any} size={20} color={theme.colors.primary} />
                  <Text style={[type.numberSm, { color: theme.colors.text, marginTop: theme.spacing[1] }]}>
                    {feature.value}
                  </Text>
                  <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
                    {isRTL ? feature.labelAr : feature.label}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  profileRow: {},
  profileAvatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
  },
  menuGrid: {
    flexWrap: 'wrap',
  },
  menuContent: {},
  menuIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconOutline: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfoContent: {},
  appLogo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureStats: {
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  featureStatItem: {
    alignItems: 'center',
    flex: 1,
  },
});

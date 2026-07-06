/**
 * SportMind AI - AI Coach Screen
 * Premium ChatGPT-style AI assistant with persisted mock conversations.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { ChatMessage, TypingIndicator } from '@/src/components/features/ai-coach';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import {
  AI_AGENTS,
  SUGGESTED_PROMPTS,
  generateMockResponse,
  type AiAgentId,
  type AiMessage,
} from '@/src/data/mock/ai-coach';
import { useActiveConversationMessages } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { computeAthleteAnalytics } from '@/src/analytics';
import { buildAthleteNutritionSnapshot } from '@/src/features/nutrition/utils/nutritionHelpers';
import { useSquadIntelligence } from '@/src/features/team-intelligence';
import { copyToClipboard, exportTextPlaceholder } from '@/src/utils/clipboard';

function createMessage(role: AiMessage['role'], content: string, agentId?: AiAgentId): AiMessage {
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    agentId,
  };
}

function formatConversationDate(iso: string, isRTL: boolean): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return isRTL ? 'اليوم' : 'Today';
  if (diffDays === 1) return isRTL ? 'أمس' : 'Yesterday';
  return d.toLocaleDateString(isRTL ? 'ar' : 'en', { month: 'short', day: 'numeric' });
}

export default function AICoachScreen() {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);

  const selectedAgent = useMockStore((s) => s.selectedAgent);
  const setSelectedAgent = useMockStore((s) => s.setSelectedAgent);
  const conversations = useMockStore((s) => s.conversations);
  const activeConversationId = useMockStore((s) => s.activeConversationId);
  const appendActiveMessage = useMockStore((s) => s.appendActiveMessage);
  const setActiveMessages = useMockStore((s) => s.setActiveMessages);
  const startNewConversation = useMockStore((s) => s.startNewConversation);
  const setActiveConversation = useMockStore((s) => s.setActiveConversation);

  const messages = useActiveConversationMessages();
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const teamIntelligence = useSquadIntelligence();

  const analyticsContext = useMemo(() => {
    const athlete = athletes[0];
    if (!athlete) return undefined;
    const athleteTests = tests.filter((tst) => tst.athlete_id === athlete.id);
    const checkIn = dailyCheckIns
      .filter((c) => c.athlete_id === athlete.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    const primary = computeAthleteAnalytics({
      athlete,
      tests: athleteTests,
      checkIn,
      injuries: injuryRecords.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs,
      bodyCompositionRecords,
      nutritionGoalSettings,
    });
    const nutrition = buildAthleteNutritionSnapshot({
      athlete,
      analytics: primary,
      logs: nutritionLogs,
      bodyRecords: bodyCompositionRecords,
      goalSettings: nutritionGoalSettings,
      checkIn,
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      dateKey: new Date().toISOString().slice(0, 10),
    });
    return {
      primary,
      athleteName: `${athlete.first_name} ${athlete.last_name}`,
      nutrition,
      teamIntelligence,
    };
  }, [athletes, tests, dailyCheckIns, injuryRecords, trainingPlans, nutritionLogs, bodyCompositionRecords, nutritionGoalSettings, teamIntelligence]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const isDesktop = windowWidth >= 1024;
  const hasMessages = messages.length > 0 || isTyping;
  const canSend = input.trim().length > 0 && !isTyping;

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg = createMessage('user', trimmed, selectedAgent);
      appendActiveMessage(userMsg);
      setInput('');
      setIsTyping(true);
      scrollToEnd();

      setTimeout(() => {
        const reply = generateMockResponse(selectedAgent, trimmed, isRTL, analyticsContext, (key) => t(key));
        appendActiveMessage(createMessage('assistant', reply, selectedAgent));
        setIsTyping(false);
        scrollToEnd();
      }, 1400 + Math.random() * 800);
    },
    [analyticsContext, appendActiveMessage, isTyping, isRTL, scrollToEnd, selectedAgent]
  );

  const handleNewChat = () => {
    startNewConversation();
    setInput('');
    setIsTyping(false);
    setShowSidebar(false);
  };

  const handleCopy = useCallback(
    (text: string) => {
      copyToClipboard(text, isRTL ? 'تم النسخ' : 'Copied');
    },
    [isRTL]
  );

  const handleRegenerate = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser || isTyping) return;
    const lastAssistantIdx = messages.map((m) => m.role).lastIndexOf('assistant');
    if (lastAssistantIdx < 0) return;
    setActiveMessages(messages.slice(0, lastAssistantIdx));
    setIsTyping(true);
    setTimeout(() => {
      const reply = generateMockResponse(selectedAgent, lastUser.content, isRTL, analyticsContext, (key) => t(key));
      appendActiveMessage(createMessage('assistant', reply, selectedAgent));
      setIsTyping(false);
      scrollToEnd();
    }, 1200);
  }, [analyticsContext, appendActiveMessage, isRTL, isTyping, messages, scrollToEnd, selectedAgent, setActiveMessages]);

  const handleExport = () => {
    const body = messages.map((m) => `${m.role}: ${m.content}`).join('\n\n');
    exportTextPlaceholder(isRTL ? 'تصدير المحادثة' : 'Export conversation', body || '—', isRTL);
  };

  const handleAttachment = () => {
    Alert.alert(
      isRTL ? 'المرفقات' : 'Attachments',
      isRTL
        ? 'ارفع PDF أو صور أو CSV — سيتوفر عند ربط التخزين.'
        : 'Upload PDF, images, or CSV — available when storage is connected.'
    );
  };

  const groupedItems = useMemo(() => {
    const items: Array<{ type: 'date'; label: string; key: string } | { type: 'msg'; message: AiMessage; key: string }> = [];
    let lastDate = '';
    messages.forEach((msg) => {
      const d = new Date(msg.timestamp).toLocaleDateString();
      if (d !== lastDate) {
        items.push({ type: 'date', label: d, key: `d-${d}` });
        lastDate = d;
      }
      items.push({ type: 'msg', message: msg, key: msg.id });
    });
    return items;
  }, [messages]);

  const lastAssistantId = useMemo(() => {
    const m = [...messages].reverse().find((x) => x.role === 'assistant');
    return m?.id;
  }, [messages]);

  const renderEmptyState = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing[8] }} showsVerticalScrollIndicator={false}>
      <View style={[styles.emptyHero, { alignItems: 'center', paddingVertical: theme.spacing[8] }]}>
        <LinearGradient colors={['#0066FF', '#0D9488']} style={[styles.emptyIcon, { borderRadius: theme.borderRadius['3xl'] }]}>
          <Ionicons name="sparkles" size={36} color="#FFF" />
        </LinearGradient>
        <Text style={[type.h3, { color: theme.colors.text, marginTop: theme.spacing[4], textAlign: 'center' }]}>
          {t('aiCoach.title')}
        </Text>
        <Text
          style={[
            type.body,
            { color: theme.colors.textSecondary, marginTop: theme.spacing[2], textAlign: 'center', maxWidth: 320 },
          ]}
        >
          {t('aiCoach.welcome')}
        </Text>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing[4], textAlign: 'center' }]}>
          {isRTL ? 'اختر وكيلاً أعلاه أو جرّب أحد الأسئلة' : 'Pick an agent above or try a suggested prompt'}
        </Text>
      </View>

      <Text style={[type.label, { color: theme.colors.textTertiary, marginBottom: theme.spacing[3], textAlign: textAlign('start') }]}>
        {isRTL ? 'أسئلة مقترحة' : 'Suggested prompts'}
      </Text>
      <View style={{ gap: theme.spacing.sm }}>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt.id}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedAgent(prompt.agentId);
              sendMessage(isRTL ? prompt.textAr : prompt.textEn);
            }}
          >
            <Card variant="elevated" padding="md" style={{ borderRadius: theme.borderRadius.xl, ...theme.shadows.sm }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.colors.primary} />
                <Text
                  style={[
                    type.bodySm,
                    { color: theme.colors.text, flex: 1, marginHorizontal: theme.spacing[3], textAlign: textAlign('start') },
                  ]}
                >
                  {isRTL ? prompt.textAr : prompt.textEn}
                </Text>
                <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={16} color={theme.colors.textTertiary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const chatPanel = (
    <View style={{ flex: 1 }}>
      {hasMessages ? (
        <FlatList
          ref={listRef}
          data={groupedItems}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) =>
            item.type === 'date' ? (
              <Text
                style={[
                  type.caption,
                  { color: theme.colors.textTertiary, textAlign: 'center', marginVertical: theme.spacing[3] },
                ]}
              >
                {item.label}
              </Text>
            ) : (
              <ChatMessage
                message={item.message}
                onCopy={item.message.role === 'assistant' ? handleCopy : undefined}
                onRegenerate={item.message.role === 'assistant' ? handleRegenerate : undefined}
                isLastAssistant={item.message.id === lastAssistantId}
              />
            )
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          contentContainerStyle={{ paddingVertical: theme.spacing[4], paddingHorizontal: theme.spacing[1] }}
          onContentSizeChange={scrollToEnd}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );

  const sidebarContent = (
    <>
      <TouchableOpacity onPress={handleNewChat} activeOpacity={0.85} style={{ marginBottom: theme.spacing.md }}>
        <LinearGradient colors={['#0066FF', '#0D9488']} style={[styles.newChatBtn, { borderRadius: theme.borderRadius.lg }]}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={[type.button, { color: '#FFF', marginStart: theme.spacing.sm, fontSize: 14 }]}>
            {isRTL ? 'محادثة جديدة' : 'New chat'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text style={[type.label, { color: theme.colors.textTertiary, marginBottom: theme.spacing[2], textAlign: textAlign('start') }]}>
        {isRTL ? 'الأخيرة' : 'Recent'}
      </Text>
      {conversations.length === 0 ? (
        <Text style={[type.bodySm, { color: theme.colors.textTertiary, textAlign: textAlign('start'), paddingVertical: 12 }]}>
          {isRTL ? 'لا محادثات بعد — ابدأ محادثة جديدة' : 'No conversations yet — start a new chat'}
        </Text>
      ) : (
        conversations.map((conv) => {
          const active = conv.id === activeConversationId;
          return (
            <TouchableOpacity
              key={conv.id}
              activeOpacity={0.85}
              onPress={() => {
                setActiveConversation(conv.id);
                setShowSidebar(false);
              }}
              style={[
                styles.convItem,
                {
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: active ? theme.colors.primary + '15' : theme.colors.surface,
                  borderWidth: active ? 1 : 0,
                  borderColor: active ? theme.colors.primary + '40' : 'transparent',
                },
              ]}
            >
              <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start'), fontWeight: active ? '600' : '400' }]} numberOfLines={2}>
                {conv.title}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                {formatConversationDate(conv.updatedAt, isRTL)} · {conv.messages.length} {isRTL ? 'رسائل' : 'msgs'}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </>
  );

  const sidebar = (
    <View
      style={[
        styles.sidebar,
        { borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundSecondary },
        isRTL ? { borderLeftWidth: StyleSheet.hairlineWidth } : { borderRightWidth: StyleSheet.hairlineWidth },
      ]}
    >
      {sidebarContent}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View
          style={[
            styles.header,
            { flexDirection: flexRow(true), borderBottomColor: theme.colors.border, paddingHorizontal: theme.spacing[4] },
          ]}
        >
          {!isDesktop && (
            <TouchableOpacity onPress={() => setShowSidebar(true)} style={styles.iconBtn} accessibilityLabel={isRTL ? 'المحادثات' : 'Conversations'}>
              <Ionicons name="menu" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[type.h4, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('aiCoach.title')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
              {isRTL ? 'مساعد علوم رياضية' : 'Sports science assistant'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleExport} style={styles.iconBtn} accessibilityLabel={isRTL ? 'تصدير' : 'Export'}>
            <Ionicons name="download-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNewChat} style={styles.iconBtn} accessibilityLabel={isRTL ? 'محادثة جديدة' : 'New chat'}>
            <Ionicons name="create-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: theme.spacing[4], paddingVertical: theme.spacing[3], gap: theme.spacing[2] }}
        >
          {AI_AGENTS.map((agent) => {
            const active = selectedAgent === agent.id;
            return (
              <TouchableOpacity key={agent.id} onPress={() => setSelectedAgent(agent.id)} activeOpacity={0.85}>
                <View
                  style={[
                    styles.agentChip,
                    {
                      flexDirection: flexRow(true),
                      backgroundColor: active ? agent.color : theme.colors.surface,
                      borderColor: active ? agent.color : theme.colors.border,
                      borderRadius: theme.borderRadius.full,
                    },
                  ]}
                >
                  <Ionicons name={agent.icon as keyof typeof Ionicons.glyphMap} size={16} color={active ? '#FFF' : agent.color} />
                  <Text style={[type.label, { color: active ? '#FFF' : theme.colors.text, marginStart: 6 }]}>
                    {isRTL ? agent.labelAr : agent.labelEn}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={[styles.main, { flexDirection: isDesktop ? flexRow(true) : 'column' }]}>
          {isDesktop && sidebar}
          <View style={{ flex: 1, paddingHorizontal: isDesktop ? theme.spacing[6] : theme.spacing[3] }}>{chatPanel}</View>
        </View>

        <View
          style={[
            styles.composer,
            {
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
              paddingHorizontal: theme.spacing[3],
              paddingTop: theme.spacing[3],
              paddingBottom: Platform.OS === 'ios' ? theme.spacing[2] : theme.spacing[3],
            },
          ]}
        >
          <View
            style={[
              styles.composerInner,
              {
                flexDirection: flexRow(true),
                maxWidth: isDesktop ? 900 : undefined,
                alignSelf: 'center',
                width: '100%',
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius['2xl'],
                borderWidth: 1,
                paddingHorizontal: 6,
                paddingVertical: 6,
                ...theme.shadows.sm,
              },
            ]}
          >
            <TouchableOpacity onPress={handleAttachment} style={styles.attachBtn} accessibilityLabel={isRTL ? 'مرفق' : 'Attach file'}>
              <View style={[styles.attachCircle, { backgroundColor: theme.colors.backgroundSecondary, borderRadius: theme.borderRadius.lg }]}>
                <Ionicons name="attach" size={20} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
            <TextInput
              style={[
                styles.textInput,
                type.body,
                {
                  flex: 1,
                  color: theme.colors.text,
                  textAlign: textAlign('start'),
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
              placeholder={isRTL ? 'اسأل المدرب الذكي…' : 'Ask your AI coach…'}
              placeholderTextColor={theme.colors.textTertiary}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={2000}
              onSubmitEditing={() => sendMessage(input)}
            />
            <TouchableOpacity
              onPress={() => sendMessage(input)}
              disabled={!canSend}
              activeOpacity={0.85}
              accessibilityLabel={isRTL ? 'إرسال' : 'Send'}
            >
              <LinearGradient
                colors={canSend ? ['#0066FF', '#0D9488'] : [theme.colors.border, theme.colors.border]}
                style={[styles.sendBtn, { borderRadius: theme.borderRadius.xl }]}
              >
                <Ionicons
                  name="arrow-up"
                  size={22}
                  color={canSend ? '#FFF' : theme.colors.textTertiary}
                  style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: 8 }]}>
            {isRTL ? 'محادثاتك محفوظة محلياً على هذا الجهاز' : 'Conversations are saved locally on this device'}
          </Text>
        </View>
      </KeyboardAvoidingView>

      {!isDesktop && (
        <Modal visible={showSidebar} transparent animationType="slide" onRequestClose={() => setShowSidebar(false)}>
          <View style={styles.modalRoot}>
            <Pressable style={styles.backdrop} onPress={() => setShowSidebar(false)} />
            <SafeAreaView
              edges={['top', 'bottom']}
              style={[
                styles.sidebarMobile,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                  ...(isRTL ? { right: 0, borderLeftWidth: StyleSheet.hairlineWidth } : { left: 0, borderRightWidth: StyleSheet.hairlineWidth }),
                },
              ]}
            >
              <View style={[styles.sidebarHeader, { flexDirection: flexRow(true), borderBottomColor: theme.colors.border }]}>
                <Text style={[type.h5, { color: theme.colors.text, flex: 1, textAlign: textAlign('start') }]}>
                  {isRTL ? 'المحادثات' : 'Conversations'}
                </Text>
                <TouchableOpacity onPress={() => setShowSidebar(false)} style={styles.iconBtn}>
                  <Ionicons name="close" size={22} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
                {sidebarContent}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentChip: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  main: { flex: 1 },
  sidebar: {
    width: 280,
    padding: 12,
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  convItem: {
    padding: 12,
    marginBottom: 8,
  },
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  composerInner: {
    alignItems: 'flex-end',
  },
  textInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHero: {},
  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRoot: { flex: 1, flexDirection: 'row' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sidebarMobile: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '82%',
    maxWidth: 320,
  },
  sidebarHeader: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

/**
 * SportMind AI - AI Coach Screen
 * Premium sports science consultant with persisted mock conversations.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  useWindowDimensions,
  Alert,
  Modal,
  Pressable,
  InteractionManager,
  Text,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import {
  ChatMessage,
  TypingIndicator,
  AiCoachHeader,
  AiCoachContextBar,
  AiCoachEmptyState,
  AiCoachSidebar,
} from '@/src/components/features/ai-coach';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { AI_MODULES } from '@/src/features/ai-coach/constants';
import type { AiContextScope, AiModuleId, StructuredAiResponse } from '@/src/features/ai-coach/types';
import { generateMockResponse, type AiAgentId, type AiMessage } from '@/src/data/mock/ai-coach';
import { useActiveConversationMessages } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { computeAthleteAnalytics } from '@/src/analytics';
import { buildAthleteNutritionSnapshot } from '@/src/features/nutrition/utils/nutritionHelpers';
import { buildWearableDailySnapshot } from '@/src/features/wearables';
import { useSquadIntelligence } from '@/src/features/team-intelligence';
import { copyToClipboard, exportTextPlaceholder } from '@/src/utils/clipboard';

function createMessage(
  role: AiMessage['role'],
  content: string,
  agentId?: AiAgentId,
  structured?: StructuredAiResponse
): AiMessage {
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    agentId,
    structured,
  };
}

function moduleToAgent(moduleId: AiModuleId): AiAgentId {
  return AI_MODULES.find((m) => m.id === moduleId)?.agentId ?? 'performance';
}

export default function AICoachScreen() {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const shouldAutoScrollRef = useRef(true);

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
  const wearableConnections = useMockStore((s) => s.wearableConnections);
  const wearableRecords = useMockStore((s) => s.wearableRecords);
  const teamIntelligence = useSquadIntelligence();

  const [contextScope, setContextScope] = useState<AiContextScope>('athlete');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<AiModuleId>('performance');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!selectedAthleteId && athletes.length > 0) {
      setSelectedAthleteId(athletes[0].id);
    }
  }, [athletes, selectedAthleteId]);

  const analyticsContext = useMemo(() => {
    if (contextScope === 'team') {
      return teamIntelligence ? { teamIntelligence } : undefined;
    }

    const athlete = athletes.find((a) => a.id === selectedAthleteId) ?? athletes[0];
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
      wearableConnections,
      wearableRecords,
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
    const wearables = buildWearableDailySnapshot(
      athlete.id,
      new Date().toISOString().slice(0, 10),
      wearableConnections,
      wearableRecords
    );
    return {
      primary,
      athleteName: `${athlete.first_name} ${athlete.last_name}`,
      nutrition,
      wearables,
      teamIntelligence,
    };
  }, [
    athletes,
    bodyCompositionRecords,
    contextScope,
    dailyCheckIns,
    injuryRecords,
    nutritionGoalSettings,
    nutritionLogs,
    selectedAthleteId,
    teamIntelligence,
    tests,
    trainingPlans,
    wearableConnections,
    wearableRecords,
  ]);

  const isDesktop = windowWidth >= 1024;
  const canSend = input.trim().length > 0 && !isTyping;
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.bottom + 49 : 0;
  const listBottomInset = theme.spacing[2];

  const scrollToEnd = useCallback((animated = true) => {
    if (!shouldAutoScrollRef.current) return;
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated });
      });
    });
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      shouldAutoScrollRef.current = true;
      scrollToEnd(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      scrollToEnd(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollToEnd]);

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      shouldAutoScrollRef.current = true;
      scrollToEnd(true);
    }
  }, [messages.length, isTyping, scrollToEnd]);

  const handleModuleChange = useCallback(
    (moduleId: AiModuleId) => {
      setSelectedModuleId(moduleId);
      setSelectedAgent(moduleToAgent(moduleId));
    },
    [setSelectedAgent]
  );

  const sendMessage = useCallback(
    (text: string, moduleOverride?: AiModuleId) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const agent = moduleOverride ? moduleToAgent(moduleOverride) : selectedAgent;
      if (moduleOverride) {
        setSelectedModuleId(moduleOverride);
        setSelectedAgent(agent);
      }

      const userMsg = createMessage('user', trimmed, agent);
      appendActiveMessage(userMsg);
      setInput('');
      setIsTyping(true);
      shouldAutoScrollRef.current = true;
      scrollToEnd(true);

      setTimeout(() => {
        const reply = generateMockResponse(agent, trimmed, isRTL, analyticsContext, (key) => t(key));
        appendActiveMessage(createMessage('assistant', reply.content, agent, reply.structured));
        setIsTyping(false);
        shouldAutoScrollRef.current = true;
        scrollToEnd(true);
      }, 1400 + Math.random() * 800);
    },
    [analyticsContext, appendActiveMessage, isRTL, isTyping, scrollToEnd, selectedAgent, setSelectedAgent, t]
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
      appendActiveMessage(createMessage('assistant', reply.content, selectedAgent, reply.structured));
      setIsTyping(false);
      shouldAutoScrollRef.current = true;
      scrollToEnd(true);
    }, 1200);
  }, [analyticsContext, appendActiveMessage, isRTL, isTyping, messages, scrollToEnd, selectedAgent, setActiveMessages, t]);

  const handleExport = () => {
    const body = messages.map((m) => `${m.role}: ${m.content}`).join('\n\n');
    exportTextPlaceholder(t('aiCoach.export'), body || '—', isRTL);
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
    <AiCoachEmptyState onSelectModule={handleModuleChange} onSendPrompt={(text, moduleId) => sendMessage(text, moduleId)} />
  );

  const composerBlock = (
    <View
      style={[
        styles.composer,
        {
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacing[3],
          paddingTop: theme.spacing[2],
          paddingBottom: theme.spacing[2],
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
          onFocus={() => {
            shouldAutoScrollRef.current = true;
            scrollToEnd(true);
          }}
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
    </View>
  );

  const chatList = (
    <FlatList
      ref={listRef}
      style={styles.messageList}
      data={groupedItems}
      keyExtractor={(item) => item.key}
      removeClippedSubviews={false}
      ListEmptyComponent={renderEmptyState}
      renderItem={({ item }) =>
        item.type === 'date' ? (
          <Text
            style={[
              type.caption,
              { color: theme.colors.textTertiary, textAlign: 'center', marginVertical: theme.spacing[2] },
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
      contentContainerStyle={{
        paddingTop: theme.spacing[2],
        paddingBottom: listBottomInset,
        paddingHorizontal: isDesktop ? theme.spacing[2] : theme.spacing[1],
      }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => {
        if (groupedItems.length > 0 || isTyping) {
          scrollToEnd(false);
        }
      }}
      onScrollBeginDrag={() => {
        shouldAutoScrollRef.current = false;
      }}
      onMomentumScrollEnd={(event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
        shouldAutoScrollRef.current = distanceFromBottom < 80;
      }}
    />
  );

  const sidebarPanel = (
    <View
      style={[
        styles.sidebar,
        { borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundSecondary },
        isRTL ? { borderLeftWidth: StyleSheet.hairlineWidth } : { borderRightWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <AiCoachSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={(id) => {
          setActiveConversation(id);
          setShowSidebar(false);
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardRoot}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <AiCoachHeader
          isDesktop={isDesktop}
          onOpenSidebar={!isDesktop ? () => setShowSidebar(true) : undefined}
          onExport={handleExport}
          onNewChat={handleNewChat}
        />

        <AiCoachContextBar
          contextScope={contextScope}
          onScopeChange={setContextScope}
          selectedModuleId={selectedModuleId}
          onModuleChange={handleModuleChange}
          athletes={athletes}
          selectedAthleteId={selectedAthleteId}
          onAthleteChange={setSelectedAthleteId}
        />

        {isDesktop ? (
          <View style={[styles.messagesArea, { flexDirection: flexRow(true) }]}>
            {sidebarPanel}
            <View style={styles.desktopChatStack}>
              <View style={styles.messagesListHost}>{chatList}</View>
              {composerBlock}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.messagesListHost}>{chatList}</View>
            {composerBlock}
          </>
        )}
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
                  {t('aiCoach.sidebar.title')}
                </Text>
                <TouchableOpacity onPress={() => setShowSidebar(false)} style={styles.iconBtn}>
                  <Ionicons name="close" size={22} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <View style={{ padding: 12, flex: 1 }}>
                <AiCoachSidebar
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onNewChat={handleNewChat}
                  onSelectConversation={(id) => {
                    setActiveConversation(id);
                    setShowSidebar(false);
                  }}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  keyboardRoot: { flex: 1 },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesArea: {
    flex: 1,
    minHeight: 0,
  },
  desktopChatStack: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 24,
  },
  messagesListHost: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 12,
  },
  messageList: {
    flex: 1,
  },
  sidebar: {
    width: 300,
    padding: 12,
  },
  composer: {
    flexShrink: 0,
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

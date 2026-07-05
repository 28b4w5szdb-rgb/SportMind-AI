/**
 * SportMind AI - AI Coach Screen
 * Premium ChatGPT-style AI assistant with mock local responses.
 */

import React, { useCallback, useRef, useState } from 'react';
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
  RECENT_CONVERSATIONS,
  SUGGESTED_PROMPTS,
  generateMockResponse,
  type AiAgentId,
  type AiMessage,
} from '@/src/data/mock/ai-coach';

function createMessage(role: AiMessage['role'], content: string, agentId?: AiAgentId): AiMessage {
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    agentId,
  };
}

export default function AICoachScreen() {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);

  const [selectedAgent, setSelectedAgent] = useState<AiAgentId>('performance');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const isDesktop = windowWidth >= 1024;
  const hasMessages = messages.length > 0 || isTyping;

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg = createMessage('user', trimmed, selectedAgent);
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);
      scrollToEnd();

      setTimeout(() => {
        const reply = generateMockResponse(selectedAgent, trimmed, isRTL);
        setMessages((prev) => [...prev, createMessage('assistant', reply, selectedAgent)]);
        setIsTyping(false);
        scrollToEnd();
      }, 1400 + Math.random() * 800);
    },
    [isTyping, isRTL, scrollToEnd, selectedAgent]
  );

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setIsTyping(false);
    setShowSidebar(false);
  };

  const renderEmptyState = () => (
    <ScrollView
      contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.emptyHero, { alignItems: 'center', paddingVertical: theme.spacing[8] }]}>
        <LinearGradient
          colors={['#0066FF', '#0D9488']}
          style={[styles.emptyIcon, { borderRadius: theme.borderRadius['3xl'] }]}
        >
          <Ionicons name="sparkles" size={36} color="#FFF" />
        </LinearGradient>
        <Text style={[type.h3, { color: theme.colors.text, marginTop: theme.spacing[4], textAlign: 'center' }]}>
          {t('aiCoach.title')}
        </Text>
        <Text style={[type.body, { color: theme.colors.textSecondary, marginTop: theme.spacing[2], textAlign: 'center', maxWidth: 320 }]}>
          {t('aiCoach.welcome')}
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
            <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.colors.primary} />
                <Text style={[type.bodySm, { color: theme.colors.text, flex: 1, marginHorizontal: theme.spacing[3], textAlign: textAlign('start') }]}>
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
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessage message={item} />}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          contentContainerStyle={{ paddingVertical: theme.spacing[4], paddingHorizontal: theme.spacing[1] }}
          onContentSizeChange={scrollToEnd}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );

  const sidebar = (
    <View style={[styles.sidebar, { borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundSecondary }]}>
      <TouchableOpacity onPress={handleNewChat} activeOpacity={0.85} style={{ marginBottom: theme.spacing.md }}>
        <LinearGradient
          colors={['#0066FF', '#0D9488']}
          style={[styles.newChatBtn, { borderRadius: theme.borderRadius.lg }]}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={[type.button, { color: '#FFF', marginStart: theme.spacing.sm, fontSize: 14 }]}>
            {isRTL ? 'محادثة جديدة' : 'New chat'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text style={[type.label, { color: theme.colors.textTertiary, marginBottom: theme.spacing[2], textAlign: textAlign('start') }]}>
        {isRTL ? 'الأخيرة' : 'Recent'}
      </Text>
      {RECENT_CONVERSATIONS.map((conv) => (
        <TouchableOpacity
          key={conv.id}
          activeOpacity={0.85}
          onPress={() => {
            setSelectedAgent(conv.agentId);
            setMessages([
              createMessage('user', isRTL ? conv.titleAr : conv.title, conv.agentId),
              createMessage('assistant', generateMockResponse(conv.agentId, conv.title, isRTL), conv.agentId),
            ]);
            setShowSidebar(false);
          }}
          style={[styles.convItem, { borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.surface }]}
        >
          <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('start') }]} numberOfLines={1}>
            {isRTL ? conv.titleAr : conv.title}
          </Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2, textAlign: textAlign('start') }]}>
            {conv.updatedAt} · {conv.messageCount}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { flexDirection: flexRow(true), borderBottomColor: theme.colors.border, paddingHorizontal: theme.spacing[4] }]}>
          {!isDesktop && (
            <TouchableOpacity onPress={() => setShowSidebar(!showSidebar)} style={styles.iconBtn}>
              <Ionicons name="menu" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[type.h4, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('aiCoach.title')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>
              {isRTL ? 'مساعد علوم رياضية' : 'Sports science assistant'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleNewChat} style={styles.iconBtn}>
            <Ionicons name="create-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Agent selector */}
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

        {/* Main layout */}
        <View style={[styles.main, { flexDirection: isDesktop ? flexRow(true) : 'column' }]}>
          {(isDesktop || showSidebar) && sidebar}
          <View style={{ flex: 1, paddingHorizontal: isDesktop ? theme.spacing[6] : theme.spacing[3] }}>
            {chatPanel}
          </View>
        </View>

        {/* Composer */}
        <View style={[styles.composer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.background, padding: theme.spacing[3] }]}>
          <View style={[styles.inputRow, { flexDirection: flexRow(true), maxWidth: isDesktop ? 900 : undefined, alignSelf: 'center', width: '100%' }]}>
            <TextInput
              style={[
                styles.textInput,
                type.body,
                {
                  flex: 1,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius['2xl'],
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
              disabled={!input.trim() || isTyping}
              activeOpacity={0.85}
              style={{ opacity: input.trim() && !isTyping ? 1 : 0.45 }}
            >
              <LinearGradient
                colors={['#0066FF', '#0D9488']}
                style={[styles.sendBtn, { borderRadius: theme.borderRadius.xl }]}
              >
                <Ionicons name="send" size={20} color="#FFF" style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    width: 260,
    borderRightWidth: StyleSheet.hairlineWidth,
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
  inputRow: {
    alignItems: 'flex-end',
    gap: 10,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    maxHeight: 120,
  },
  sendBtn: {
    width: 48,
    height: 48,
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
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { sendMessageToAI, ChatMessage } from '@/services/openaiService';
import { searchLaws } from '@/utils/offlineSearch';
import {
  getMessageCount,
  incrementMessageCount,
  isPremium,
  getChatHistory,
  saveChatHistory,
} from '@/utils/storage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MAX_FREE_MESSAGES = 6;

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const count = await getMessageCount();
    const premium = await isPremium();
    const history = await getChatHistory();

    setMessageCount(count);
    setIsPremiumUser(premium);

    if (history.length > 0) {
      setMessages(history);
    } else {
      // Mensagem de boas-vindas
      setMessages([
        {
          id: '1',
          text: 'Olá! Sou o LeiFácil IA, seu assistente jurídico. Como posso te ajudar hoje?',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Verifica limite de mensagens
    if (!isPremiumUser && messageCount >= MAX_FREE_MESSAGES) {
      showLimitModal();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Incrementa contador se não for premium
    if (!isPremiumUser) {
      const newCount = await incrementMessageCount();
      setMessageCount(newCount);
    }

    try {
      // Tenta enviar para a IA
      const response = await sendMessageToAI(userMessage.text);

      if (response.error) {
        // Modo offline - busca na base local
        setIsOffline(true);
        const offlineResults = searchLaws(userMessage.text, 3);

        let offlineResponse = 'Sem internet — consultando base local de leis.\n\n';

        if (offlineResults.length > 0) {
          offlineResponse += offlineResults
            .map((law) => `📖 ${law.lei}\n${law.texto}\n`)
            .join('\n');
        } else {
          offlineResponse +=
            'Não encontrei leis relacionadas à sua pergunta na base local. Tente conectar à internet para uma resposta mais completa.';
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: offlineResponse,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setIsOffline(false);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const showLimitModal = () => {
    Alert.alert(
      'Limite Atingido',
      `Você atingiu o limite de ${MAX_FREE_MESSAGES} mensagens gratuitas por dia.\n\nEscolha uma opção:`,
      [
        {
          text: 'Assistir Anúncio (+3 mensagens)',
          onPress: () => {
            // TODO: Implementar AdMob Rewarded
            Alert.alert('Em breve', 'Funcionalidade de anúncios será implementada em breve.');
          },
        },
        {
          text: 'Assinar Premium (R$ 35/ano)',
          onPress: () => {
            Alert.alert('Premium', 'Redirecionando para assinatura...');
            // TODO: Implementar sistema de pagamento
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser
            ? styles.userBubble
            : isDark
            ? styles.aiBubbleDark
            : styles.aiBubbleLight,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userText : isDark ? styles.aiTextDark : styles.aiTextLight,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#1e3a8a'} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
            LeiFácil IA
          </Text>
          {isOffline && (
            <Text style={styles.offlineText}>
              <Ionicons name="cloud-offline" size={12} /> Modo Offline
            </Text>
          )}
        </View>

        <View style={styles.messageCounter}>
          {!isPremiumUser && (
            <Text style={[styles.counterText, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
              {messageCount}/{MAX_FREE_MESSAGES}
            </Text>
          )}
          {isPremiumUser && <Ionicons name="star" size={20} color="#fbbf24" />}
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#1e3a8a" />
          <Text style={[styles.typingText, isDark ? styles.darkSubtitle : styles.lightSubtitle]}>
            IA digitando...
          </Text>
        </View>
      )}

      {/* Input Area */}
      <View style={[styles.inputContainer, isDark ? styles.darkInput : styles.lightInput]}>
        <TextInput
          style={[styles.input, isDark ? styles.darkText : styles.lightText]}
          placeholder="Digite sua pergunta jurídica..."
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isTyping}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#f9fafb',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  lightHeader: {
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  darkHeader: {
    borderBottomColor: '#374151',
    backgroundColor: '#1f2937',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  offlineText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  },
  messageCounter: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lightText: {
    color: '#111827',
  },
  darkText: {
    color: '#f9fafb',
  },
  lightSubtitle: {
    color: '#6b7280',
  },
  darkSubtitle: {
    color: '#9ca3af',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#1e3a8a',
    borderBottomRightRadius: 4,
  },
  aiBubbleLight: {
    backgroundColor: '#e5e7eb',
    borderBottomLeftRadius: 4,
  },
  aiBubbleDark: {
    backgroundColor: '#374151',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiTextLight: {
    color: '#111827',
  },
  aiTextDark: {
    color: '#f9fafb',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  lightInput: {
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  darkInput: {
    borderTopColor: '#374151',
    backgroundColor: '#1f2937',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

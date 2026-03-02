import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves de armazenamento
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@leifacil:onboarding_completed',
  THEME: '@leifacil:theme',
  SOUND_ENABLED: '@leifacil:sound_enabled',
  MESSAGE_COUNT: '@leifacil:message_count',
  LAST_RESET_DATE: '@leifacil:last_reset_date',
  IS_PREMIUM: '@leifacil:is_premium',
  CHAT_HISTORY: '@leifacil:chat_history',
};

/**
 * Verifica se o onboarding foi concluído
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Erro ao verificar onboarding:', error);
    return false;
  }
}

/**
 * Marca o onboarding como concluído
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
  }
}

/**
 * Reseta o onboarding (para mostrar novamente)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  } catch (error) {
    console.error('Erro ao resetar onboarding:', error);
  }
}

/**
 * Obtém o tema atual
 */
export async function getTheme(): Promise<'light' | 'dark' | null> {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return theme as 'light' | 'dark' | null;
  } catch (error) {
    console.error('Erro ao obter tema:', error);
    return null;
  }
}

/**
 * Salva o tema
 */
export async function setTheme(theme: 'light' | 'dark'): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
}

/**
 * Verifica se o som está habilitado
 */
export async function isSoundEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return value !== 'false'; // Por padrão, som está habilitado
  } catch (error) {
    console.error('Erro ao verificar som:', error);
    return true;
  }
}

/**
 * Define se o som está habilitado
 */
export async function setSoundEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled.toString());
  } catch (error) {
    console.error('Erro ao salvar configuração de som:', error);
  }
}

/**
 * Obtém a contagem de mensagens do dia
 */
export async function getMessageCount(): Promise<number> {
  try {
    const today = new Date().toDateString();
    const lastResetDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE);

    // Se mudou o dia, reseta o contador
    if (lastResetDate !== today) {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, today);
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGE_COUNT, '0');
      return 0;
    }

    const count = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGE_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Erro ao obter contagem de mensagens:', error);
    return 0;
  }
}

/**
 * Incrementa a contagem de mensagens
 */
export async function incrementMessageCount(): Promise<number> {
  try {
    const currentCount = await getMessageCount();
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(STORAGE_KEYS.MESSAGE_COUNT, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Erro ao incrementar contagem de mensagens:', error);
    return 0;
  }
}

/**
 * Adiciona mensagens extras (após assistir anúncio)
 */
export async function addExtraMessages(amount: number): Promise<void> {
  try {
    const currentCount = await getMessageCount();
    const newCount = Math.max(0, currentCount - amount);
    await AsyncStorage.setItem(STORAGE_KEYS.MESSAGE_COUNT, newCount.toString());
  } catch (error) {
    console.error('Erro ao adicionar mensagens extras:', error);
  }
}

/**
 * Verifica se o usuário é premium
 */
export async function isPremium(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM);
    return value === 'true';
  } catch (error) {
    console.error('Erro ao verificar premium:', error);
    return false;
  }
}

/**
 * Define o status premium do usuário
 */
export async function setPremium(premium: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, premium.toString());
  } catch (error) {
    console.error('Erro ao salvar status premium:', error);
  }
}

/**
 * Salva o histórico de chat
 */
export async function saveChatHistory(messages: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  } catch (error) {
    console.error('Erro ao salvar histórico de chat:', error);
  }
}

/**
 * Obtém o histórico de chat
 */
export async function getChatHistory(): Promise<any[]> {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Erro ao obter histórico de chat:', error);
    return [];
  }
}

/**
 * Limpa o histórico de chat
 */
export async function clearChatHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  } catch (error) {
    console.error('Erro ao limpar histórico de chat:', error);
  }
}

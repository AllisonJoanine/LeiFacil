/**
 * Serviço de integração com OpenAI via backend proxy
 * 
 * IMPORTANTE: Por segurança, a API key da OpenAI NÃO deve estar no código do app.
 * Este serviço se comunica com um backend proxy que faz as chamadas à OpenAI.
 * 
 * Para desenvolvimento local, você pode usar: http://localhost:3000/chat
 * Para produção, substitua pela URL do seu backend hospedado (ex: Vercel, Railway, etc)
 */

// URL do backend proxy - SUBSTITUA pela URL do seu servidor
const BACKEND_URL = 'https://seu-backend.vercel.app/chat';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

/**
 * Envia uma mensagem para a IA via backend proxy
 * @param message - Mensagem do usuário
 * @param conversationHistory - Histórico da conversa (opcional)
 * @returns Resposta da IA
 */
export async function sendMessageToAI(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    // Prepara o contexto jurídico para a IA
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `Você é um assistente jurídico especializado em direito brasileiro. 
      Seu nome é LeiFácil IA. Você deve:
      - Responder de forma clara, objetiva e acessível
      - Citar artigos de leis quando relevante
      - Explicar termos jurídicos complexos de forma simples
      - Sempre alertar que suas respostas são informativas e não substituem consulta com advogado
      - Ser educado e profissional
      - Focar em direito constitucional, penal, civil, trabalhista e do consumidor brasileiro`,
    };

    const messages: ChatMessage[] = [
      systemMessage,
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data.message || data.choices?.[0]?.message?.content || 'Sem resposta',
    };
  } catch (error) {
    console.error('Erro ao comunicar com IA:', error);
    return {
      message: '',
      error: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
    };
  }
}

/**
 * Verifica se há conexão com o backend
 * @returns true se o backend está acessível
 */
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(BACKEND_URL.replace('/chat', '/health'), {
      method: 'GET',
      timeout: 5000,
    } as any);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Backend Proxy para LeiFácil Mobile
 * 
 * Este servidor protege a API key da OpenAI e processa requisições do app.
 * 
 * DEPLOY:
 * - Vercel: adicione vercel.json e faça deploy com `vercel`
 * - Railway: conecte o repositório e configure variáveis de ambiente
 * - Heroku: adicione Procfile e faça deploy via Git
 * 
 * INSTALAÇÃO:
 * npm install express cors dotenv axios
 * 
 * EXECUÇÃO LOCAL:
 * node server.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'LeiFácil Backend está funcionando!' });
});

// Rota principal de chat
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Mensagens inválidas' });
    }

    // Verifica se a API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key não configurada no servidor' 
      });
    }

    // Faz a requisição para a OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Retorna a resposta da IA
    const aiMessage = response.data.choices[0].message.content;
    res.json({ message: aiMessage });

  } catch (error) {
    console.error('Erro ao processar requisição:', error.message);
    
    if (error.response) {
      // Erro da API da OpenAI
      return res.status(error.response.status).json({
        error: 'Erro ao comunicar com a IA',
        details: error.response.data,
      });
    }

    // Erro genérico
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message,
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/chat`);
});

module.exports = app;

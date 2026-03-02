# LeiFácil Backend Proxy

Backend seguro para o aplicativo LeiFácil Mobile. Este servidor protege a API key da OpenAI e processa as requisições do aplicativo.

## 🚀 Instalação Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env e adicione sua API key da OpenAI

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

## 🌐 Deploy

### Vercel (Recomendado)

1. Instale a CLI da Vercel:
```bash
npm install -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Configure a variável de ambiente:
```bash
vercel env add OPENAI_API_KEY
```

4. Faça o deploy:
```bash
vercel --prod
```

### Railway

1. Crie uma conta em [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure a variável de ambiente `OPENAI_API_KEY`
4. O deploy será automático

### Heroku

1. Crie um arquivo `Procfile`:
```
web: node server.js
```

2. Deploy:
```bash
heroku create leifacil-backend
heroku config:set OPENAI_API_KEY=sua-chave-aqui
git push heroku main
```

## 📡 Endpoints

### GET /health
Verifica se o servidor está funcionando.

**Resposta:**
```json
{
  "status": "ok",
  "message": "LeiFácil Backend está funcionando!"
}
```

### POST /chat
Processa mensagens do chat e retorna resposta da IA.

**Request:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "Você é um assistente jurídico..."
    },
    {
      "role": "user",
      "content": "O que é habeas corpus?"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Habeas corpus é um remédio constitucional..."
}
```

## 🔒 Segurança

- ✅ API key protegida no servidor
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Tratamento de erros

## 📝 Notas

- A API key da OpenAI NUNCA deve estar no código do app
- Use variáveis de ambiente para configurações sensíveis
- Monitore o uso da API para evitar custos excessivos
- Implemente rate limiting em produção se necessário

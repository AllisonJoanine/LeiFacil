# 📘 Guia de Implementação – LeiFácil Mobile

Parabéns! O desenvolvimento inicial do seu aplicativo **LeiFácil Mobile** está concluído. Este guia detalha todos os passos para você executar, testar, e fazer o deploy da aplicação completa.

## 1. Visão Geral do Projeto

O projeto foi estruturado para ser moderno, seguro e escalável, separando o frontend (app mobile) do backend (servidor proxy).

- **Frontend:** Aplicativo React Native com Expo, TypeScript, e Expo Router.
- **Backend:** Servidor Node.js com Express para proteger sua chave da API da OpenAI.

### Estrutura Final dos Arquivos

```
leifacil/
│
├── app/                     # Telas da aplicação
│   ├── _layout.tsx          # Roteador principal (verifica onboarding)
│   ├── index.tsx            # Ponto de entrada (fallback)
│   ├── onboarding.tsx       # Tela de tutorial inicial
│   ├── home.tsx             # Tela de boas-vindas
│   ├── chat.tsx             # Tela principal do chat com a IA
│   └── settings.tsx         # Tela de configurações
│
├── assets/                  # Arquivos estáticos
│   ├── images/              # Ícones e imagens do app
│   ├── json/laws.json       # Base de dados local de leis
│   └── lottie/              # (Pasta para futuras animações Lottie)
│
├── backend/                 # Servidor proxy Node.js
│   ├── server.js            # Lógica principal do servidor Express
│   ├── package.json         # Dependências do backend
│   ├── .env.example         # Exemplo de arquivo de ambiente
│   ├── vercel.json          # Configuração para deploy na Vercel
│   └── README.md            # Guia do backend
│
├── services/                # Lógica de comunicação com APIs
│   ├── openaiService.ts     # Comunicação com o backend proxy
│   ├── adsService.ts        # (Estrutura) Controle de anúncios AdMob
│   └── premiumService.ts    # (Estrutura) Verificação do plano Premium
│
├── utils/                   # Funções utilitárias
│   ├── offlineSearch.ts     # Lógica de busca offline com Fuse.js
│   ├── storage.ts           # Gerenciador de AsyncStorage
│   └── theme.ts             # Constantes de tema e estilo
│
├── IMPLEMENTATION_GUIDE.md  # Este guia
├── app.json                 # Configurações do Expo
├── package.json             # Dependências do app
└── tsconfig.json            # Configurações do TypeScript
```

## 2. Configurando o Backend (Servidor Proxy)

Este passo é **crucial** para a segurança da sua chave da OpenAI. O backend atuará como um intermediário seguro entre o seu app e a API da OpenAI.

### a. Instalação

Navegue até a pasta do backend e instale as dependências:

```bash
cd /home/ubuntu/leifacil/backend
npm install
```

### b. Configurando a Chave da API

1.  Crie um arquivo `.env` na pasta `backend/` (você pode copiar o `.env.example`).
2.  Abra o arquivo `.env` e insira sua chave secreta da OpenAI:

    ```
    OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

    **Atenção:** Nunca compartilhe ou exponha essa chave publicamente.

### c. Executando Localmente

Para testar o backend em sua máquina:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

### d. Fazendo o Deploy (Publicando na Internet)

Para que o seu aplicativo possa acessar o backend de qualquer lugar, você precisa publicá-lo. A **Vercel** é uma excelente opção gratuita e fácil de usar.

1.  **Instale a Vercel CLI:**

    ```bash
    npm install -g vercel
    ```

2.  **Faça o deploy:**

    Dentro da pasta `backend/`, execute o comando:

    ```bash
    vercel --prod
    ```

    Siga as instruções para fazer login e criar o projeto. Ao final, a Vercel fornecerá uma URL pública para o seu backend (ex: `https://leifacil-backend.vercel.app`). **Guarde esta URL!**

## 3. Configurando o Frontend (Aplicativo Mobile)

Agora, vamos conectar o aplicativo ao backend que você acabou de publicar.

### a. Conectando ao Backend

1.  Abra o arquivo `services/openaiService.ts`.
2.  Encontre a constante `BACKEND_URL` e **substitua a URL de exemplo pela URL do seu backend** fornecida pela Vercel.

    ```typescript
    // URL do backend proxy - SUBSTITUA pela URL do seu servidor
    const BACKEND_URL = 'https://sua-url-da-vercel.app/chat';
    ```

### b. Instalando Dependências

Se você ainda não o fez, instale as dependências do app na pasta raiz do projeto:

```bash
cd /home/ubuntu/leifacil
npm install
```

### c. Executando o Aplicativo

Com tudo configurado, inicie o Expo:

```bash
npm start
```

Isso abrirá o Metro Bundler. Você pode usar o aplicativo de várias maneiras:

- **Expo Go (Recomendado para testes):** Escaneie o QR code com o app Expo Go em seu celular (Android ou iOS).
- **Emuladores:** Execute em um emulador Android ou simulador iOS se tiver o ambiente configurado.
- **Web:** Teste a versão web diretamente no navegador.

## 4. Próximos Passos (Monetização)

As funcionalidades de monetização (anúncios e compras no app) foram estruturadas, mas requerem configuração final nas respectivas plataformas.

### a. Anúncios com AdMob

1.  Crie uma conta no [Google AdMob](https://admob.google.com/).
2.  Crie um novo aplicativo e gere os IDs dos blocos de anúncios (Rewarded Ad).
3.  Instale a biblioteca do AdMob:

    ```bash
    expo install expo-ads-admob
    ```

4.  Configure os IDs no `app.json`.
5.  Implemente a lógica de exibição de anúncios no arquivo `services/adsService.ts` e na tela de chat (`chat.tsx`).

### b. Assinatura Premium

1.  Configure os produtos de assinatura no **Google Play Console** (Android) e **App Store Connect** (iOS).
2.  Instale uma biblioteca de compras no app, como `expo-in-app-purchases`.
3.  Implemente a lógica de compra e restauração no arquivo `services/premiumService.ts`.

## 5. Conclusão

Seu aplicativo está pronto para ser testado e, após a configuração da monetização, para ser publicado nas lojas! Você tem uma base sólida e segura para continuar evoluindo o LeiFácil.

Se tiver qualquer dúvida ou precisar de ajuda com os próximos passos, estou à disposição!

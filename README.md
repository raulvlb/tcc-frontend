# AcadêmicoAI — Frontend

Interface web do chatbot acadêmico construída com Vue 3 + Vite + Tailwind CSS.

## Pré-requisitos

- Node.js 18+
- API do AcadêmicoAI rodando (repositório separado)

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Instale as dependências
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE=http://localhost:8000
VITE_GEMINI_API_KEY=sua-chave-aqui
```

| Variável | Descrição |
|---|---|
| `VITE_API_BASE` | Endereço da API FastAPI |
| `VITE_GEMINI_API_KEY` | Chave da API do Gemini (obtenha em [aistudio.google.com](https://aistudio.google.com)) |

## Como rodar

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

> A API precisa estar rodando em paralelo para o frontend funcionar.

## Como usar

1. Clique em **Novo chat** na barra lateral
2. Selecione a disciplina desejada no modal
3. Clique em **Criar chat**
4. Digite sua dúvida no campo de texto e pressione **Enter**

## Estrutura do projeto

```
src/
├── App.vue                  # Componente raiz
├── main.js                  # Entry point
├── style.css                # Estilos globais + Tailwind
├── stores/
│   └── chat.js              # Gerenciamento de estado (Pinia)
└── components/
    ├── Sidebar.vue          # Barra lateral com lista de chats
    ├── ChatArea.vue         # Área principal de conversa
    ├── ChatMessage.vue      # Componente de mensagem individual
    └── NewChatModal.vue     # Modal de criação de novo chat
```

## Build para produção

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`.
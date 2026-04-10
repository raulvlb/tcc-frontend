import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export const useChatStore = defineStore('chat', () => {
  const chats = ref({})
  const chatAtivoId = ref(null)

  // ── Stores (disciplinas) ────────────────────────────────────────────────
  const disciplinas = ref([])
  const carregandoDisciplinas = ref(false)

  async function buscarDisciplinas() {
    carregandoDisciplinas.value = true
    try {
      const res = await fetch(`${API_BASE}/store/listar`)
      const data = await res.json()
      disciplinas.value = data.stores || []
    } catch (e) {
      console.error('Erro ao buscar disciplinas:', e)
    } finally {
      carregandoDisciplinas.value = false
    }
  }

  // ── Chats ───────────────────────────────────────────────────────────────
  function novoChat(disciplina, storeName) {
    const id = Math.random().toString(36).slice(2, 10)
    chats.value[id] = {
      id,
      titulo: 'Nova conversa',
      disciplina,
      store: storeName,
      messages: [],
    }
    chatAtivoId.value = id
    return id
  }

  function selecionarChat(id) {
    chatAtivoId.value = id
  }

  function getChatAtivo() {
    if (!chatAtivoId.value) return null
    return chats.value[chatAtivoId.value] || null
  }

  // ── Mensagens ───────────────────────────────────────────────────────────
  async function enviarMensagem(prompt) {
    const chat = getChatAtivo()
    if (!chat) return

    // Define título com a primeira pergunta
    if (chat.messages.length === 0) {
      chat.titulo = prompt.slice(0, 45) + (prompt.length > 45 ? '…' : '')
    }

    // Adiciona mensagem do usuário
    chat.messages.push({ role: 'user', content: prompt })

    // Monta histórico (últimas 10 mensagens, excluindo a atual)
    const historico = chat.messages
      .slice(-11, -1)
      .map(m => ({ role: m.role, content: m.content }))

    // Marca como carregando
    chat.messages.push({ role: 'assistant', content: '', loading: true })
    const loadingIdx = chat.messages.length - 1

    try {
      const res = await fetch(`${API_BASE}/store/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gemini_api_key: GEMINI_API_KEY,
          gemini_store_name: chat.store,
          prompt,
          historico,
        }),
      })

      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const data = await res.json()
      chat.messages[loadingIdx] = { role: 'assistant', content: data.resposta }
    } catch (e) {
      chat.messages[loadingIdx] = {
        role: 'assistant',
        content: `⚠️ Erro ao consultar a API: ${e.message}`,
        error: true,
      }
    }
  }

  return {
    chats,
    chatAtivoId,
    disciplinas,
    carregandoDisciplinas,
    buscarDisciplinas,
    novoChat,
    selecionarChat,
    getChatAtivo,
    enviarMensagem,
  }
})

<template>
  <main class="flex-1 flex flex-col h-screen overflow-hidden">

    <!-- Empty state -->
    <div v-if="!chat"
         class="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
      <!-- <div class="w-16 h-16 rounded-2xl bg-[#111512] border border-[#1e2820]
                  flex items-center justify-center text-3xl">
        🌿
      </div> -->
      <div>
        <p class="text-xl font-semibold text-[#ffffff] mb-2">Como posso te ajudar?</p>
        <p class="text-sm text-[#01c38e]">Crie um novo chat e selecione a disciplina para começar.</p>
      </div>
    </div>

    <template v-else>
      <!-- Cabeçalho -->
      <div class="bg-[#1a1e29] rounded-sm" style="margin: 10px 30% 10px 30%;">
        <p class="text-[1rem] text-[#01c38e] font-semibold" style="margin: 5px 10px;">{{ chat.disciplina }}</p>
        <p class="text-[1rem] font-mono text-[#e8f0ea]" style="margin: 5px 10px;">{{ tituloExibido }}</p>
      </div>

      <!-- Mensagens -->
      <div ref="messagesEl"
           class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <ChatMessage
          v-for="(msg, i) in chat.messages"
          :key="i"
          :message="msg"
        />
      </div>

      <!-- Input -->
      <div class="px-6 py-4 border-t border-[#1e2820] shrink-0">
        <div class="flex items-end gap-3
                    bg-[#141914] border border-[#243024]
                    rounded-2xl px-4 py-3
                    focus-within:border-green-800
                    focus-within:shadow-[0_0_0_3px_#16a34a22]
                    transition-all duration-150">
          <textarea
            ref="inputEl"
            v-model="prompt"
            @keydown.enter.exact.prevent="enviar"
            @input="ajustarAltura"
            rows="1"
            placeholder="Faça uma pergunta sobre a disciplina..."
            class="flex-1 bg-transparent text-sm text-[#e8f0ea]
                   placeholder:text-[#3d5443] resize-none outline-none
                   font-['Sora',sans-serif] leading-6 max-h-40 overflow-y-auto"
          />
          <button
            @click="enviar"
            :disabled="!prompt.trim() || carregando"
            class="shrink-0 w-8 h-8 rounded-lg
                   bg-green-700 hover:bg-green-600
                   disabled:opacity-30 disabled:cursor-not-allowed
                   flex items-center justify-center
                   transition-all duration-150
                   hover:shadow-[0_0_12px_#16a34a55]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="white" class="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
            </svg>
          </button>
        </div>
        <p class="text-[11px] text-[#3d5443] text-center mt-2 font-mono">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </template>

  </main>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useChatStore } from '../stores/chat'
import ChatMessage from './ChatMessage.vue'

const store = useChatStore()
const prompt = ref('')
const messagesEl = ref(null)
const inputEl = ref(null)

const chat = computed(() => store.getChatAtivo())
const tituloExibido = computed(() => {
  const titulo = chat.value?.titulo ?? ''
  if (titulo.length <= 84) return titulo
  return titulo.slice(0, 81) + '...'
})
const carregando = computed(() => {
  const msgs = chat.value?.messages || []
  return msgs.some(m => m.loading)
})

async function enviar() {
  const texto = prompt.value.trim()
  if (!texto || carregando.value) return
  prompt.value = ''
  await nextTick()
  if (inputEl.value) {
    inputEl.value.style.height = 'auto'
  }
  await store.enviarMensagem(texto)
}

function ajustarAltura() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

// Scroll automático ao receber mensagem nova
watch(
  () => chat.value?.messages?.length,
  async () => {
    await nextTick()
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  }
)
</script>

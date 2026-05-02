<template>
  <main class="flex h-screen flex-1 flex-col overflow-hidden bg-[hsl(var(--background))]">
    
    <div v-if="!chat"
      class="flex flex-1 items-center justify-center px-8">
      <div class="w-full max-w-5xl">

        <div class="flex flex-col items-center gap-6 md:flex-row">
         
          <div class="w-50 h-40 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-6">
            <img src="../assets/botLogo.png"/>
          </div>

          <Card class="h-40 w-full text-center flex itens-center justify-center"">
            <template #header>
              <h2 class="text-xl font-semibold">Como posso te ajudar?</h2>
              <p class="text-sm text-[hsl(var(--muted-foreground))]">
                Crie um novo chat e selecione a disciplina para começar.
              </p>
              <div class="px-4 py-4">
                <Button class="w-full justify-center cursor-pointer" @click="open">
                  Nova conversa
                </Button>
              </div>
            </template>
          </Card>

        </div>
      </div>
    </div>

    <template v-else>
      <div ref="messagesEl"
        class="scrollbar-fade flex-1 overflow-y-auto px-6 py-6 mx-auto w-full max-w-7xl">
        <Card class="mx-auto w-full max-w-7xl">
          <div class="flex flex-wrap items-center gap-2">
            <Badge>{{ chat.disciplina }}</Badge>
            <span class="font-mono text-sm text-[hsl(var(--muted-foreground))]">{{ tituloExibido }}</span>
          </div>
        </Card>

        <div class="mt-4 space-y-4">
          <ChatMessage
            v-for="(msg, i) in chat.messages"
            :key="i"
            :message="msg"
          />
        </div>
      </div>

      <div class="shrink-0 px-6 pb-6">
        <Card class="mx-auto w-full max-w-7xl" style="box-shadow: 0px 0px 20px 5px #0A0A0A;">
          <div class="space-y-3">
            <Textarea
            v-model="prompt"
            @keydown="handleKeydown"
            rows="1"
            placeholder="Faça uma pergunta sobre a disciplina..."
            classes="w-full min-h-[48px] max-h-[200px] resize-none rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-3 text-sm leading-6 text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          />
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-mono text-[hsl(var(--muted-foreground))]">
                Enter para enviar · Shift+Enter para nova linha
              </p>
              <Button
             @click="enviar"
             :disabled="!prompt.trim() || carregando"
                size="sm"
              >
                Enviar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </template>

  </main>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useChatStore } from '../stores/chat'
import ChatMessage from './ChatMessage.vue'
import Card from './ui/Card.vue'
import Badge from './ui/Badge.vue'
import Textarea from './ui/Textarea.vue'
import Button from './ui/Button.vue'
import { useNewChatModal } from '../composables/useNewChatModal'

const { open } = useNewChatModal()

const store = useChatStore()
const prompt = ref('')
const messagesEl = ref(null)

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
  await store.enviarMensagem(texto)
}

function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    enviar()
  }
}

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

<template>
  <aside class="h-screen w-full border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]">
    <div class="flex h-full flex-col">
      <div class="space-y-1 border-b border-[hsl(var(--border))] px-5 py-5">
        <p class="text-lg font-semibold">AcadêmicoAI</p>
        <p class="font-mono text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          assistente de estudos
        </p>
      </div>

      <div class="px-4 py-4">
        <Button class="w-full justify-start cursor-pointer" @click="open">
          Nova conversa
        </Button>
      </div>

      <div class="flex-1 overflow-y-auto px-3 pb-4">
        <p class="px-2 pb-2 font-mono text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Recentes
        </p>

        <div v-if="chatsOrdenados.length === 0" class="rounded-md border border-dashed border-[hsl(var(--border))] p-3 text-sm text-[hsl(var(--muted-foreground))]">
          Nenhuma conversa ainda
        </div>

        <div v-else class="space-y-1">
          <Button
            v-for="chat in chatsOrdenados"
            :key="chat.id"
            variant="ghost"
            class="w-full justify-start truncate"
            :class="store.chatAtivoId === chat.id ? 'bg-[hsl(var(--muted))]' : ''"
            @click="store.selecionarChat(chat.id)"
          >
            {{ chat.titulo }}
          </Button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useChatStore } from '../stores/chat'
import Button from './ui/Button.vue'
import { useNewChatModal } from '../composables/useNewChatModal'

const store = useChatStore()
const { open } = useNewChatModal()

const chatsOrdenados = computed(() => {
  return Object.values(store.chats).slice().reverse()
})

</script>

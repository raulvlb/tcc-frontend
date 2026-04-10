<template>
  <aside class="w-64 shrink-0 flex flex-col bg-[#111512] border-r border-[#1e2820] h-screen">

    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-[#1e2820]">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800
                  flex items-center justify-center text-base shrink-0">
        🌿
      </div>
      <div>
        <p class="text-sm font-semibold text-[#e8f0ea]">AcadêmicoAI</p>
        <p class="text-[10px] text-[#3d5443] font-mono">assistente de estudos</p>
      </div>
    </div>

    <!-- Botão novo chat -->
    <div class="px-4 pt-4 pb-2">
      <button
        @click="showModal = true"
        class="w-full flex items-center justify-center gap-2
               bg-gradient-to-r from-green-700 to-green-800
               hover:from-green-600 hover:to-green-700
               text-white text-sm font-medium
               py-2.5 px-4 rounded-lg
               transition-all duration-150
               hover:shadow-[0_0_20px_#16a34a44]"
      >
        <span class="text-base leading-none">＋</span>
        Novo chat
      </button>
    </div>

    <!-- Lista de chats -->
    <div class="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
      <p v-if="Object.keys(store.chats).length === 0"
         class="text-xs text-[#3d5443] text-center mt-4">
        Nenhuma conversa ainda
      </p>

      <template v-else>
        <p class="text-[10px] font-mono text-[#3d5443] uppercase tracking-widest px-2 py-2">
          Conversas
        </p>

        <button
          v-for="(chat, id) in chatsOrdenados"
          :key="id"
          @click="store.selecionarChat(id)"
          :class="[
            'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-100 truncate',
            store.chatAtivoId === id
              ? 'bg-[#171c18] border border-green-800 text-green-400'
              : 'text-[#7a9480] hover:bg-[#171c18] hover:text-[#e8f0ea] border border-transparent'
          ]"
        >
          <span v-if="store.chatAtivoId === id" class="mr-1">▸</span>
          {{ chat.titulo }}
        </button>
      </template>
    </div>

    <!-- Rodapé -->
    <div class="px-5 py-3 border-t border-[#1e2820]">
      <p class="text-[10px] font-mono text-[#3d5443]">API: {{ apiBase }}</p>
    </div>

  </aside>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useChatStore } from '../stores/chat'

const store = useChatStore()
const showModal = inject('showModal')
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const chatsOrdenados = computed(() => {
  const entries = Object.entries(store.chats)
  return Object.fromEntries(entries.reverse())
})
</script>

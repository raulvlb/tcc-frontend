<template>
  <aside class="w-64 shrink-0 flex flex-col bg-[#1a1e29] border-r border-[#ffffff] h-screen">

    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-[#ffffff]">
      <!-- <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800
                  flex items-center justify-center text-base shrink-0">
        🌿
      </div> -->
      <div>
        <p class="text-[1rem] font-semibold text-white" style="margin: 5px 10px;">AcadêmicoAI</p>
        <p class="text-[1rem] text-white font-mono" style="margin: 5px 10px;">assistente de estudos</p>
      </div>
    </div>

    <!-- Botão novo chat -->
    <div class="px-4 pt-4 pb-2 flex items-start justify-start" style="margin: 20px 10px;">
      <button
        @click="showModal = true"
        class="w-10% text-start gap-2
               bg-[#01c38e]
               text-[#1a1e29] 
               text-[1rem]
               rounded-sm
               cursor-pointer
               " style="padding: 10px;"
      >
        Nova Conversa
      </button>
    </div>

    <!-- Lista de chats -->
    <div class="flex-1 overflow-y-auto px-3 py-2 space-y-0.5" style="margin: 20px 10px;">
      <p v-if="Object.keys(store.chats).length === 0"
         class="text-[0.875rem] text-white text-center mt-4 font-1000">
        Nenhuma conversa ainda
      </p>

      <template v-else>
        <p class="text-[1rem] font-mono text-[#ffffff] uppercase tracking-widest px-2 py-2">
          Recentes
        </p>

        <button
          v-for="(chat, id) in chatsOrdenados"
          :key="id"
          @click="store.selecionarChat(id)"
          :class="[
            'w-full text-left rounded-sm text-[1rem] transition-all duration-100 truncate',
            store.chatAtivoId === id
              ? 'bg-[#132d46] rounded-sm text-[#ffffff] text-[1rem]'
              : 'text-[#7a9480] hover:bg-[#171c18] hover:text-[#e8f0ea] border border-transparent'
          ]"
          style="padding: 5px 10px;"
        >
          <span v-if="store.chatAtivoId === id" class="mr-1">▸</span>
          {{ chat.titulo }}
        </button>
      </template>
    </div>

    <!-- Rodapé -->
    <!-- <div class="px-5 py-3 border-t border-[#1e2820]">
      <p class="text-[10px] font-mono text-[#3d5443]">API: {{ apiBase }}</p>
    </div> -->

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

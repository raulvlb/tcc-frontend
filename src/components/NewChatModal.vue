<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
              flex items-center justify-center px-4"
       @click.self="$emit('close')">

    <!-- Card -->
    <div class="w-full max-w-md bg-[#111512] border border-[#243024]
                rounded-2xl p-6 shadow-2xl">

      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <p class="text-base font-semibold text-[#e8f0ea]">Nova conversa</p>
          <p class="text-xs text-[#7a9480] mt-0.5">Selecione a disciplina para este chat</p>
        </div>
        <button @click="$emit('close')"
                class="w-7 h-7 rounded-lg flex items-center justify-center
                       text-[#3d5443] hover:text-[#e8f0ea] hover:bg-[#1e2820]
                       transition-all duration-100">
          ✕
        </button>
      </div>

      <!-- Carregando -->
      <div v-if="store.carregandoDisciplinas"
           class="text-sm text-[#7a9480] text-center py-4">
        Buscando disciplinas...
      </div>

      <!-- Sem disciplinas -->
      <div v-else-if="store.disciplinas.length === 0"
           class="text-sm text-[#7a9480] text-center py-4">
        Nenhuma disciplina encontrada.<br>
        <span class="text-xs text-[#3d5443]">Verifique se a API está rodando e há stores indexadas.</span>
      </div>

      <!-- Seletor -->
      <div v-else>
        <label class="block text-[10px] font-mono text-[#3d5443] uppercase tracking-widest mb-2">
          Disciplina
        </label>

        <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
          <button
            v-for="d in store.disciplinas"
            :key="d.gemini_store_name"
            @click="selecionada = d"
            :class="[
              'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-100',
              selecionada?.gemini_store_name === d.gemini_store_name
                ? 'bg-[#1a2e1a] border-green-700 text-green-400'
                : 'bg-[#141914] border-[#1e2820] text-[#7a9480] hover:border-[#243024] hover:text-[#e8f0ea]'
            ]"
          >
            <span class="font-medium">{{ d.store_display_name }}</span>
            <span class="block text-[10px] font-mono mt-0.5 opacity-50 truncate">
              {{ d.drive_folder_id }}
            </span>
          </button>
        </div>

        <!-- Ações -->
        <div class="flex gap-2 mt-5">
          <button
            @click="criar"
            :disabled="!selecionada"
            class="flex-1 py-2.5 rounded-xl text-sm font-medium
                   bg-gradient-to-r from-green-700 to-green-800
                   hover:from-green-600 hover:to-green-700
                   text-white transition-all duration-150
                   disabled:opacity-30 disabled:cursor-not-allowed
                   hover:shadow-[0_0_16px_#16a34a44]"
          >
            Criar chat
          </button>
          <button
            @click="$emit('close')"
            class="flex-1 py-2.5 rounded-xl text-sm font-medium
                   bg-[#141914] border border-[#1e2820]
                   text-[#7a9480] hover:text-[#e8f0ea]
                   transition-all duration-150"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'

const emit = defineEmits(['close'])
const store = useChatStore()
const selecionada = ref(null)

onMounted(() => store.buscarDisciplinas())

function criar() {
  if (!selecionada.value) return
  store.novoChat(selecionada.value.store_display_name, selecionada.value.gemini_store_name)
  emit('close')
}
</script>

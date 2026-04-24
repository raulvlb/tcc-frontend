<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
              flex items-center justify-center px-4"
       @click.self="$emit('close')">

    <!-- Card -->
    <div class="w-full max-w-lg bg-[#1a1e29] border border-[#ffffff]
                rounded-sm" >

      <!-- Header -->
      <div class="flex items-center justify-between mb-5 border-b border-[#ffffff]" style="margin-bottom: 20px; padding: 5px 10px;">
        <div>
          <p class="text-base font-semibold text-[#ffffff] text-[1rem]">Nova conversa</p>
          <p class="text-xs text-[#ffffff] mt-0.5 text-[0.875rem]">Selecione a disciplina para este chat</p>
        </div>
        <button @click="$emit('close')"
                class="w-7 h-7 rounded-lg flex items-center justify-center
                       text-[#ffffff] cursor-pointer">
          ✕
        </button>
      </div>

      <!-- Carregando -->
      <div v-if="store.carregandoDisciplinas"
           class="text-sm text-[#ffffff] text-center py-4" style="margin-bottom: 10px; padding: 5px 10px;">
        Buscando disciplinas...
      </div>

      <!-- Sem disciplinas -->
      <div v-else-if="store.disciplinas.length === 0"
           class="text-sm text-[#ffffff] text-center py-4" style="margin-bottom: 10px; padding: 5px 10px;">
        Nenhuma disciplina encontrada.<br>
        <span class="text-xs text-[#ffffff]">Verifique se a API está rodando e há stores indexadas.</span>
      </div>

      <!-- Seletor -->
      <div v-else style="margin-bottom: 10px; padding: 0px 10px;">
        <!-- <label class="block text-[0.875rem] font-mono text-[#ffffff] uppercase tracking-widest mb-2">
          Disciplina
        </label> -->

        <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
          <button
            v-for="d in store.disciplinas"
            :key="d.gemini_store_name"
            @click="toggleSelecionada(d)"
            :class="[
              'w-full text-left px-4 py-3 rounded-sm border text-[1rem] transition-all duration-100 cursor-pointer',
              selecionada?.gemini_store_name === d.gemini_store_name
                ? 'bg-[#01c38e] border-[#ffffff] text-[#1a1e29]'
                : 'bg-[#1e2820] border-[#ffffff] text-[#01c38e] hover:border-[#ffffff] hover:text-[#1a1e29] hover:bg-[#01c38e]'
            ]"
            style="padding: 5px 10px;"
            >
            <span class="font-medium cursor-pointer">{{ d.store_display_name }}</span>
            <!-- <span class="block text-[10px] font-mono mt-0.5 opacity-50 truncate">
              {{ d.drive_folder_id }}
            </span> -->
          </button>
        </div>

        <!-- Ações -->
        <div class="flex gap-2 mt-5 justify-center" style="margin: 20px 0px;">
          <button
            @click="criar"
            :disabled="!selecionada"
            :class="[
              'bg-[#1e2820] rounded-sm border border-[#ffffff] text-[#ffffff]',
              selecionada
                ? 'hover:border-[#ffffff] hover:text-[#1a1e29] hover:bg-[#01c38e] cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            ]"
            style="padding: 5px 10px;"
          >
            Iniciar Conversa
          </button>
          <!-- <button
            @click="$emit('close')"
            class="flex-1 py-2.5 rounded-sm text-[0.875rem] font-medium
                   bg-[#141914] border border-[#1e2820]
                   text-[#7a9480] hover:text-[#e8f0ea]
                   transition-all duration-150"
          >
            Cancelar
          </button> -->
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

function toggleSelecionada(disciplina) {
  if (selecionada.value?.gemini_store_name === disciplina.gemini_store_name) {
    selecionada.value = null
    return
  }

  selecionada.value = disciplina
}

function criar() {
  if (!selecionada.value) return
  store.novoChat(selecionada.value.store_display_name, selecionada.value.gemini_store_name)
  emit('close')
}
</script>

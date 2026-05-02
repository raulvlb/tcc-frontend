<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <Card class="w-full max-w-lg">
      <template #header>
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <h2 class="text-base font-semibold">Nova conversa</h2>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">
              Selecione a disciplina para este chat
            </p>
          </div>
          <Button variant="ghost" size="icon" @click="$emit('close')">✕</Button>
        </div>
        <Separator />
      </template>

      <div v-if="store.carregandoDisciplinas" class="py-5 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Buscando disciplinas...
      </div>

      <div v-else-if="store.disciplinas.length === 0" class="space-y-1 py-5 text-center">
        <p class="text-sm">Nenhuma disciplina encontrada.</p>
        <p class="text-xs text-[hsl(var(--muted-foreground))]">
          Verifique se a API está rodando e há stores indexadas.
        </p>
      </div>

      <div v-else class="space-y-4">
        <div class="max-h-72 space-y-2 overflow-y-auto pr-1">
          <Button
            v-for="d in store.disciplinas"
            :key="d.store_name"
            variant="outline"
            class="h-auto w-full justify-start py-3 text-left"
            :class="selecionada?.store_name === d.store_name ? 'border-[hsl(var(--accent))] bg-[hsl(var(--muted))]' : ''"
            @click="toggleSelecionada(d)"
          >
            <div class="flex w-full items-center justify-between gap-2">
              <span class="font-medium">{{ d.store_name }}</span>
              <Badge
                v-if="selecionada?.store_name === d.store_name"
                variant="secondary"
              >
                Selecionada
              </Badge>
            </div>
          </Button>
        </div>

        <div class="flex justify-end">
          <Button @click="criar" :disabled="!selecionada">
            Iniciar conversa
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'
import Card from './ui/Card.vue'
import Button from './ui/Button.vue'
import Separator from './ui/Separator.vue'
import Badge from './ui/Badge.vue'

const emit = defineEmits(['close'])
const store = useChatStore()
const selecionada = ref(null)

onMounted(() => store.buscarDisciplinas())

function toggleSelecionada(disciplina) {
  if (selecionada.value?.store_name === disciplina.store_name) {
    selecionada.value = null
    return
  }

  selecionada.value = disciplina
}

function criar() {
  if (!selecionada.value) return
  store.novoChat(selecionada.value.store_name, selecionada.value.store_name)
  emit('close')
}
</script>

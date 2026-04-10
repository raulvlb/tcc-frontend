<template>
  <!-- Usuário -->
  <div v-if="message.role === 'user'"
       class="flex justify-end">
    <div class="max-w-[75%] bg-[#111512] border border-[#1e2820]
                rounded-2xl rounded-tr-sm px-4 py-3
                text-sm text-[#e8f0ea] leading-relaxed whitespace-pre-wrap">
      {{ message.content }}
    </div>
  </div>

  <!-- Assistente -->
  <div v-else class="flex gap-3">
    <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-green-700 to-green-900
                flex items-center justify-center text-sm shrink-0 mt-0.5">
      🌿
    </div>

    <!-- Loading -->
    <div v-if="message.loading"
         class="flex items-center gap-1.5 py-3">
      <span v-for="i in 3" :key="i"
            class="w-1.5 h-1.5 rounded-full bg-green-600 animate-bounce"
            :style="{ animationDelay: `${(i - 1) * 0.15}s` }" />
    </div>

    <!-- Resposta -->
    <div v-else
         :class="[
           'flex-1 text-sm leading-relaxed',
           message.error ? 'text-red-400' : 'text-[#e8f0ea]'
         ]"
         v-html="renderMarkdown(message.content)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  message: { type: Object, required: true }
})

function renderMarkdown(text) {
  if (!text) return ''
  return text
    // Negrito
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Itálico
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Código inline
    .replace(/`([^`]+)`/g, '<code class="bg-[#1e2820] text-green-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    // Listas com bullet
    .replace(/^[\-\*] (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Quebras de linha
    .replace(/\n/g, '<br>')
}
</script>

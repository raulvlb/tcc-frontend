<template>
  <div v-if="message.role === 'user'"
    class="flex justify-end">
    <div class="max-w-[75%] rounded-xl rounded-tr-sm bg-[hsl(var(--accent))] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-[hsl(var(--accent-foreground))]">
      {{ message.content }}
    </div>
  </div>

  <div v-else class="flex gap-3">
    <div class="mt-0.5 flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--muted))]">
      <img src="../assets/botLogo.png" alt="" style="padding: 10px;" />
    </div>

    <div v-if="message.loading"
      class="flex items-center gap-1.5 py-3">
      <span v-for="i in 3" :key="i"
        class="h-1.5 w-1.5 animate-bounce rounded-full bg-[hsl(var(--accent))]"
        :style="{ animationDelay: `${(i - 1) * 0.15}s` }" />
    </div>

    <div
      v-else
      :class="[
        'chat-markdown w-fit max-w-[75%] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm leading-relaxed wrap-break-word',
        message.error ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--foreground))]'
      ]"
    >
      <div v-html="renderMarkdown(message.content)" />

      <div v-if="referenciasFormatadas.length" class="mt-3 border-t border-[hsl(var(--border))] pt-3">
        <p class="mb-2 font-mono text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Referências
        </p>
        <ul class="space-y-1">
          <li v-for="(ref, i) in referenciasFormatadas" :key="i" class="text-sm">
            <a
              v-if="ref.href"
              :href="ref.href"
              target="_blank"
              rel="noopener noreferrer"
              class="underline underline-offset-2"
            >
              {{ ref.label }}
            </a>
            <span v-else class="text-[hsl(var(--muted-foreground))]">
              {{ ref.label }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  message: { type: Object, required: true }
})

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]

  const targetIndex = token.attrIndex('target')
  if (targetIndex < 0) token.attrPush(['target', '_blank'])
  else token.attrs[targetIndex][1] = '_blank'

  const relIndex = token.attrIndex('rel')
  if (relIndex < 0) token.attrPush(['rel', 'noopener noreferrer'])
  else token.attrs[relIndex][1] = 'noopener noreferrer'

  return defaultLinkOpen(tokens, idx, options, env, self)
}

function renderMarkdown(text) {
  if (!text) return ''
  const html = md.render(text)
  return DOMPurify.sanitize(html, { ADD_ATTR: ['target', 'rel'] })
}

function normalizarUrl(url) {
  if (!url || typeof url !== 'string') return null
  let candidate = url.trim()
  if (!candidate) return null

  // Tenta ajudar quando vier sem protocolo.
  if (!/^https?:\/\//i.test(candidate)) {
    if (/^www\./i.test(candidate) || /^[^\s]+\.[^\s]+/.test(candidate)) {
      candidate = `https://${candidate}`
    } else {
      return null
    }
  }

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed.toString()
  } catch {
    return null
  }
}

const referenciasFormatadas = computed(() => {
  const refs = props.message?.referencias ?? props.message?.references ?? []
  if (!Array.isArray(refs)) return []

  return refs
    .filter(r => typeof r === 'string' && r.trim())
    .map(r => ({ label: r.trim(), href: normalizarUrl(r) }))
})
</script>

<style scoped>
.chat-markdown :deep(a) {
  color: hsl(var(--accent));
  text-decoration: underline;
  text-underline-offset: 2px;
}

.chat-markdown :deep(code) {
  padding: 0.15rem 0.35rem;
  border-radius: 0.375rem;
  background: hsl(var(--muted));
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
}

.chat-markdown :deep(pre) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: hsl(var(--muted));
  overflow: auto;
}

.chat-markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 0.75rem;
}
</style>

<template>
  <textarea
    ref="textareaEl"
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="classes"
    @input="handleInput"
    @keydown="$emit('keydown', $event)"
  />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  rows: {
    type: [String, Number],
    default: 1,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  classes: {
    type: String,
    default:
      'flex min-h-[60px] w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:cursor-not-allowed disabled:opacity-50',
  },

  autoResize: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: Number,
    default: 200,
  },
})

const emit = defineEmits(['update:modelValue', 'keydown'])

const textareaEl = ref(null)

function resizeToFit(el) {
  if (!props.autoResize || !el) return

  el.style.height = 'auto'
  const nextHeight = Math.min(el.scrollHeight, props.maxHeight)
  el.style.height = `${nextHeight}px`
  el.style.overflowY = el.scrollHeight > props.maxHeight ? 'auto' : 'hidden'
}

function handleInput(event) {
  const el = event.target
  resizeToFit(el)
  emit('update:modelValue', el.value)
}

onMounted(() => {
  resizeToFit(textareaEl.value)
})

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    resizeToFit(textareaEl.value)
  }
)
</script>

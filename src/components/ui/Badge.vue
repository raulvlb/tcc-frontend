<template>
  <span
    :class="[baseClasses, variantClasses]"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
})

const baseClasses =
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors'

const variantClasses = computed(() => {
  const map = {
    default: 'border-transparent bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]',
    secondary: 'border-transparent bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]',
    outline: 'border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
    destructive: 'border-transparent bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]',
  }

  return map[props.variant] || map.default
})
</script>

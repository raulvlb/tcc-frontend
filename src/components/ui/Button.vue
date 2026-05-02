<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[baseClasses, variantClasses, sizeClasses]"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'default',
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const baseClasses =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:pointer-events-none disabled:opacity-50'

const variantClasses = computed(() => {
  const map = {
    default: 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:brightness-110 cursor-pointer',
    secondary: 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:brightness-125',
    ghost: 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
    outline: 'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))]',
    destructive: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:brightness-110',
  }

  return map[props.variant] || map.default
})

const sizeClasses = computed(() => {
  const map = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  }

  return map[props.size] || map.default
})
</script>

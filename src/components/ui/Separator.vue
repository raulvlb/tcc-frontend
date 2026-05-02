<template>
  <div
    aria-hidden="true"
    class="shrink-0 bg-[hsl(var(--border))]"
    :class="orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full'"
  />
</template>

<script setup>
defineProps({
  orientation: {
    type: String,
    default: 'horizontal',
  },
})
</script>

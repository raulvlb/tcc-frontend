<template>
  <section class="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm">
    <header v-if="$slots.header" class="flex flex-col space-y-1.5 p-5">
      <slot name="header" />
    </header>
    <div :class="$slots.header ? 'px-5 pb-5' : 'p-5'">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="flex items-center p-5 pt-0">
      <slot name="footer" />
    </footer>
  </section>
</template>

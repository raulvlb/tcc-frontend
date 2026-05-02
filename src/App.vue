<template>
  <div class="flex h-screen overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
    <div class="shrink-0" :style="{ width: `${sidebarWidth}px` }">
      <Sidebar />
    </div>

    <div
      class="group relative w-2 shrink-0 cursor-col-resize touch-none"
      role="separator"
      aria-orientation="vertical"
      :aria-valuenow="sidebarWidth"
      :aria-valuemin="SIDEBAR_MIN_WIDTH"
      :aria-valuemax="maxSidebarWidth"
      @pointerdown="startResize"
      @dblclick="resetSidebar"
      title="Arraste para redimensionar"
    >
      <div class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[hsl(var(--border))] transition-colors group-hover:bg-[hsl(var(--accent))]" />
    </div>

    <div class="min-w-0 flex-1">
      <ChatArea />
    </div>
    <NewChatModal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, provide, computed, onBeforeUnmount, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ChatArea from './components/ChatArea.vue'
import NewChatModal from './components/NewChatModal.vue'

const showModal = ref(false)
provide('showModal', showModal)

const SIDEBAR_STORAGE_KEY = 'sidebarWidth'
const SIDEBAR_DEFAULT_WIDTH = 288
const SIDEBAR_MIN_WIDTH = 240

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const maxSidebarWidth = computed(() => Math.floor(windowWidth.value / 2))

function clampSidebarWidth(value) {
  const max = maxSidebarWidth.value || SIDEBAR_DEFAULT_WIDTH
  return Math.min(Math.max(value, SIDEBAR_MIN_WIDTH), max)
}

const sidebarWidth = ref(SIDEBAR_DEFAULT_WIDTH)

function persistSidebarWidth() {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarWidth.value))
  } catch {
    // ignore
  }
}

function resetSidebar() {
  sidebarWidth.value = clampSidebarWidth(SIDEBAR_DEFAULT_WIDTH)
  persistSidebarWidth()
}

function startResize(event) {
  event.preventDefault()

  const prevCursor = document.body.style.cursor
  const prevUserSelect = document.body.style.userSelect
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  const onMove = (e) => {
    sidebarWidth.value = clampSidebarWidth(e.clientX)
  }

  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    document.body.style.cursor = prevCursor
    document.body.style.userSelect = prevUserSelect
    persistSidebarWidth()
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

function onResize() {
  windowWidth.value = window.innerWidth
  sidebarWidth.value = clampSidebarWidth(sidebarWidth.value)
}

onMounted(() => {
  let initial = SIDEBAR_DEFAULT_WIDTH
  try {
    const saved = Number(localStorage.getItem(SIDEBAR_STORAGE_KEY))
    if (Number.isFinite(saved) && saved > 0) initial = saved
  } catch {
    // ignore
  }

  windowWidth.value = window.innerWidth
  sidebarWidth.value = clampSidebarWidth(initial)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

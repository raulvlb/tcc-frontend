<template>
  <div class="flex h-screen bg-[#0d0f0e] text-[#e8f0ea] font-['Sora',sans-serif] overflow-hidden">
    <Sidebar />
    <ChatArea />
    <NewChatModal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ChatArea from './components/ChatArea.vue'
import NewChatModal from './components/NewChatModal.vue'

const showModal = ref(false)
provide('showModal', showModal)
</script>
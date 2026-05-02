import { inject } from 'vue'

export function useNewChatModal() {
  const showModal = inject('showModal', null)

  if (!showModal) {
    throw new Error("useNewChatModal() precisa de provide('showModal', ref(false)) em um componente pai")
  }

  function open() {
    showModal.value = true
  }

  function close() {
    showModal.value = false
  }

  function toggle() {
    showModal.value = !showModal.value
  }

  return { showModal, open, close, toggle }
}

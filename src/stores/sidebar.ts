import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

export const useSidebarState = defineStore('sidebarState', (): { close: Ref<boolean> } => {
  const close = ref<boolean>(false)
  return {
    close
  }
})

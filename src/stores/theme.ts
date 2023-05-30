import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

export const useTheme = defineStore('theme', (): { theme: Ref<string> } => {
  const theme = ref('')
  return {
    theme
  }
})

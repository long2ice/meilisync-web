import { defineStore } from 'pinia'
import type { Language } from '@/types/common'
import { ref } from 'vue'
import type { Ref } from 'vue'

export const useLanguage = defineStore('language', (): { language: Ref<Language> } => {
  const language = ref<Language>('en-US')
  return {
    language
  }
})

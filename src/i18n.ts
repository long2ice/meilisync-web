import { createI18n } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'
import en from '@/locales/en-US'
import zh from '@/locales/zh-CN'

const datetimeFormats: I18nOptions['datetimeFormats'] = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  'zh-CN': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}

export const i18n = createI18n({
  messages: {
    'en-US': en,
    'zh-CN': zh
  },
  fallbackLocale: 'en-US',
  datetimeFormats,
  legacy: false
})

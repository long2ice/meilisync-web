import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import * as ConfirmDialog from 'vuejs-confirm-dialog'
import Clipboard from 'v-clipboard'
import 'nprogress/nprogress.css'
import { i18n } from '@/i18n'
import { pinia } from '@/stores/pinia'

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000
} as ToastContainerOptions)
app.use(ConfirmDialog)
app.use(Clipboard)
app.mount('#app')

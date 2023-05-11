import axios from 'axios'
import { toast } from 'vue3-toastify'
import { i18n } from '@/i18n'
import Nprogress from 'nprogress'
import router from '@/router'
import { useAuth } from '@/stores/auth'
import { refresh } from '@/api/auth'
const http = axios.create({
  baseURL: import.meta.env.API_URL || '/api'
})
let isRefreshing = false
http.interceptors.request.use((config) => {
  Nprogress.start()
  const auth = useAuth()
  const token = auth.token
  config.headers = config.headers ?? {}
  const path = config.url
  if (path !== '/auth/login' && path !== '/auth/refresh') {
    config.headers.Authorization = `Bearer ${token.access_token}`
  } else if (path === '/auth/refresh') {
    config.headers.Authorization = `Bearer ${token.refresh_token}`
  }
  return config
})
http.interceptors.response.use(
  function (response) {
    Nprogress.done()
    return response
  },
  async function (error) {
    Nprogress.done()
    const response = error.response
    const status = response.status
    const err = response.data.error
    if (status === 401) {
      if (err.includes('Token time expired')) {
        if (isRefreshing) {
          return Promise.reject(error)
        }
        isRefreshing = true
        const auth = useAuth()
        auth.token = await refresh()
        isRefreshing = false
        return http.request(error.config)
      } else {
        toast.error(err)
        await router.push({ path: '/login' })
      }
    } else if (status < 500) {
      toast.error(err)
    } else {
      toast.error(i18n.global.t('error.server'))
    }
    return Promise.reject(error)
  }
)
export default http

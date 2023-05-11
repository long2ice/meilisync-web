import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(
  createPersistedState({
    auto: true
  })
)

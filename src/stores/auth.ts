import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { AdminResponse, TokenResponse } from '@/types/responses'

export const useAuth = defineStore(
  'auth',
  (): {
    token: Ref<TokenResponse>
    admin: Ref<AdminResponse>
    sign_out: () => void
    oauth_type: Ref<string>
  } => {
    const token = ref<TokenResponse>({
      access_token: '',
      refresh_token: ''
    })
    const admin = ref<AdminResponse>({
      created_at: '',
      email: '',
      id: 0,
      is_active: false,
      is_superuser: false,
      last_login_at: '',
      nickname: '',
      updated_at: '',
      password: ''
    })
    const oauth_type = ref('')
    const sign_out = () => {
      token.value = {
        access_token: '',
        refresh_token: ''
      }
      admin.value = {
        created_at: '',
        email: '',
        id: 0,
        is_active: false,
        is_superuser: false,
        last_login_at: '',
        nickname: '',
        password: '',
        updated_at: ''
      }
    }
    return {
      token,
      admin,
      sign_out,
      oauth_type
    }
  }
)

import http from '@/axios'
import type { OauthResponse, TokenResponse } from '@/types/responses'

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await http.post('/auth/login', {
    email,
    password
  })
  return data
}
export async function refresh(): Promise<TokenResponse> {
  const { data } = await http.post('/auth/refresh')
  return data
}
export async function getOauth(redirect_uri: string): Promise<OauthResponse[]> {
  const { data } = await http.get('/auth/oauth', {
    params: {
      redirect_uri
    }
  })
  return data
}
export async function loginWithOauth(
  code: string,
  oauth_type: string,
  state: string
): Promise<TokenResponse> {
  const { data } = await http.post(`/auth/${oauth_type}`, null, {
    params: {
      code,
      state
    }
  })
  return data
}

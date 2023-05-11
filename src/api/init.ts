import http from '@/axios'
import type { InitedResponse } from '@/types/responses'

export async function initAdmin(email: string, password: string, nickname: string): Promise<void> {
  await http.post('/init/admin', {
    email,
    password,
    nickname
  })
}

export async function getInit(): Promise<InitedResponse> {
  const { data } = await http.get('/init')
  return data
}

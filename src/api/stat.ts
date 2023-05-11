import http from '@/axios'
import type { StatResponse } from '@/types/responses'

export async function getStats(): Promise<StatResponse> {
  const { data } = await http.get('/stat')
  return data
}

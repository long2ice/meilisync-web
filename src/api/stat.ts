import http from '@/axios'
import type { StatResponse } from '@/types/responses'

export async function getStats(start_date: string, end_date: string): Promise<StatResponse> {
  const { data } = await http.get('/stat', {
    params: {
      start_date,
      end_date
    }
  })

  return data
}

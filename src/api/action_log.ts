import http from '@/axios'
import type { Sort } from '@/types/common'

export async function getActionLogs(
  limit: number,
  offset: number,
  method?: string,
  path?: string,
  admin_id?: number,
  sorts?: Sort[]
) {
  const params: Record<string, any> = {
    limit,
    offset
  }
  if (method) {
    params.method = method
  }
  if (path) {
    params.path = path
  }
  if (admin_id) {
    params.admin_id = admin_id
  }
  if (sorts) {
    params.sorts = JSON.stringify(sorts)
  }
  const { data } = await http.get('/action_log', {
    params: params
  })
  return data
}
export async function deleteActionLogs(ids: number[]): Promise<void> {
  const idsStr = ids.join(',')
  const { data } = await http.delete(`/action_log/${idsStr}`)
  return data
}

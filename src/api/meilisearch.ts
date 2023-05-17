import http from '@/axios'
import type { Sort } from '@/types/common'
import type { MeilisearchsResponse } from '@/types/responses'

export async function createMeilisearch(label: string, api_url: string, api_key: string) {
  const { data } = await http.post('/meilisearch', {
    label,
    api_url,
    api_key
  })
  return data
}

export async function getMeilisearchs(
  limit: number,
  offset: number,
  label?: string,
  sorts?: Sort[]
): Promise<MeilisearchsResponse> {
  const params: Record<string, any> = {
    limit,
    offset
  }
  if (label) {
    params.label = label
  }
  if (sorts) {
    params.sorts = JSON.stringify(sorts)
  }
  const { data } = await http.get('/meilisearch', {
    params: params
  })
  return data
}
export async function deleteMeilisearchs(ids: number[]): Promise<void> {
  const idsStr = ids.join(',')
  const { data } = await http.delete(`/meilisearch/${idsStr}`)
  return data
}

import http from '@/axios'
import type { Sort } from '@/types/common'
import type { BasicResponse, MeilisearchsResponse } from '@/types/responses'

export async function updateMeilisearch(
  id: number,
  label: string,
  api_url: string,
  api_key?: string,
  insert_size?: number,
  insert_interval?: number
) {
  const params: Record<string, any> = {
    label,
    api_url
  }
  if (api_key) {
    params.api_key = api_key
  }
  if (insert_size) {
    params.insert_size = insert_size
  }
  if (insert_interval) {
    params.insert_interval = insert_interval
  }
  const { data } = await http.put(`/meilisearch/${id}`, params)
  return data
}
export async function getBasic(): Promise<BasicResponse[]> {
  const { data } = await http.get(`/meilisearch/basic`)
  return data
}
export async function createMeilisearch(
  label: string,
  api_url: string,
  api_key?: string,
  insert_size?: number,
  insert_interval?: number
) {
  const params: Record<string, any> = {
    label,
    api_url
  }
  if (api_key) {
    params.api_key = api_key
  }
  if (insert_size) {
    params.insert_size = insert_size
  }
  if (insert_interval) {
    params.insert_interval = insert_interval
  }
  const { data } = await http.post('/meilisearch', params)
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

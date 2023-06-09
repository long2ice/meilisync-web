import type { Sort } from '@/types/common'
import http from '@/axios'
import type { BasicResponse, SyncsResponse } from '@/types/responses'
import type { SyncLogsResponse, SyncType } from '@/types/responses'

export async function createSync(values: Record<string, any>): Promise<void> {
  const { data } = await http.post('/sync', values)
  return data
}

export async function getSyncs(
  limit: number,
  offset: number,
  label?: string,
  sorts?: Sort[],
  source_id?: number,
  meiliseach_id?: number,
  enabled?: boolean
): Promise<SyncsResponse> {
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
  if (source_id) {
    params.source_id = source_id
  }
  if (meiliseach_id) {
    params.meiliseach_id = meiliseach_id
  }
  if (enabled !== undefined) {
    params.enabled = enabled
  }
  const { data } = await http.get('/sync', {
    params: params
  })
  return data
}
export async function deleteSyncs(ids: number[]): Promise<void> {
  const idsStr = ids.join(',')
  const { data } = await http.delete(`/sync/${idsStr}`)
  return data
}

export async function getSyncLogs(
  limit: number,
  offset: number,
  sorts?: Sort[],
  sync_id?: number,
  meilisearch_id?: number,
  source_id?: number,
  type?: SyncType
): Promise<SyncLogsResponse> {
  const params: Record<string, any> = {
    limit,
    offset
  }
  if (sorts) {
    params.sorts = JSON.stringify(sorts)
  }
  if (sync_id) {
    params.sync_id = sync_id
  }
  if (meilisearch_id) {
    params.meilisearch_id = meilisearch_id
  }
  if (source_id) {
    params.source_id = source_id
  }
  if (type) {
    params.type = type
  }
  const { data } = await http.get('/sync/logs', {
    params: params
  })
  return data
}
export async function deleteSyncLogs(ids: number[]): Promise<void> {
  const idsStr = ids.join(',')
  const { data } = await http.delete(`/sync/logs/${idsStr}`)
  return data
}
export async function refreshSync(id: number) {
  const { data } = await http.post(`/sync/${id}/refresh`)
  return data
}
export async function editSync(id: number, body: Record<string, any>) {
  const { data } = await http.put(`/sync/${id}`, body)
  return data
}
export async function getBasic(): Promise<BasicResponse[]> {
  const { data } = await http.get('/sync/basic')
  return data
}

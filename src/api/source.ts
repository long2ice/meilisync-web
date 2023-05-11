import http from '@/axios'
import type { Sort } from '@/types/common'
import type { SourcesResponse, SourceType } from '@/types/responses'

export async function getSources(
  limit: number,
  offset: number,
  label?: string,
  type?: SourceType,
  sorts?: Sort[]
): Promise<SourcesResponse> {
  const params: Record<string, any> = {
    limit,
    offset
  }
  if (label) {
    params.label = label
  }
  if (type) {
    params.type = type
  }
  if (sorts) {
    params.sorts = JSON.stringify(sorts)
  }
  const { data } = await http.get('/source', {
    params: params
  })
  return data
}

export async function createSource(
  name: string,
  type: SourceType,
  options: Record<string, any>
): Promise<void> {
  const { data } = await http.post('/source', {
    name,
    type,
    options
  })
  return data
}
export async function deleteSources(ids: number[]): Promise<void> {
  const idsStr = ids.join(',')
  const { data } = await http.delete(`/source/${idsStr}`)
  return data
}

export async function updateDataSource(
  id: number,
  name: string,
  type: SourceType,
  options: Record<string, any>
): Promise<void> {
  const { data } = await http.patch(`/source/${id}`, {
    name,
    type,
    options
  })
  return data
}

import http from '@/axios'
import type { AdminResponse, AdminsResponse } from '@/types/responses'
import type { Sort } from '@/types/common'

export async function getMe(): Promise<AdminResponse> {
  const { data } = await http.get('/admin/me')
  return data
}

export async function getAdmin(
  limit: number,
  offset: number,
  sorts?: Sort[],
  is_superuser?: boolean,
  is_active?: boolean,
  search?: string
): Promise<AdminsResponse> {
  const params: Record<string, any> = {
    limit,
    offset
  }
  if (sorts) {
    params.sorts = JSON.stringify(sorts)
  }
  if (is_superuser !== undefined) {
    params.is_superuser = is_superuser
  }
  if (is_active !== undefined) {
    params.is_active = is_active
  }
  if (search) {
    params.search = search
  }
  const { data } = await http.get('/admin', {
    params: params
  })
  return data
}

export async function deleteAdmins(ids: number[]): Promise<void> {
  const idsStr = ids.join(',')
  const { data } = await http.delete(`/admin/${idsStr}`)
  return data
}

export async function createAdmin(
  email: string,
  password: string,
  nickname: string,
  is_superuser: boolean,
  is_active: boolean
): Promise<void> {
  await http.post('/admin', {
    email,
    password,
    nickname,
    is_superuser,
    is_active
  })
}

export async function updateAdmin(
  id: number,
  email: string,
  password: string,
  nickname: string,
  is_superuser: boolean,
  is_active: boolean
): Promise<void> {
  await http.patch(`/admin/${id}`, {
    email,
    password,
    nickname,
    is_superuser,
    is_active
  })
}

export async function change_password(old_password: string, new_password: string): Promise<void> {
  await http.patch('/admin/password', {
    old_password,
    new_password
  })
}

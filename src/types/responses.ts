export type SyncType = 'create' | 'update' | 'delete'
export type SourceType = 'mysql' | 'postgres' | 'mongo'
export interface SourceResponse {
  id: number
  created_at: string
  updated_at: string
  label: string
  type: SourceType
  connection: string
}
export interface SourcesResponse {
  total: number
  data: SourceResponse[]
}
export interface SyncLogResponse {
  id: number
  created_at: string
  updated_at: string
  type: SyncType
  sync_id: number
  count: number
}
export interface SyncLogsResponse {
  total: number
  data: SyncLogResponse[]
}
export interface SyncResponse {
  id: number
  created_at: string
  updated_at: string
  label: string
  full_sync: boolean
  table: string
  index: string
  primary_key: string
  enabled: boolean
  fields: string
  meilisearch_id: number
  source_id: number
}
export interface SyncsResponse {
  total: number
  data: SyncResponse[]
}
export interface MeilisearchResponse {
  id: number
  created_at: string
  updated_at: string
  label: string
  api_url: string
  api_key: string
  insert_size: number
  insert_interval: number
}
export interface MeilisearchsResponse {
  total: number
  data: MeilisearchResponse[]
}
export interface SyncLogStatResponse {
  date: string
  count: number
  type: SyncType
}
export interface StatResponse {
  source_count: number
  sync_count: number
  sync_log_count: number
  admin_count: number
  meili_count: number
  action_log_count: number
  sync_logs: SyncLogStatResponse[]
}
export interface TokenResponse {
  access_token: string
  refresh_token: string
}
export interface AdminResponse {
  id: number
  created_at: string
  updated_at: string
  nickname: string
  email: string
  last_login_at: string
  is_superuser: boolean
  is_active: boolean
  password: string
}
export interface AdminsResponse {
  total: number
  data: AdminResponse[]
}
export interface ActionLogResponse {
  id: number
  created_at: string
  updated_at: string
  path: string
  method: string
  content: string
  ip: string
  admin_id: number
}
export interface ActionLogsResponse {
  total: number
  data: ActionLogResponse[]
}
export interface LicenseResponse {
  expire: string
  name: string
}
export interface InitedResponse {
  inited: boolean
}
export interface OauthResponse {
  type: string
  url: string
}
export interface CheckResponse {
  meili_count: number
  count: number
}

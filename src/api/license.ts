import http from '@/axios'
import type { LicenseResponse } from '@/types/responses'

export async function getLicense(): Promise<LicenseResponse> {
  const { data } = await http.get('/license')
  return data
}

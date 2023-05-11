import type { Component } from 'vue'

export type Language = 'en-US' | 'zh-CN'

export interface TableField {
  field: string
  label: string
  sortable?: boolean
  truncate?: boolean
  formatter?: (
    row?: Record<string, any>,
    column?: string,
    cellValue?: any,
    index?: number
  ) => Component
  defaultHidden?: boolean
  defaultSort?: Order
}
export type Order = 'asc' | 'desc'
export interface Sort {
  field: string
  order: Order
}

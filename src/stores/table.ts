import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Sort } from '@/types/common'

export const useTableState = defineStore(
  'tableState',
  (): { columns: Ref<Record<string, string[]>>; sorts: Ref<Record<string, Sort[]>> } => {
    const columns = ref<Record<string, string[]>>({})
    const sorts = ref<Record<string, Sort[]>>({})
    return {
      columns,
      sorts
    }
  }
)

<template>
  <div class="flex flex-row gap-2">
    <input
      type="text"
      :placeholder="t('action_log_path_placeholder')"
      class="input-bordered input"
      v-model="query.path"
      @keyup.enter="initData"
    />
    <select class="select-bordered select" v-model="query.method" @keyup.enter="initData">
      <option selected :value="undefined">{{ t('method') }}</option>
      <option>POST</option>
      <option>DELETE</option>
      <option>PUT</option>
      <option>PATCH</option>
    </select>
    <button class="btn-primary btn" @click="initData">{{ t('search') }}</button>
    <button class="btn-warning btn" @click="onReset">{{ t('reset') }}</button>
  </div>
  <DataTable
    :data="data.data"
    :total="data.total"
    :fields="fields"
    :onDelete="auth.admin.is_superuser ? onDelete : undefined"
    :onSort="onSort"
  />
  <div class="flex items-center justify-center">
    <div class="btn-group grid grid-cols-2">
      <button
        class="btn-outline btn"
        @click="query.offset -= query.limit"
        :disabled="query.offset == 0"
      >
        {{ $t('previous') }}
      </button>
      <button
        class="btn-outline btn"
        @click="query.offset += query.limit"
        :disabled="query.offset + query.limit >= data.total"
      >
        {{ $t('next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as api from '@/api/action_log'
import { useI18n } from 'vue-i18n'
import { parseDate } from '@/utils/date'
import { h, reactive, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import ConfirmModal from '@/components/ConfirmModal.vue'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'
import type { ActionLogsResponse } from '@/types/responses'
import { useAuth } from '@/stores/auth'
const { t, d } = useI18n()
const auth = useAuth()
const query = reactive({
  limit: 10,
  offset: 0,
  sorts: useTableState().sorts[useRoute().path],
  admin_id: undefined,
  path: undefined,
  method: undefined
})

const dialog = createConfirmDialog(ConfirmModal)
const onDelete = async (ids: number[]): Promise<boolean> => {
  const { isCanceled } = await dialog.reveal({
    title: t('confirm.delete_action_log')
  })
  if (isCanceled) {
    return false
  }
  await api.deleteActionLogs(ids)
  toast.success(t('success.delete_action_log'))
  await initData()
  return true
}
const onSort = (fields: Sort[]) => {
  query.sorts = fields
}
const fields: TableField[] = [
  {
    field: 'id',
    label: 'ID',
    sortable: true,
    defaultSort: 'desc'
  },
  {
    field: 'admin_id',
    label: t('admin_id'),
    sortable: true
  },
  {
    field: 'ip',
    label: 'IP'
  },
  {
    field: 'content',
    label: t('content'),
    truncate: true
  },
  {
    field: 'path',
    label: t('path'),
    truncate: true
  },
  {
    field: 'method',
    label: t('method'),
    formatter: (row, column, cellValue) => {
      let class_ = 'badge'
      switch (cellValue) {
        case 'GET':
          class_ += ' badge-success'
          break
        case 'POST':
          class_ += ' badge-primary'
          break
        case 'PUT':
          class_ += ' badge-warning'
          break
        case 'DELETE':
          class_ += ' badge-error'
          break
        case 'PATCH':
          class_ += ' badge-info'
          break
      }
      return () => h('span', { class: class_ }, cellValue)
    }
  },
  {
    field: 'updated_at',
    label: t('updated_at'),
    formatter: (row, column, cellValue) => {
      return () => cellValue && d(parseDate(cellValue), 'long')
    }
  },
  {
    field: 'created_at',
    label: t('created_at'),
    formatter: (row, column, cellValue) => {
      return () => d(parseDate(cellValue), 'long')
    }
  }
]
const data = reactive<ActionLogsResponse>({
  total: 0,
  data: []
})
const initData = async () => {
  const ret = await api.getActionLogs(
    query.limit,
    query.offset,
    query.method,
    query.path,
    undefined,
    query.sorts
  )
  data.total = ret.total
  data.data = ret.data
}
await initData()
watch(query, async () => {
  await initData()
})
const onReset = () => {
  query.path = undefined
  query.method = undefined
}
</script>

<template>
  <div class="flex flex-row gap-2">
    <input
      type="text"
      :placeholder="t('search_placeholder')"
      class="input-bordered input"
      v-model="label"
      @keyup.enter="initData"
    />
    <select @keyup.enter="initData" class="select-bordered select w-full max-w-xs" v-model="type">
      <option :value="undefined">{{ t('select_sync_type') }}</option>
      <option>create</option>
      <option>update</option>
      <option>delete</option>
    </select>
    <select
      @keyup.enter="initData"
      class="select-bordered select w-full max-w-xs"
      v-model="query.sync_id"
    >
      <option :value="undefined">{{ t('select_sync') }}</option>
      <option v-for="item in syncBasic" :key="item.id" :value="item.id">{{ item.label }}</option>
    </select>
    <button class="btn-primary btn" @click="initData">{{ t('search') }}</button>
    <button class="btn-warning btn" @click="onReset">{{ t('reset') }}</button>
  </div>
  <DataTable
    :data="data.data"
    :total="data.total"
    :fields="fields"
    :onDelete="onDelete"
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
import * as sync from '@/api/sync'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { parseDate } from '@/utils/date'
import { reactive, ref, watch } from 'vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'
import type { SyncBasicResponse, SyncLogsResponse, SyncType } from '@/types/responses'

const dialog = createConfirmDialog(ConfirmModal)

const { t, d } = useI18n()
const query = reactive({
  limit: 10,
  offset: 0,
  sorts: useTableState().sorts[useRoute().path],
  sync_id: undefined
})
const label = ref('')
const data = reactive<SyncLogsResponse>({
  total: 0,
  data: []
})
const syncBasic = ref<SyncBasicResponse[]>([])
const type = ref<SyncType>()
const onSort = (fields: Sort[]) => {
  query.sorts = fields
}
const fields: TableField[] = [
  { field: 'id', label: 'ID', sortable: true, defaultSort: 'desc' },
  { field: 'sync_id', label: t('sync_id'), sortable: true },
  { field: 'type', label: t('type') },
  { field: 'count', label: t('count') },
  {
    field: 'created_at',
    label: t('created_at'),
    formatter: (row, column, cellValue) => {
      return () => cellValue && d(parseDate(cellValue), 'long')
    }
  },
  {
    field: 'updated_at',
    label: t('updated_at'),
    formatter: (row, column, cellValue) => {
      return () => cellValue && d(parseDate(cellValue), 'long')
    }
  }
]

const initData = async () => {
  const ret = await sync.getSyncLogs(
    query.limit,
    query.offset,
    query.sorts,
    query.sync_id,
    undefined,
    undefined,
    type.value
  )
  data.total = ret.total
  data.data = ret.data
  syncBasic.value = await sync.getBasic()
}
await initData()
watch(query, async () => {
  await initData()
})
const onReset = () => {
  label.value = ''
}
const onDelete = async (ids: number[]): Promise<boolean> => {
  const { isCanceled } = await dialog.reveal({
    title: t('confirm.delete_sync_log')
  })
  if (isCanceled) {
    return false
  }
  await sync.deleteSyncLogs(ids)
  toast.success(t('success.delete_sync_log'))
  await initData()
  return true
}
</script>

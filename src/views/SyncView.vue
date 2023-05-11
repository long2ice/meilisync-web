<template>
  <div class="flex flex-row gap-2">
    <input
      type="text"
      :placeholder="t('search_placeholder')"
      class="input-bordered input"
      v-model="label"
      @keyup.enter="initData"
    />
    <button class="btn-primary btn" @click="initData">{{ t('search') }}</button>
    <button class="btn-warning btn" @click="onReset">{{ t('reset') }}</button>
    <router-link class="btn ml-auto" to="/datasource/add">
      <ChPlus class="mr-1" />
      {{ $t('add_sync') }}
    </router-link>
  </div>
  <DataTable
    :data="data.data"
    :total="data.total"
    :fields="fields"
    :actions="actions"
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
import { h, reactive, ref, watch } from 'vue'
import type { SyncResponse, SyncsResponse } from '@/types/responses'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'
import DataSourceActions from '@/components/action/DataSourceActions.vue'

const dialog = createConfirmDialog(ConfirmModal)

const { t, d } = useI18n()
const query = reactive({ limit: 10, offset: 0, sorts: useTableState().sorts[useRoute().path] })
const label = ref('')
const data = reactive<SyncsResponse>({
  total: 0,
  data: []
})
const onSort = (fields: Sort[]) => {
  query.sorts = fields
}
const fields: TableField[] = [
  { field: 'id', label: 'ID', sortable: true },
  { field: 'label', label: t('label') },
  { field: 'source_id', label: t('source_id') },
  { field: 'meilisearch_id', label: t('meilisearch_id') },
  {
    field: 'full_sync',
    label: t('full_sync'),
    formatter: (row, column, cellValue) => {
      return () => (cellValue ? '✅' : '❌')
    }
  },
  {
    field: 'table',
    label: t('table')
  },
  {
    field: 'index',
    label: t('index')
  },
  {
    field: 'primary_key',
    label: t('primary_key')
  },
  {
    field: 'enabled',
    label: t('enabled'),
    formatter: (row, column, cellValue) => {
      return () => (cellValue ? '✅' : '❌')
    }
  },
  {
    field: 'fields',
    label: t('fields'),
    truncate: true
  },
  {
    field: 'created_at',
    label: t('created_at'),
    formatter: (row, column, cellValue) => {
      return () => cellValue && d(parseDate(cellValue), 'long')
    },
    defaultHidden: true
  },
  {
    field: 'updated_at',
    label: t('updated_at'),
    formatter: (row, column, cellValue) => {
      return () => cellValue && d(parseDate(cellValue), 'long')
    },
    defaultHidden: true
  }
]
const actions = (props: { data: SyncResponse }) => {
  return h(DataSourceActions, {
    data: props.data
  })
}
const initData = async () => {
  const ret = await sync.getSyncs(query.limit, query.offset, label.value, query.sorts)
  data.total = ret.total
  data.data = ret.data
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
    title: t('confirm.delete_sync')
  })
  if (isCanceled) {
    return false
  }
  await sync.deleteSyncs(ids)
  toast.success(t('success.delete_sync'))
  await initData()
  return true
}
</script>

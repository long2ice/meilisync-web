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
      {{ $t('add_meilisearch') }}
    </router-link>
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
import * as meilisearch from '@/api/meilisearch'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { parseDate } from '@/utils/date'
import { h, reactive, ref, watch } from 'vue'
import type { MeilisearchResponse, MeilisearchsResponse } from '@/types/responses'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'

const dialog = createConfirmDialog(ConfirmModal)

const { t, d } = useI18n()
const query = reactive({ limit: 10, offset: 0, sorts: useTableState().sorts[useRoute().path] })
const label = ref('')
const data = reactive<MeilisearchsResponse>({
  total: 0,
  data: []
})
const onSort = (fields: Sort[]) => {
  query.sorts = fields
}
const fields: TableField[] = [
  { field: 'id', label: 'ID', sortable: true },
  { field: 'label', label: t('label') },
  {
    field: 'api_url',
    label: t('api_url')
  },
  {
    field: 'api_key',
    label: t('api_key')
  },
  {
    field: 'insert_size',
    label: t('insert_size')
  },
  {
    field: 'insert_interval',
    label: t('insert_interval')
  },
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
  const ret = await meilisearch.getMeilisearchs(query.limit, query.offset, label.value, query.sorts)
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
    title: t('confirm.delete_meilisearch')
  })
  if (isCanceled) {
    return false
  }
  await meilisearch.deleteMeilisearchs(ids)
  toast.success(t('success.delete_meilisearch'))
  await initData()
  return true
}
</script>

<template>
  <div class="flex flex-row gap-2">
    <input
      type="text"
      :placeholder="t('search_placeholder')"
      class="input-bordered input"
      v-model="query.label"
      @keyup.enter="initData"
    />
    <button class="btn-primary btn" @click="initData">{{ t('search') }}</button>
    <button class="btn-warning btn" @click="onReset">{{ t('reset') }}</button>
    <button class="btn ml-auto" @click="isCreateUpdateOpen = true">
      <ChPlus class="mr-1" />
      {{ $t('add_meilisearch') }}
    </button>
    <input type="checkbox" class="modal-toggle" v-model="isCreateUpdateOpen" />
    <div class="modal">
      <div class="modal-box relative max-w-2xl">
        <button
          class="btn-sm btn-circle btn absolute right-2 top-2"
          @click="isCreateUpdateOpen = false"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold">{{ state.title }}</h3>
        <div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text"><span class="text-error">*</span>{{ $t('label') }}</span>
            </label>
            <input type="text" class="input-bordered input" v-model="label" />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessageLabel }}</span>
            </label>
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text"><span class="text-error">*</span>{{ $t('api_url') }}</span>
            </label>
            <input type="text" class="input-bordered input" v-model="api_url" />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessageAPIURL }}</span>
            </label>
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">{{ $t('api_key') }}</span>
            </label>
            <input type="text" class="input-bordered input" v-model="state.api_key" />
          </div>
        </div>
        <div class="modal-action">
          <label
            class="btn"
            :class="{
              loading: isSubmitting
            }"
            @click="onSubmit"
            >{{ $t('save') }}</label
          >
        </div>
      </div>
    </div>
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
import { reactive, ref, watch } from 'vue'
import type { MeilisearchsResponse } from '@/types/responses'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import * as source from '@/api/source'

const dialog = createConfirmDialog(ConfirmModal)
const isCreateUpdateOpen = ref(false)
const { t, d } = useI18n()
const query = reactive({
  limit: 10,
  offset: 0,
  sorts: useTableState().sorts[useRoute().path],
  label: ''
})
const data = reactive<MeilisearchsResponse>({
  total: 0,
  data: []
})
const { handleSubmit, isSubmitting } = useForm()
const { value: label, errorMessage: errorMessageLabel } = useField<string>(
  'label',
  yup.string().required(t('validate.label_required'))
)
const { value: api_url, errorMessage: errorMessageAPIURL } = useField<string>(
  'api_url',
  yup.string().required(t('validate.api_url_required'))
)
api_url.value = 'http://127.0.0.1:7700'
const onSort = (fields: Sort[]) => {
  query.sorts = fields
}
const state = reactive({
  title: '',
  api_key: ''
})
watch(isCreateUpdateOpen, (val) => {
  if (val) {
    state.title = t('create_meilisearch')
  } else {
    state.title = t('update_meilisearch')
  }
})
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
const onSubmit = handleSubmit(async () => {
  await meilisearch.createMeilisearch(label.value, api_url.value, state.api_key)
  toast.success(t('success.create_meilisearch'))
  isCreateUpdateOpen.value = false
  await initData()
})
</script>

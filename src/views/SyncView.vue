<template>
  <div class="flex flex-row gap-2">
    <input
      type="text"
      :placeholder="t('search_placeholder')"
      class="input-bordered input"
      v-model="query.label"
      @keyup.enter="initData"
    />
    <select
      @keyup.enter="initData"
      class="select-bordered select w-full max-w-xs"
      v-model="query.source_id"
    >
      <option :value="undefined">{{ t('select_source') }}</option>
      <option v-for="item in state.sources" :key="item.id" :value="item.id">
        {{ item.id }}#{{ item.label }}
      </option>
    </select>
    <select
      @keyup.enter="initData"
      class="select-bordered select w-full max-w-xs"
      v-model="query.meilisearch_id"
    >
      <option :value="undefined">{{ t('select_meilisearch') }}</option>
      <option v-for="item in state.meilisearchs" :key="item.id" :value="item.id">
        {{ item.id }}#{{ item.label }}
      </option>
    </select>
    <select
      @keyup.enter="initData"
      class="select-bordered select w-full max-w-xs"
      v-model="query.enabled"
    >
      <option :value="undefined">{{ t('select_enabled') }}</option>
      <option :value="true">YES</option>
      <option :value="false">NO</option>
    </select>
    <button class="btn-primary btn" @click="initData">{{ t('search') }}</button>
    <button class="btn-warning btn" @click="onReset">{{ t('reset') }}</button>
    <button class="btn ml-auto" @click="handleCreate">
      <ChPlus class="mr-1" />
      {{ $t('add_sync') }}
    </button>
    <form>
      <input type="checkbox" class="modal-toggle" v-model="state.isCreateUpdateOpen" />
      <div class="modal">
        <div class="modal-box relative max-w-4xl">
          <label
            class="btn-sm btn-circle btn absolute right-2 top-2"
            @click="state.isCreateUpdateOpen = false"
          >
            ✕
          </label>
          <h3 class="text-lg font-bold">{{ state.title }}</h3>
          <div>
            <div class="flex gap-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"><span class="text-error">*</span>{{ $t('label') }}</span>
                </label>
                <input name="label" class="input-bordered input" v-model="label" />
                <label class="label">
                  <ErrorMessage name="label" class="label-text-alt text-error" />
                </label>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"
                    ><span class="text-error">*</span>{{ $t('source') }}</span
                  >
                </label>
                <select
                  class="select-bordered select w-full max-w-xs"
                  name="source_id"
                  v-model="source_id"
                >
                  <option v-for="item in state.sources" :key="item.id" :value="item.id">
                    {{ item.id }}#{{ item.label }}
                  </option>
                </select>
                <label class="label">
                  <ErrorMessage name="source_id" class="label-text-alt text-error" />
                </label>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"
                    ><span class="text-error">*</span>{{ $t('meilisearch') }}</span
                  >
                </label>
                <select
                  class="select-bordered select w-full max-w-xs"
                  name="meilisearch_id"
                  v-model="meilisearch_id"
                >
                  <option v-for="item in state.meilisearchs" :key="item.id" :value="item.id">
                    {{ item.id }}#{{ item.label }}
                  </option>
                </select>
                <label class="label">
                  <ErrorMessage name="meilisearch_id" class="label-text-alt text-error" />
                </label>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"><span class="text-error">*</span>{{ $t('table') }}</span>
                </label>
                <input name="table" class="input-bordered input" v-model="table" />
                <label class="label">
                  <ErrorMessage name="table" class="label-text-alt text-error" />
                </label>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"><span class="text-error">*</span>{{ $t('index') }}</span>
                </label>
                <input name="index" class="input-bordered input" v-model="index" />
                <label class="label">
                  <ErrorMessage name="index" class="label-text-alt text-error" />
                </label>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"
                    ><span class="text-error">*</span>{{ $t('primary_key') }}</span
                  >
                </label>
                <input name="primary_key" class="input-bordered input" v-model="primary_key" />
                <label class="label">
                  <ErrorMessage name="primary_key" class="label-text-alt text-error" />
                </label>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text">{{ $t('full_sync') }}</span>
                </label>
                <input name="full_sync" type="checkbox" class="checkbox" v-model="full_sync" />
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text">{{ $t('enabled') }}</span>
                </label>
                <input name="enabled" type="checkbox" class="checkbox" v-model="enabled" />
              </div>
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">{{ $t('fields') }}</span>
              </label>
              <CodeEditor
                v-model="fields"
                line-nums
                :languages="[['json', 'JSON']]"
                width="100%"
                :theme="theme.theme === 'dark' ? 'github-dark-dimmed' : 'github'"
              />
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">{{ $t('index_settings') }}</span>
              </label>
              <CodeEditor
                v-model="index_settings"
                line-nums
                :languages="[['json', 'JSON']]"
                width="100%"
                :theme="theme.theme === 'dark' ? 'github-dark-dimmed' : 'github'"
              />
            </div>
          </div>
          <div class="modal-action">
            <label class="btn-warning btn" @click="resetForm()">{{ t('reset') }}</label>
            <label
              class="btn"
              :class="{
                loading: isSubmitting
              }"
              @click="onSubmit"
            >
              {{ $t('save') }}
            </label>
          </div>
        </div>
      </div>
    </form>
  </div>
  <DataTable
    :data="state.data.data"
    :total="state.data.total"
    :fields="tableFields"
    :onDelete="onDelete"
    :onSort="onSort"
    :actions="actions"
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
        :disabled="query.offset + query.limit >= state.data.total"
      >
        {{ $t('next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js'
import CodeEditor from 'simple-code-editor'
import * as sync from '@/api/sync'
import * as source from '@/api/source'
import * as meilisearch from '@/api/meilisearch'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { parseDate } from '@/utils/date'
import { h, reactive, watch } from 'vue'
import type { BasicResponse, SyncResponse, SyncsResponse } from '@/types/responses'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'
import SyncActions from '@/components/action/SyncActions.vue'
import { number, object, string } from 'yup'
import { useForm, ErrorMessage, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useTheme } from '@/stores/theme'
const { t, d } = useI18n()
const theme = useTheme()
const { isSubmitting, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(
    object({
      label: string().required(t('validate.label_required')),
      meilisearch_id: number().required(t('validate.meilisearch_required')),
      source_id: number().required(t('validate.source_required')),
      table: string().required(t('validate.table_required')),
      index: string().required(t('validate.index_required')),
      primary_key: string().required(t('validate.primary_key_required')),
      enabled: string(),
      full_sync: string(),
      fields: string(),
      index_settings: string()
    })
  ),
  initialValues: {
    primary_key: 'id'
  }
})
const { value: label } = useField('label')
const { value: meilisearch_id } = useField('meilisearch_id')
const { value: source_id } = useField('source_id')
const { value: table } = useField('table')
const { value: index } = useField('index')
const { value: primary_key } = useField('primary_key')
const { value: enabled } = useField('enabled')
const { value: full_sync } = useField('full_sync')
const { value: fields } = useField<string>('fields')
fields.value = '{}'
const { value: index_settings } = useField<string>('index_settings')
index_settings.value = '{}'
const dialog = createConfirmDialog(ConfirmModal)
const handleCreate = () => {
  state.title = t('create_sync')
  state.isCreate = true
  state.isCreateUpdateOpen = true
}
const query = reactive({
  limit: 10,
  offset: 0,
  label: '',
  sorts: useTableState().sorts[useRoute().path],
  source_id: undefined,
  meilisearch_id: undefined,
  enabled: undefined
})
const state = reactive({
  data: {} as SyncsResponse,
  sources: [] as BasicResponse[],
  meilisearchs: [] as BasicResponse[],
  isCreate: true,
  isCreateUpdateOpen: false,
  title: '',
  id: undefined
})
const onSort = (fields: Sort[]) => {
  query.sorts = fields
}
const tableFields: TableField[] = [
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
    field: 'index_settings',
    label: t('index_settings'),
    truncate: true
  },
  {
    field: 'source_count',
    label: t('source_count')
  },
  {
    field: 'meilisearch_count',
    label: t('meilisearch_count')
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
  return h(SyncActions, {
    onRefresh,
    onEdit,
    data: props.data
  })
}
const onRefresh = async (id: number) => {
  await sync.refreshSync(id)
  toast.success(t('success.refresh_sync'))
}
const onEdit = async (data: Record<string, any>) => {
  state.isCreateUpdateOpen = true
  state.isCreate = false
  label.value = data.label
  meilisearch_id.value = data.meilisearch_id
  source_id.value = data.source_id
  table.value = data.table
  index.value = data.index
  primary_key.value = data.primary_key
  enabled.value = data.enabled
  full_sync.value = data.full_sync
  state.id = data.id
  fields.value = data.fields ? JSON.stringify(data.fields, null, 2) : ''
  index_settings.value = data.index_settings ? JSON.stringify(data.index_settings, null, 2) : ''
}
const initData = async () => {
  state.data = await sync.getSyncs(
    query.limit,
    query.offset,
    query.label,
    query.sorts,
    query.source_id,
    query.meilisearch_id,
    query.enabled
  )
  state.sources = await source.getBasic()
  state.meilisearchs = await meilisearch.getBasic()
}
await initData()
watch(query, async () => {
  await initData()
})
const onReset = () => {
  query.label = ''
  query.source_id = undefined
  query.meilisearch_id = undefined
  query.enabled = undefined
}
const onDelete = async (ids: number[]): Promise<boolean> => {
  const { isCanceled } = await dialog.reveal({
    title: t('confirm_modal.delete_sync')
  })
  if (isCanceled) {
    return false
  }
  await sync.deleteSyncs(ids)
  toast.success(t('success.delete_sync'))
  await initData()
  return true
}
const onSubmit = handleSubmit(async (values: Record<string, any>) => {
  values.enabled = values.enabled === 'true'
  values.full_sync = values.full_sync === 'true'
  if (values.fields) {
    values.fields = JSON.parse(values.fields)
  }
  if (values.index_settings) {
    values.index_settings = JSON.parse(values.index_settings)
  }
  if (state.isCreate) {
    await sync.createSync(values)
    toast.success(t('success.create_sync'))
  } else {
    await sync.editSync(state.id!, values)
    toast.success(t('success.update_sync'))
  }
  state.isCreateUpdateOpen = false
  await initData()
})
</script>

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
      v-model="query.type"
    >
      <option :value="undefined">{{ t('select_source_type') }}</option>
      <option value="mysql">MySQL</option>
      <option value="postgres">PostgreSQL</option>
      <option value="mongo">MongoDB</option>
    </select>
    <button class="btn-primary btn" @click="initData">{{ t('search') }}</button>
    <button class="btn-warning btn" @click="onReset">{{ t('reset') }}</button>
    <button class="btn ml-auto" @click="handleCreateUpdateSource">
      <ChPlus class="mr-1" />
      {{ $t('add_source') }}
    </button>
    <input type="checkbox" class="modal-toggle" v-model="isCreateUpdateSourceOpen" />
    <div class="modal">
      <div class="modal-box relative max-w-2xl">
        <button
          class="btn-sm btn-circle btn absolute right-2 top-2"
          @click="isCreateUpdateSourceOpen = false"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold">{{ state.title }}</h3>
        <div>
          <div class="tabs">
            <a
              class="tab-bordered tab"
              @click="changeType('mysql')"
              :class="{
                'tab-active': state.type === 'mysql'
              }"
            >
              <DeMysqlOriginal class="mr-2 text-lg" />
              MySQL</a
            >
            <a
              class="tab-bordered tab"
              @click="changeType('postgres')"
              :class="{
                'tab-active': state.type === 'postgres'
              }"
            >
              <DePostgresqlOriginal class="mr-2 text-lg" />
              PostgreSQL</a
            >
            <a
              class="tab-bordered tab"
              @click="changeType('mongo')"
              :class="{
                'tab-active': state.type === 'mongo'
              }"
            >
              <VsFolderTypeMongodb class="mr-2 text-lg" />
              MongoDB</a
            >
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text"><span class="text-error">*</span>{{ $t('label') }}</span>
            </label>
            <input type="text" class="input-bordered input" v-model="label" />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessageLabel }}</span>
            </label>
          </div>
          <SourceConnection
            :connection="state.connection"
            ref="sourceConnectionRef"
            :type="state.type"
          />
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
import * as source from '@/api/source'
import SourceTypeIcon from '@/components/SourceTypeIcon.vue'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { parseDate } from '@/utils/date'
import { h, reactive, ref, watch } from 'vue'
import type { SourcesResponse, SourceType } from '@/types/responses'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import SourceConnection from '@/components/SourceConnection.vue'
import * as yup from 'yup'

const { t, d } = useI18n()
const sourceConnectionRef = ref()
const dialog = createConfirmDialog(ConfirmModal)
const isCreateUpdateSourceOpen = ref(false)
const { handleSubmit, isSubmitting } = useForm()
const handleCreateUpdateSource = () => {
  isCreateUpdateSourceOpen.value = true
}
const state = reactive<{
  type: SourceType
  connection: {
    host: string
    port: number
    username: string
    password: string
    database: string
  }
  title: string
}>({
  type: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: ''
  },
  title: t('create_source')
})
const { value: label, errorMessage: errorMessageLabel } = useField<string>(
  'label',
  yup.string().required(t('validate.label_required'))
)
watch(isCreateUpdateSourceOpen, (val) => {
  if (val) {
    state.title = t('create_source')
  } else {
    state.title = t('update_source')
  }
})
const changeType = (type: SourceType) => {
  state.type = type
  switch (type) {
    case 'postgres':
      sourceConnectionRef.value.updatePort(5432)
      break
    case 'mongo':
      sourceConnectionRef.value.updatePort(27017)
      break
    default:
      sourceConnectionRef.value.updatePort(3306)
      break
  }
}
const query = reactive({
  limit: 10,
  offset: 0,
  sorts: useTableState().sorts[useRoute().path],
  label: undefined,
  type: undefined
})
const data = reactive<SourcesResponse>({
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
    field: 'type',
    label: t('type'),
    formatter: (row, column, cellValue) => {
      return () =>
        h('div', { class: 'tooltip tooltip-right', 'data-tip': cellValue }, [
          h(SourceTypeIcon, { type: cellValue })
        ])
    }
  },
  {
    field: 'connection',
    label: t('connection'),
    truncate: true
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
const onSubmit = handleSubmit(async () => {
  const data = sourceConnectionRef.value.getConnection()
  await source.createSource(label.value, state.type, data)
  toast.success(t('success.create_source'))
  isCreateUpdateSourceOpen.value = false
  await initData()
})
const initData = async () => {
  const ret = await source.getSources(
    query.limit,
    query.offset,
    query.label,
    query.type,
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
  query.label = undefined
  query.type = undefined
}
const onDelete = async (ids: number[]): Promise<boolean> => {
  const { isCanceled } = await dialog.reveal({
    title: t('confirm_modal.delete_source')
  })
  if (isCanceled) {
    return false
  }
  await source.deleteSources(ids)
  toast.success(t('success.delete_source'))
  await initData()
  return true
}
</script>

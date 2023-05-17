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
    <button class="btn ml-auto" @click="handleCreateSource">
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
          <div>
            <div class="flex flex-row gap-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"><span class="text-error">*</span>{{ $t('host') }}</span>
                </label>
                <input type="text" class="input-bordered input" v-model="host" />
                <label class="label">
                  <span class="label-text-alt text-error">{{ errorMessageHost }}</span>
                </label>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"><span class="text-error">*</span>{{ $t('port') }}</span>
                </label>
                <input type="number" class="input-bordered input" v-model="port" />
                <label class="label">
                  <span class="label-text-alt text-error">{{ errorMessagePort }}</span>
                </label>
              </div>
            </div>
            <div class="flex flex-row gap-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"
                    ><span class="text-error">*</span>{{ $t('username') }}</span
                  >
                </label>
                <input type="text" v-model="user" class="input-bordered input" />
                <label class="label">
                  <span class="label-text-alt text-error">{{ errorMessageUser }}</span>
                </label>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text">{{ $t('password') }}</span>
                </label>
                <input type="password" class="input-bordered input" v-model="state.password" />
              </div>
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text"
                  ><span class="text-error">*</span>{{ $t('database') }}</span
                >
              </label>
              <input type="text" class="input-bordered input" v-model="database" />
              <label class="label">
                <span class="label-text-alt text-error">{{ errorMessageDatabase }}</span>
              </label>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('other_options') }}</span>
              </label>
              <textarea
                class="textarea-bordered textarea h-24"
                v-model="state.otherOptions"
                :placeholder="$t('other_options_placeholder')"
              ></textarea>
              <label class="label">
                <span class="label-text-alt">
                  {{ $t('other_options_tips') }}
                  <a
                    class="link-primary link"
                    v-if="state.type === 'mysql'"
                    href="https://github.com/long2ice/asyncmy"
                    target="_blank"
                    >https://github.com/long2ice/asyncmy</a
                  >
                  <a
                    class="link-primary link"
                    v-else-if="state.type === 'postgres'"
                    href="https://www.psycopg.org/docs/usage.html"
                    target="_blank"
                    >https://www.psycopg.org/docs/usage.html</a
                  >
                  <a
                    class="link-primary link"
                    href="https://motor.readthedocs.io/en/stable/"
                    v-else-if="state.type === 'mongo'"
                    target="_blank"
                    >https://motor.readthedocs.io/en/stable/</a
                  >
                </span>
              </label>
            </div>
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
import type { SourceResponse, SourcesResponse, SourceType } from '@/types/responses'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import type { Sort, TableField } from '@/types/common'
import { useTableState } from '@/stores/table'
import { useRoute } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import SourceActions from '@/components/action/SourceActions.vue'
import { dict2str, str2dict } from '@/utils/convert'

const { t, d } = useI18n()
const dialog = createConfirmDialog(ConfirmModal)
const isCreateUpdateSourceOpen = ref(false)
const isCreate = ref(true)
const { handleSubmit, isSubmitting } = useForm()
const handleCreateSource = () => {
  isCreateUpdateSourceOpen.value = true
  isCreate.value = true
  state.type = 'mysql'
  state.password = ''
  state.otherOptions = ''
  label.value = 'default'
  host.value = 'localhost'
  port.value = 3306
  user.value = 'root'
  database.value = 'test'
  state.otherOptions = 'server_id=1'
}
const state = reactive<{
  type: SourceType
  title: string
  password: string
  otherOptions: string
  id?: number
}>({
  type: 'mysql',
  title: t('create_source'),
  password: '',
  otherOptions: ''
})
const { value: label, errorMessage: errorMessageLabel } = useField<string>(
  'label',
  yup.string().required(t('validate.label_required'))
)
const { value: host, errorMessage: errorMessageHost } = useField(
  'host',
  yup.string().required(t('validate.host_required'))
)
const { value: port, errorMessage: errorMessagePort } = useField(
  'port',
  yup.number().required(t('validate.port_required'))
)
const { value: user, errorMessage: errorMessageUser } = useField(
  'user',
  yup.string().required(t('validate.username_required'))
)
const { value: database, errorMessage: errorMessageDatabase } = useField(
  'database',
  yup.string().required(t('validate.database_required'))
)
watch(isCreate, (val) => {
  if (val) {
    state.title = t('create_source')
  } else {
    state.title = t('update_source')
  }
})
const changeType = (type: SourceType) => {
  state.type = type
  if (type === 'mysql' && !state.otherOptions) {
    state.otherOptions = 'server_id=1'
  } else if (state.otherOptions === 'server_id=1') {
    state.otherOptions = ''
  }
  switch (type) {
    case 'postgres':
      port.value = 5432
      break
    case 'mongo':
      port.value = 27017
      break
    default:
      port.value = 3306
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
  if (isCreate.value) {
    await source.createSource(label.value, state.type, {
      host: host.value,
      port: port.value,
      user: user.value,
      password: state.password,
      database: database.value,
      ...str2dict(state.otherOptions)
    })
    toast.success(t('success.create_source'))
  } else {
    await source.updateSource(state.id!, label.value, state.type, {
      host: host.value,
      port: port.value,
      user: user.value,
      password: state.password,
      database: database.value,
      ...str2dict(state.otherOptions)
    })
    toast.success(t('success.update_source'))
  }

  isCreateUpdateSourceOpen.value = false
  await initData()
})
const actions = (props: { data: SourceResponse }) => {
  return h(SourceActions, {
    data: props.data,
    onEdit: (data: SourceResponse) => {
      isCreateUpdateSourceOpen.value = true
      isCreate.value = false
      state.type = data.type
      host.value = data.connection.host
      port.value = data.connection.port
      user.value = data.connection.user
      state.password = data.connection.password
      database.value = data.connection.database
      label.value = data.label
      state.id = data.id
      state.otherOptions = dict2str(data.connection, [
        'host',
        'port',
        'user',
        'password',
        'database'
      ])
    }
  })
}
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

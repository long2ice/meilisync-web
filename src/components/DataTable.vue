<template>
  <div class="flex items-center gap-4">
    <template v-if="selected.length > 0 && onDelete">
      <div>{{ $t('rows_selected', { num: selected.length }) }}</div>
      <button class="btn-error btn-sm btn gap-2" @click="deleteSelected">
        <ReDeleteBin7Line />
        {{ $t('delete_selected') }}
      </button>
    </template>
    <div v-show="selected.length == 0">{{ $t('total_rows', { total: total }) }}</div>
    <div class="dropdown-end dropdown ml-auto">
      <label tabindex="0" class="btn-sm btn m-1 gap-2"><BxColumns />{{ $t('columns') }}</label>
      <ul
        tabindex="0"
        class="dropdown-content flex w-32 flex-col gap-2 rounded-md bg-base-100 p-4 shadow"
      >
        <li v-for="field in fields" class="flex items-center gap-2" :key="field.field">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            v-model="columns"
            :value="field.field"
          />
          <span class="text-sm">{{ field.label }}</span>
        </li>
      </ul>
    </div>
  </div>
  <table class="table w-full">
    <thead>
      <tr>
        <th v-if="onDelete">
          <input type="checkbox" class="checkbox" v-model="selectAll" />
        </th>
        <th v-for="field in realFields" :key="field.field">
          <span class="flex items-center gap-1"
            >{{ field.label
            }}<button v-if="sortFields[field.field]">
              <LuSortAsc
                v-show="sortFields[field.field].order === 'asc'"
                @click="sort(field.field, 'asc')"
              />
              <LuSortDesc
                v-show="sortFields[field.field].order === 'desc'"
                @click="sort(field.field, 'desc')"
              />
            </button>
          </span>
        </th>
        <th v-if="actions || onDelete">{{ $t('action') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="d in data" :key="d.id" class="hover">
        <th v-if="onDelete">
          <input type="checkbox" class="checkbox" v-model="selected" :value="d.id" />
        </th>
        <td v-for="(field, index) in realFields" :key="field.field">
          <template v-if="field.truncate">
            <div class="message max-w-xs" @click="clipboardHandler(d[field.field])">
              {{ d[field.field] }}
            </div>
            <span class="message-tooltip">{{ d[field.field] }}</span>
          </template>
          <Component
            v-else-if="field.formatter"
            :is="field.formatter(d, field.field, d[field.field], index)"
          >
          </Component>
          <template v-else>
            {{ d[field.field] }}
          </template>
        </td>
        <td v-if="actions || onDelete">
          <div class="flex gap-1">
            <Component v-if="actions" :is="actions" :data="d" />
            <button
              class="btn-error btn-sm btn"
              @click="onDelete && onDelete([d.id])"
              v-if="onDelete"
            >
              <ReDeleteBin7Line />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { Sort, TableField } from '@/types/common'
import { Clipboard } from 'v-clipboard'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTableState } from '@/stores/table'
const { t } = useI18n()
const props = defineProps<{
  data: Record<string, any>[]
  total: number
  fields: TableField[]
  actions?: Component
  onDelete?: (ids: number[]) => Promise<boolean>
  onSort?: (fields: Sort[]) => void
}>()

const route = useRoute()
const tableState = useTableState()
const columnsMap = tableState.columns
const defaultColumns = columnsMap[route.path]
const columns = ref(defaultColumns || props.fields.map((f) => !f.defaultHidden && f.field))
watch(columns, (val) => {
  columnsMap[route.path] = val
})
const sortsMap = tableState.sorts
const defaultSorts = sortsMap[route.path]
const sortFields = reactive<Record<string, Sort>>(
  defaultSorts?.reduce((acc, s) => {
    acc[s.field] = s
    return acc
  }, {} as Record<string, Sort>) ||
    props.fields.reduce((acc, f) => {
      if (f.sortable) {
        acc[f.field] = {
          field: f.field,
          order: f.defaultSort || 'asc'
        }
      }
      return acc
    }, {} as Record<string, Sort>)
)
watch(
  sortFields,
  (val) => {
    sortsMap[route.path] = Object.values(val)
  },
  { deep: true }
)
const sort = async (field: string, order: 'asc' | 'desc') => {
  sortFields[field].order = order === 'asc' ? 'desc' : 'asc'
  await props.onSort?.(Object.values(sortFields))
}
const selected = ref<number[]>([])
const selectAll = ref(false)
watch(selectAll, (val) => {
  if (val) {
    selected.value = props.data.map((d) => d.id)
  } else {
    selected.value = []
  }
})
const clipboardHandler = async (message: string) => {
  await Clipboard.copy(message)
  toast.success(t('copied'))
}
const realFields = computed(() => {
  return props.fields.filter((f) => columns.value.includes(f.field))
})
const deleteSelected = async () => {
  const ret = await props.onDelete?.(selected.value)
  if (ret) {
    selected.value = []
  }
  selectAll.value = false
}
</script>

<style scoped></style>

<template>
  <div class="flex flex-row gap-2">
    <input
      type="text"
      class="input-bordered input"
      :placeholder="$t('admin_search_placeholder')"
      v-model="query.search"
      @keyup.enter="initData"
    />
    <select class="select-bordered select" v-model="query.is_superuser" @keyup.enter="initData">
      <option selected :value="undefined">{{ t('is_superuser') }}</option>
      <option value="false">YES</option>
      <option value="true">NO</option>
    </select>
    <select class="select-bordered select" v-model="query.is_active" @keyup.enter="initData">
      <option selected :value="undefined">{{ t('is_active') }}</option>
      <option value="false">YES</option>
      <option value="true">NO</option>
    </select>
    <button class="btn-primary btn" @click="initData">{{ t('search') }}</button>
    <button class="btn-warning btn" @click="onReset">{{ t('reset') }}</button>
    <button class="btn ml-auto" @click="handleCreateAdmin" v-if="auth.admin.is_superuser">
      <ChPlus class="mr-1" />
      {{ $t('create_admin') }}
    </button>
    <input type="checkbox" class="modal-toggle" v-model="isCreateUpdateAdminOpen" />
    <div class="modal">
      <div class="modal-box relative">
        <button
          class="btn-sm btn-circle btn absolute right-2 top-2"
          @click="isCreateUpdateAdminOpen = false"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold">{{ form.title }}</h3>
        <div>
          <div class="flex gap-4">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text"
                  ><span class="text-error">*</span>{{ t('email_label') }}</span
                >
              </label>
              <input
                type="text"
                class="input-bordered input"
                v-model="email"
                placeholder="name@example.com"
              />
              <label class="label">
                <span class="label-text-alt text-error">{{ errorMessageEmail }}</span>
              </label>
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text"><span class="text-error">*</span>{{ t('nickname') }}</span>
              </label>
              <input
                type="text"
                class="input-bordered input"
                v-model="nickname"
                :placeholder="$t('nickname_placeholder')"
              />
              <label class="label">
                <span class="label-text-alt text-error">{{ errorMessageNickname }}</span>
              </label>
            </div>
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text"><span class="text-error">*</span>{{ t('password') }}</span>
            </label>
            <input
              type="password"
              class="input-bordered input"
              v-model="password"
              placeholder="••••••••"
            />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessagePassword }}</span>
            </label>
          </div>
          <div class="flex gap-4">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">{{ t('is_superuser') }}</span>
              </label>
              <input type="checkbox" class="checkbox" v-model="form.is_superuser" />
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">{{ t('is_active') }}</span>
              </label>
              <input type="checkbox" class="checkbox" v-model="form.is_active" />
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
            >{{ $t('submit') }}</label
          >
        </div>
      </div>
    </div>
  </div>
  <DataTable
    :data="data.data"
    :total="data.total"
    :fields="fields"
    :onSort="onSort"
    :actions="auth.admin.is_superuser ? actions : undefined"
    :onDelete="auth.admin.is_superuser ? onDelete : undefined"
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
import { useI18n } from 'vue-i18n'
import { parseDate } from '@/utils/date'
import { h, reactive, ref, watch } from 'vue'
import type { AdminResponse, AdminsResponse } from '@/types/responses'
import * as api from '@/api/admin'
import type { Sort, TableField } from '@/types/common'
import AdminActions from '@/components/action/AdminActions.vue'
import { toast } from 'vue3-toastify'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useAuth } from '@/stores/auth'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
const auth = useAuth()
const actions = (props: { data: AdminResponse }) => {
  return h(AdminActions, {
    onEdit,
    data: props.data
  })
}
const onEdit = (data: AdminResponse) => {
  isCreateUpdateAdminOpen.value = true
  form.id = data.id
  form.is_superuser = data.is_superuser
  form.is_active = data.is_active
  nickname.value = data.nickname
  email.value = data.email
  isUpdate.value = true
  password.value = data.password
}
const { t, d } = useI18n()
const query = reactive({
  limit: 10,
  offset: 0,
  sorts: [] as Sort[],
  is_superuser: undefined,
  is_active: undefined,
  search: undefined
})

const onSort = (fields: Sort[]) => {
  query.sorts = fields
}
const fields: TableField[] = [
  {
    field: 'id',
    label: 'ID',
    sortable: true
  },
  {
    field: 'email',
    label: 'Email'
  },
  {
    field: 'nickname',
    label: t('nickname')
  },
  {
    field: 'last_login_at',
    label: t('last_login_at'),
    formatter: (row, column, cellValue) => {
      return () => cellValue && d(parseDate(cellValue), 'long')
    }
  },
  {
    field: 'is_superuser',
    label: t('is_superuser'),
    formatter: (row, column, cellValue) => {
      return () => (cellValue ? '✅' : '❌')
    }
  },
  {
    field: 'is_active',
    label: t('is_active'),
    formatter: (row, column, cellValue) => {
      return () => (cellValue ? '✅' : '❌')
    }
  },
  {
    field: 'updated_at',
    label: t('updated_at'),
    formatter: (row, column, cellValue) => {
      return () => d(parseDate(cellValue), 'long')
    }
  },
  {
    field: 'created_at',
    label: t('created_at'),
    formatter: (row, column, cellValue) => {
      return () => cellValue && d(parseDate(cellValue), 'long')
    }
  }
]
const data = reactive<AdminsResponse>({
  total: 0,
  data: []
})
const initData = async () => {
  const ret = await api.getAdmin(
    query.limit,
    query.offset,
    query.sorts,
    query.is_superuser,
    query.is_active,
    query.search
  )
  data.total = ret.total
  data.data = ret.data
}

await initData()
watch(query, async () => {
  await initData()
})
const onReset = () => {
  query.is_superuser = undefined
  query.is_active = undefined
  query.search = undefined
}
const dialog = createConfirmDialog(ConfirmModal)
const onDelete = async (ids: number[]): Promise<boolean> => {
  const { isCanceled } = await dialog.reveal({
    title: t('confirm.delete_admin')
  })
  if (isCanceled) {
    return false
  }
  await api.deleteAdmins(ids)
  toast.success(t('success.delete_admin'))
  await initData()
  return true
}
const isCreateUpdateAdminOpen = ref(false)
const isUpdate = ref(false)
const handleCreateAdmin = () => {
  isCreateUpdateAdminOpen.value = true
  isUpdate.value = false
}
const { handleSubmit, isSubmitting } = useForm()
const { value: email, errorMessage: errorMessageEmail } = useField(
  'email',
  yup.string().email(t('validate.invalid_email')).required(t('validate.email_required'))
)
const { value: password, errorMessage: errorMessagePassword } = useField(
  'password',
  yup.string().required(t('validate.password_required'))
)
const { value: nickname, errorMessage: errorMessageNickname } = useField(
  'nickname',
  yup.string().required(t('validate.nickname_required'))
)
const form = reactive({
  is_superuser: false,
  is_active: true,
  id: 0,
  title: t('create_admin')
})
watch(isUpdate, (val) => {
  if (!val) {
    form.title = t('create_admin')
  } else {
    form.title = t('update_admin')
  }
})
const onSubmit = handleSubmit(async (values) => {
  const { email, password, nickname } = values
  if (!isUpdate.value) {
    await api.createAdmin(email, password, nickname, form.is_superuser, form.is_active)
    toast.success(t('success.create_admin'))
  } else {
    await api.updateAdmin(form.id!, email, password, nickname, form.is_superuser, form.is_active)
    toast.success(t('success.update_admin'))
  }
  isCreateUpdateAdminOpen.value = false
  await initData()
})
</script>

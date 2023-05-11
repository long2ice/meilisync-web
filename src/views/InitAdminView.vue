<template>
  <div class="flex w-full flex-1 flex-col items-center justify-center">
    <div class="flex flex-col items-center">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ $t('init_admin_form_title') }}</h2>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text"
                ><span class="text-error">* </span>{{ $t('email_label') }}</span
              >
            </label>
            <input
              type="text"
              placeholder="name@example.com"
              class="input-bordered input w-full max-w-xs"
              v-model="email"
              name="email"
            />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessageEmail }}</span>
            </label>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text"><span class="text-error">* </span>{{ $t('nickname') }}</span>
            </label>
            <input
              type="text"
              class="input-bordered input w-full max-w-xs"
              v-model="nickname"
              name="nickname"
              :placeholder="$t('nickname_placeholder')"
            />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessageNickname }}</span>
            </label>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text"><span class="text-error">* </span>{{ $t('password') }}</span>
            </label>
            <input
              type="password"
              v-model="password"
              name="password"
              placeholder="••••••••"
              class="input-bordered input w-full max-w-xs"
            />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessagePassword }}</span>
            </label>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text"
                ><span class="text-error">* </span>{{ $t('confirm_password') }}</span
              >
            </label>
            <input
              type="password"
              v-model="confirm_password"
              name="confirm_password"
              placeholder="••••••••"
              class="input-bordered input w-full max-w-xs"
            />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessageConfirmPassword }}</span>
            </label>
          </div>
          <button
            class="btn-primary btn"
            @click="onSubmit"
            :class="{
              loading: isSubmitting
            }"
          >
            {{ $t('create_admin') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import * as api from '@/api/init'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { getInit } from '@/api/init'
const init = await getInit()
const router = useRouter()
if (init.inited) {
  router.push({ path: '/login' })
}
const { t } = useI18n()
const { handleSubmit, isSubmitting } = useForm()
const { value: email, errorMessage: errorMessageEmail } = useField(
  'email',
  yup.string().email(t('validate.invalid_email')).required(t('validate.email_required'))
)
const { value: password, errorMessage: errorMessagePassword } = useField(
  'password',
  yup.string().required(t('validate.password_required'))
)
const { value: confirm_password, errorMessage: errorMessageConfirmPassword } = useField(
  'confirm_password',
  yup.string().required(t('validate.confirm_password_required'))
)
const { value: nickname, errorMessage: errorMessageNickname } = useField(
  'nickname',
  yup.string().required(t('validate.nickname_required'))
)
const onSubmit = handleSubmit(async (values) => {
  const { email, password, confirm_password, nickname } = values
  if (password !== confirm_password) {
    toast.error(t('error.password_not_match'))
    return
  }
  await api.initAdmin(email, password, nickname)
  await router.push({ path: '/login' })
  toast.success(t('success.init_admin'))
})
</script>

<style scoped></style>

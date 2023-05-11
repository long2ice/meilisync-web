<template>
  <div class="flex w-full flex-1 flex-col items-center justify-center">
    <div class="flex flex-col items-center">
      <h1 class="mb-8 text-5xl font-bold">MeiliSync</h1>
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ $t('login_form_title') }}</h2>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text"><span class="text-error">* </span>{{ $t('email') }}</span>
            </label>
            <input
              type="text"
              placeholder="name@example.com"
              @keyup.enter="onSubmit"
              class="input-bordered input w-full max-w-xs"
              v-model="email"
            />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessageEmail }}</span>
            </label>
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text"><span class="text-error">* </span>{{ $t('password') }}</span>
            </label>
            <input
              type="password"
              v-model="password"
              @keyup.enter="onSubmit"
              placeholder="••••••••"
              class="input-bordered input w-full max-w-xs"
            />
            <label class="label">
              <span class="label-text-alt text-error">{{ errorMessagePassword }}</span>
            </label>
          </div>
          <button
            class="btn-primary btn"
            @click="onSubmit"
            :class="{
              loading: isSubmitting
            }"
          >
            {{ $t('login') }}
          </button>
          <template v-if="oauth.length > 0">
            <div class="divider">OR</div>
            <div class="flex justify-center gap-4">
              <a
                :href="item.url"
                v-for="item in oauth"
                :key="item.type"
                @click="auth.oauth_type = item.type"
              >
                <OauthIcon :type="item.type" />
              </a>
            </div>
          </template>
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
import * as api from '@/api/auth'
import * as admin from '@/api/admin'

import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuth } from '@/stores/auth'
import { getOauth } from '@/api/auth'
import { ref } from 'vue'
import type { OauthResponse } from '@/types/responses'

const { t } = useI18n()
const router = useRouter()
const { handleSubmit, isSubmitting } = useForm()
const auth = useAuth()
const { value: email, errorMessage: errorMessageEmail } = useField(
  'email',
  yup.string().email(t('validate.invalid_email')).required(t('validate.email_required'))
)
const { value: password, errorMessage: errorMessagePassword } = useField(
  'password',
  yup.string().required(t('validate.password_required'))
)
const onSubmit = handleSubmit(async (values) => {
  const { email, password } = values
  auth.token = await api.login(email, password)
  auth.admin = await admin.getMe()
  await router.push({ path: '/' })
  toast.success(t('success.login'))
})
const oauth = ref<OauthResponse[]>([])
const route = useRoute()
const { code, state } = route.query
if (code) {
  const auth = useAuth()
  auth.token = await api.loginWithOauth(code as string, auth.oauth_type, state as string)
  auth.admin = await admin.getMe()
  router.push({ path: '/' })
  toast.success(t('success.login'))
} else {
  oauth.value = await getOauth(location.protocol + '//' + location.host + '/login')
}
</script>

<style scoped></style>

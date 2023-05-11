<template>
  <div class="navbar bg-neutral text-neutral-content">
    <div class="flex-1">
      <router-link class="btn-ghost btn text-xl normal-case" to="/">MeiliSync</router-link>
    </div>
    <div class="flex-none">
      <button class="btn-ghost btn-circle btn">
        <label class="swap swap-rotate">
          <input type="checkbox" data-toggle-theme="light,dark" />
          <MdOutlinedWbSunny class="swap-off text-xl" />
          <CoMoon class="swap-on text-xl" />
        </label>
      </button>
      <div class="dropdown-end dropdown">
        <label tabindex="0" class="btn-ghost btn-circle btn">
          <HiLanguage class="text-xl" />
        </label>
        <ul tabindex="0" class="dropdown-content menu rounded-box mt-3 bg-neutral p-3 shadow">
          <li>
            <button @click="language.language = 'en-US'">
              <span class="text-lg">🇺🇸</span>English
            </button>
          </li>
          <li>
            <button @click="language.language = 'zh-CN'">
              <span class="text-lg">🇨🇳</span>中文
            </button>
          </li>
        </ul>
      </div>
      <a
        class="btn-ghost btn-circle btn"
        href="https://github.com/long2ice/meilisync"
        target="_blank"
      >
        <AkGithubFill class="text-xl" />
      </a>
      <div class="dropdown-end dropdown dropdown-bottom" v-if="auth.admin.id">
        <div tabindex="0" class="flex cursor-pointer flex-col items-center">
          <div class="text-sm">{{ auth.admin.nickname }}</div>
          <div
            class="badge text-sm"
            :class="{
              'badge-primary': auth.admin.is_superuser,
              'badge-secondary': !auth.admin.is_superuser
            }"
          >
            {{ auth.admin.is_superuser ? $t('super_admin') : $t('admin') }}
          </div>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu rounded-box mt-2 w-36 bg-base-100 p-2 text-neutral-900 shadow"
        >
          <li>
            <button @click="isChangePassword = true">
              <CaPassword class="text-xl" />{{ $t('change_password') }}
            </button>
          </li>
          <li>
            <a @click="sign_out"><AkSignOut class="text-xl" />{{ $t('sign_out') }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <input type="checkbox" class="modal-toggle" v-model="isChangePassword" />
  <div class="modal">
    <div class="modal-box relative">
      <button
        class="btn-sm btn-circle btn absolute right-2 top-2"
        @click="isChangePassword = false"
      >
        ✕
      </button>
      <h3 class="text-lg font-bold">{{ $t('change_password') }}</h3>
      <div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span>{{ $t('old_password') }}</span
            >
          </label>
          <input
            type="password"
            class="input-bordered input"
            v-model="old_password"
            placeholder="••••••••"
          />
          <label class="label">
            <span class="label-text-alt text-error">{{ errorMessageOldPassword }}</span>
          </label>
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span>{{ $t('new_password') }}</span
            >
          </label>
          <input
            type="password"
            class="input-bordered input"
            v-model="new_password"
            placeholder="••••••••"
          />
          <label class="label">
            <span class="label-text-alt text-error">{{ errorMessageNewPassword }}</span>
          </label>
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span>{{ $t('confirm_new_password') }}</span
            >
          </label>
          <input
            type="password"
            class="input-bordered input"
            v-model="confirm_new_password"
            placeholder="••••••••"
          />
          <label class="label">
            <span class="label-text-alt text-error">{{ errorMessageConfirmNewPassword }}</span>
          </label>
        </div>
      </div>
      <div class="modal-action">
        <label
          class="btn"
          :class="{
            loading: isSubmitting
          }"
          @click="onSubmit"
          >{{ $t('change_password') }}</label
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { themeChange } from 'theme-change'
import { useLanguage } from '@/stores/language'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuth } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { change_password } from '@/api/admin'
const language = useLanguage()
const { t, locale } = useI18n()
locale.value = language.language
language.$subscribe((mutation, state) => {
  locale.value = state.language
})
const router = useRouter()
const auth = useAuth()
onMounted(() => {
  themeChange(false)
})
const isChangePassword = ref(false)
const sign_out = async () => {
  auth.sign_out()
  toast.success(t('success.logout'))
  await router.push('/login')
}
const { handleSubmit, isSubmitting } = useForm()
const { value: old_password, errorMessage: errorMessageOldPassword } = useField(
  'old_password',
  yup.string().required(t('validate.password_required'))
)
const { value: new_password, errorMessage: errorMessageNewPassword } = useField(
  'new_password',
  yup.string().required(t('validate.password_required'))
)
const { value: confirm_new_password, errorMessage: errorMessageConfirmNewPassword } = useField(
  'confirm_new_password',
  yup.string().required(t('validate.password_required'))
)
const onSubmit = handleSubmit(async (values) => {
  const { old_password, new_password, confirm_new_password } = values
  if (new_password !== confirm_new_password) {
    toast.error(t('validate.password_not_match'))
    return
  }
  await change_password(old_password, new_password)
  toast.success(t('success.change_password'))
  isChangePassword.value = false
  auth.sign_out()
  await router.push('/login')
})
</script>

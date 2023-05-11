<template>
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
        <span class="label-text"><span class="text-error">*</span>{{ $t('username') }}</span>
      </label>
      <input type="text" v-model="username" class="input-bordered input" />
      <label class="label">
        <span class="label-text-alt text-error">{{ errorMessageUsername }}</span>
      </label>
    </div>
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('password') }}</span>
      </label>
      <input type="text" class="input-bordered input" v-model="options.password" />
    </div>
  </div>
  <div class="form-control">
    <label class="label">
      <span class="label-text">{{ $t('other_options') }}</span>
    </label>
    <textarea
      class="textarea-bordered textarea h-24"
      v-model="options.otherOptions"
      :placeholder="$t('mysql_other_options_placeholder')"
    ></textarea>
    <label class="label">
      <span class="label-text-alt">
        {{ $t('mysql_restore_options_tips') }}
        <a
          class="link-primary link"
          href="https://dev.mysql.com/doc/refman/8.0/en/mysql.html"
          target="_blank"
          >https://dev.mysql.com/doc/refman/8.0/en/mysql.html</a
        >
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'

const options: {
  password: string
  otherOptions: string
} = reactive({
  password: '',
  otherOptions: ''
})
const { t } = useI18n()
const { value: host, errorMessage: errorMessageHost } = useField(
  'host',
  yup.string().required(t('validate.host_required'))
)
const { value: port, errorMessage: errorMessagePort } = useField(
  'port',
  yup.number().required(t('validate.port_required'))
)
const { value: username, errorMessage: errorMessageUsername } = useField(
  'username',
  yup.string().required(t('validate.username_required'))
)
host.value = 'localhost'
port.value = '3306'
username.value = 'root'

const getOptions = () => {
  return {
    '--host': host.value,
    '--port': port.value,
    '--user': username.value,
    '--password': options.password,
    other_options: options.otherOptions
  }
}
defineExpose({
  getOptions
})
</script>

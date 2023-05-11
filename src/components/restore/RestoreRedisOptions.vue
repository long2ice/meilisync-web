<template>
  <div class="flex flex-row gap-4">
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('host') }}<span class="text-error">*</span></span>
      </label>
      <input type="text" class="input-bordered input" v-model="host" />
      <label class="label">
        <span class="label-text-alt text-error">{{ errorMessageHost }}</span>
      </label>
    </div>
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('port') }}<span class="text-error">*</span></span>
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
        <span class="label-text">{{ $t('username') }}</span>
      </label>
      <input type="text" v-model="options.username" class="input-bordered input" />
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
      :placeholder="$t('redis_other_options_placeholder')"
    ></textarea>
    <label class="label">
      <span class="label-text-alt">
        {{ $t('redis_restore_options_tips') }}
        <a class="link-primary link" href="https://redis.io/docs/ui/cli/" target="_blank"
          >https://redis.io/docs/ui/cli/</a
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
  username: string
} = reactive({
  password: '',
  otherOptions: '',
  username: ''
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
host.value = 'localhost'
port.value = '6379'

const getOptions = () => {
  return {
    '-h': host.value,
    '-p': port.value,
    '--user': options.username,
    '--pass': options.password,
    other_options: options.otherOptions
  }
}
defineExpose({
  getOptions
})
</script>

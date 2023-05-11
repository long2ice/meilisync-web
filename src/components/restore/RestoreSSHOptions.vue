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
  <div class="flex gap-4">
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
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text"><span class="text-error">*</span>{{ $t('remote_path') }}</span>
    </label>
    <input type="text" class="input-bordered input" v-model="path" />
    <label class="label">
      <span class="label-text-alt text-error">{{ errorMessagePath }}</span>
    </label>
  </div>
  <div class="flex flex-row gap-4">
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('private_key') }}</span>
        <span class="label-text-alt link"
          ><input type="file" hidden @change="importPrivateKey" />{{
            t('import_private_key')
          }}</span
        >
      </label>
      <textarea v-model="options.private_key" class="textarea-bordered textarea h-24"></textarea>
    </div>
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('private_key_pass') }}</span>
      </label>
      <input type="text" v-model="options.private_key_pass" class="input-bordered input" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'

const options = reactive({
  password: '',
  private_key: '',
  private_key_pass: ''
})
const { t } = useI18n()
const { value: host, errorMessage: errorMessageHost } = useField(
  'host',
  yup.string().required(t('validate.host_required'))
)
const { value: port, errorMessage: errorMessagePort } = useField(
  'port',
  yup.string().required(t('validate.port_required'))
)
const { value: username, errorMessage: errorMessageUsername } = useField(
  'username',
  yup.string().required(t('validate.username_required'))
)
const { value: path, errorMessage: errorMessagePath } = useField(
  'path',
  yup.string().required(t('validate.path_required'))
)
host.value = 'localhost'
port.value = 22
username.value = 'root'
path.value = ''
const getOptions = () => {
  return {
    host: host.value,
    port: port.value,
    username: username.value,
    path: path.value,
    password: options.password,
    private_key: options.private_key,
    private_key_pass: options.private_key_pass
  }
}
const importPrivateKey = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (result) {
      options.private_key = result.toString()
    }
  }
  reader.readAsText(file)
}
defineExpose({
  getOptions
})
</script>

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
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ $t('backup_program') }}</span>
      </label>
      <select class="select-bordered select" v-model="options.backup_program">
        <option>pg_dump</option>
        <option>pg_dumpall</option>
      </select>
    </div>
  </div>
  <div class="form-control">
    <label class="label">
      <span class="label-text">{{ $t('other_options') }}</span>
    </label>
    <textarea
      class="textarea-bordered textarea h-24"
      v-model="options.otherOptions"
      :placeholder="$t('postgresql_other_options_placeholder')"
    ></textarea>
    <label class="label">
      <span class="label-text-alt">
        {{ $t('postgresql_other_options_tips', { backup_program: options.backup_program }) }}
        <a class="link-primary link" :href="refUrl" target="_blank">{{ refUrl }}</a>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useField } from 'vee-validate'
import * as yup from 'yup'
const props = defineProps<{
  defaultOptions: Record<string, any>
}>()
const defaultOptions = props.defaultOptions || {}
const options: {
  password: string
  otherOptions: string
  backup_program: string
} = reactive({
  password: defaultOptions['password'] || '',
  backup_program: defaultOptions['backup_program'] || 'pg_dump',
  otherOptions: defaultOptions['other_options'] || ''
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
host.value = defaultOptions['--host'] || 'localhost'
port.value = defaultOptions['--port'] || '5432'
username.value = defaultOptions['--username'] || 'postgres'
const refUrl = computed(() => {
  if (options.backup_program === 'pg_dump') {
    return 'https://www.postgresql.org/docs/current/app-pgdump.html'
  } else {
    return 'https://www.postgresql.org/docs/current/app-pg-dumpall.html'
  }
})

const getOptions = () => {
  return {
    '--host': host.value,
    '--port': port.value,
    '--username': username.value,
    password: options.password,
    backup_program: options.backup_program,
    other_options: options.otherOptions
  }
}
defineExpose({
  getOptions
})
</script>

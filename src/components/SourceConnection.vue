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
      <input type="password" class="input-bordered input" v-model="connection.password" />
    </div>
  </div>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text"><span class="text-error">*</span>{{ $t('database') }}</span>
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
      v-model="otherOptions"
      :placeholder="$t('other_options_placeholder')"
    ></textarea>
    <label class="label">
      <span class="label-text-alt">
        {{ $t('other_options_tips') }}
        <a
          class="link-primary link"
          v-if="type === 'mysql'"
          href="https://github.com/long2ice/asyncmy"
          target="_blank"
          >https://github.com/long2ice/asyncmy</a
        >
        <a
          class="link-primary link"
          v-else-if="type === 'postgres'"
          href="https://www.psycopg.org/docs/usage.html"
          target="_blank"
          >https://www.psycopg.org/docs/usage.html</a
        >
        <a
          class="link-primary link"
          href="https://motor.readthedocs.io/en/stable/"
          v-else-if="type === 'mongo'"
          target="_blank"
          >https://motor.readthedocs.io/en/stable/</a
        >
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import type { SourceType } from '@/types/responses'
import { dict2str, str2dict } from '@/utils/convert'
const props = defineProps<{
  connection: Record<string, any>
  type: SourceType
}>()
const defaultConnection = props.connection || {}
const connection = reactive(defaultConnection)
const otherOptions = ref(
  dict2str(defaultConnection, ['host', 'port', 'username', 'password', 'database'])
)

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
const { value: database, errorMessage: errorMessageDatabase } = useField(
  'database',
  yup.string().required(t('validate.database_required'))
)
host.value = defaultConnection['host'] || 'localhost'
port.value = defaultConnection['port']
username.value = defaultConnection['user'] || 'root'
const updatePort = (p: number) => {
  port.value = p
}
const getConnection = () => {
  return {
    host: host.value,
    port: port.value,
    user: username.value,
    database: database.value,
    password: connection.password,
    ...str2dict(otherOptions.value)
  }
}
defineExpose({
  getConnection,
  updatePort
})
</script>

<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text"><span class="text-error">*</span>{{ $t('local_path') }}</span>
    </label>
    <input type="text" class="input-bordered input" v-model="path" />
    <label class="label">
      <span class="label-text-alt text-error">{{ errorMessagePath }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
const props = defineProps<{
  defaultOptions: Record<string, any>
}>()
const { t } = useI18n()
const defaultOptions = props.defaultOptions || {}
const { value: path, errorMessage: errorMessagePath } = useField(
  'path',
  yup.string().required(t('validate.path_required'))
)
path.value = defaultOptions['path'] || ''
const getOptions = () => {
  return {
    path: path.value
  }
}
defineExpose({
  getOptions
})
</script>

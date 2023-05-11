<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
const { t } = useI18n()
defineProps({
  msg: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  }
})
const isModalOpen = ref(false)
setTimeout(() => {
  isModalOpen.value = true
}, 10)
const emit = defineEmits(['confirm', 'cancel'])
const onClick = (confirm: boolean) => {
  isModalOpen.value = false
  setTimeout(() => {
    if (confirm) {
      emit('confirm')
    } else {
      emit('cancel')
    }
  }, 300)
}
</script>

<template>
  <input type="checkbox" v-model="isModalOpen" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <button class="btn-sm btn-circle btn absolute right-2 top-2" @click="onClick(false)">
        ✕
      </button>
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <p class="py-4">{{ msg }}</p>
      <div class="modal-action">
        <button class="btn-primary btn" @click="onClick(true)">
          {{ t('confirm_title') }}
        </button>
        <button class="btn" @click="onClick(false)">{{ t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

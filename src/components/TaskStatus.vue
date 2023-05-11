<template>
  <span
    class="badge"
    :class="{
      'badge-info': status === 'running',
      'badge-error': status === 'failed',
      'badge-success': status === 'success'
    }"
    >{{ props.status.toUpperCase() }}</span
  >
</template>

<script setup lang="ts">
const props = defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

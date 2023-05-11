<template>
  <button
    class="btn-primary btn-sm btn"
    @click="onRestore(data)"
    :class="{
      'btn-disabled': data.is_deleted || data.status != 'success'
    }"
  >
    <MdTwotoneRestore />
  </button>
</template>

<script setup lang="ts">
import type { TaskLogResponse } from '@/types/responses'

defineProps<{
  data: TaskLogResponse
  onRestore: (data: TaskLogResponse) => void
}>()
</script>

<style scoped></style>

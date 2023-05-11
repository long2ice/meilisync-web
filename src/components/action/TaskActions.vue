<template>
  <button class="btn-primary btn-sm btn" @click="onEdit(data)">
    <BxSolidEditAlt />
  </button>
  <button
    class="btn-accent btn-sm btn"
    @click="onTask(data.id)"
    :class="{
      'btn-disabled': !data.enabled
    }"
  >
    <AkPlay />
  </button>
</template>

<script setup lang="ts">
import type { TaskResponse } from '@/types/responses'

defineProps<{
  data: TaskResponse
  onTask: (id: number) => void
  onEdit: (data: TaskResponse) => void
}>()
</script>

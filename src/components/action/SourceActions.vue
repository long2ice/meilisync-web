<template>
  <button class="btn-primary btn-sm btn" @click="onEdit(data)">
    <BxSolidEditAlt />
  </button>
</template>

<script setup lang="ts">
import type { SourceResponse } from '@/types/responses'

defineProps<{
  data: SourceResponse
  onEdit: (data: SourceResponse) => void
}>()
</script>

<style scoped></style>

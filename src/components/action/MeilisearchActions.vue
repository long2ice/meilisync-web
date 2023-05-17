<template>
  <button class="btn-primary btn-sm btn" @click="onEdit(data)">
    <BxSolidEditAlt />
  </button>
</template>

<script setup lang="ts">
import type { MeilisearchResponse } from '@/types/responses'

defineProps<{
  data: MeilisearchResponse
  onEdit: (data: MeilisearchResponse) => void
}>()
</script>

<style scoped></style>

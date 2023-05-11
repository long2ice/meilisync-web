<template>
  <button class="btn-primary btn-sm btn" @click="onEdit(data)">
    <BxSolidEditAlt />
  </button>
</template>

<script setup lang="ts">
import type { AdminResponse } from '@/types/responses'

defineProps<{
  data: AdminResponse
  onEdit: (data: AdminResponse) => void
}>()
</script>

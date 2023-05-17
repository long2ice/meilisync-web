<template>
  <button class="btn-primary btn-sm btn" @click="onEdit(data)">
    <BxSolidEditAlt />
  </button>
  <button class="btn-accent btn-sm btn" @click="onRefresh(data.id)">
    <CdRefresh />
  </button>
  <button class="btn-secondary btn-sm btn" @click="onCheck(data.id)">
    <AkCircleCheck />
  </button>
</template>

<script setup lang="ts">
import type { SyncResponse } from '@/types/responses'

defineProps<{
  data: SyncResponse
  onRefresh: (id: number) => void
  onCheck: (id: number) => void
  onEdit: (data: Record<string, any>) => void
}>()
</script>

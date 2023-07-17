<template>
  <button class="btn-primary btn-sm btn" @click="onEdit(data)">
    <BxSolidEditAlt />
  </button>
  <div class="tooltip" :data-tip="$t('tooltip.sync_progress')">
    <button class="btn-secondary btn-sm btn" @click="onSyncProgress(data.id)">
      <AnOutlinedFileSync />
    </button>
  </div>
  <div class="tooltip" :data-tip="$t('tooltip.refresh')">
    <button class="btn-accent btn-sm btn" @click="onRefresh(data.id)">
      <CdRefresh />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SyncResponse } from '@/types/responses'

defineProps<{
  data: SyncResponse
  onRefresh: (id: number) => void
  onSyncProgress: (id: number) => void
  onEdit: (data: Record<string, any>) => void
}>()
</script>

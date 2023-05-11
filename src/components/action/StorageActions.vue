<template>
  <router-link class="btn-primary btn-sm btn" :to="`/storage/${data.id}/update`">
    <BxSolidEditAlt />
  </router-link>
</template>

<script setup lang="ts">
import type { StorageResponse } from '@/types/responses'

defineProps<{
  data: StorageResponse
}>()
</script>

<style scoped></style>

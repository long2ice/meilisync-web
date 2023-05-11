<template>
  <router-link class="btn-primary btn-sm btn" :to="`/datasource/${data.id}/update`">
    <BxSolidEditAlt />
  </router-link>
</template>

<script setup lang="ts">
import type { DataSourceResponse } from '@/types/responses'

defineProps<{
  data: DataSourceResponse
}>()
</script>

<style scoped></style>

<template>
  <DeMysqlOriginalWordmark v-if="type === 'mysql'" class="text-5xl" />
  <DePostgresqlOriginalWordmark v-else-if="type === 'postgres'" class="text-5xl" />
  <VsFolderTypeMongodb v-if="type === 'mongo'" class="text-5xl" />
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { SourceType } from '@/types/responses'

const props = defineProps<{
  type: SourceType
}>()
const type = toRef(props, 'type')
</script>

<style scoped></style>

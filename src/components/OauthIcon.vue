<template>
  <AkGithubFill class="text-3xl" v-if="type === 'github'" />
  <DeGoogleOriginal class="text-3xl" v-if="type === 'google'" />
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String
  }
})
</script>

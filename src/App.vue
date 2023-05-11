<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>
<template>
  <Suspense>
    <div class="flex min-h-screen flex-col">
      <NavBar />
      <router-view />
    </div>
  </Suspense>
  <DialogsWrapper />
</template>

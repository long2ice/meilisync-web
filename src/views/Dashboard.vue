<template>
  <div class="flex flex-1">
    <Sidebar />
    <div class="flex w-full flex-col">
      <div class="flex w-full flex-col gap-2 p-4">
        <RouterView />
      </div>
      <Footer class="mt-auto" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
</script>

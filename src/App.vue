<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useTheme } from '@/stores/theme'
const theme = useTheme()
new MutationObserver(function () {
  theme.theme = document.documentElement.dataset.theme ?? 'light'
}).observe(document.documentElement, { attributes: true })
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

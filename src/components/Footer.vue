<template>
  <footer class="footer footer-center bg-base-300 p-4 text-base-content">
    <div>
      <p>
        Copyright © {{ nowYear }} - All right reserved by
        <a class="link" href="mailto:long2ice@gmail.com" target="_blank">long2ice</a>
        <span class="mx-2 font-bold">|</span>
        <span>{{ $t('license', { name: license.name, expire: license.expire }) }}</span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { getLicense } from '@/api/license'

const nowYear = new Date().getFullYear()
const license = await getLicense()
</script>

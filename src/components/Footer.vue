<template>
  <footer class="footer footer-center bg-base-300 p-4 text-base-content">
    <div>
      <p>
        Copyright © {{ nowYear }} - All right reserved by
        <a class="link" href="mailto:long2ice@gmail.com" target="_blank">long2ice</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const nowYear = new Date().getFullYear()
</script>

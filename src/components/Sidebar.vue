<template>
  <div class="flex flex-col items-center border-r">
    <ul
      class="menu bg-base-100"
      :class="{
        'w-fit': sidebar.close,
        'w-56': !sidebar.close
      }"
    >
      <li>
        <router-link
          to="/"
          :class="{
            active: currentRoute.path === '/'
          }"
        >
          <AkHomeAlt1 class="text-2xl" />
          <span v-show="!sidebar.close">{{ $t('home') }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/source"
          :class="{
            active: currentRoute.path.startsWith('/source')
          }"
        >
          <FeDatabase class="text-2xl" />
          <span v-show="!sidebar.close">{{ $t('source') }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          to="/meilisearch"
          :class="{ active: currentRoute.path.startsWith('/meilisearch') }"
        >
          <FlTextBulletListSquareSearch class="text-2xl" />
          <span v-show="!sidebar.close">{{ $t('meilisearch') }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/sync" :class="{ active: currentRoute.path === '/sync' }">
          <CdSync class="text-2xl" />
          <span v-show="!sidebar.close">{{ $t('sync') }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/sync_log" :class="{ active: currentRoute.path === '/sync_log' }">
          <AnOutlinedFileSync class="text-2xl" />
          <span v-show="!sidebar.close">{{ $t('sync_log') }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin" :class="{ active: currentRoute.path === '/admin' }">
          <CaUserAdmin class="text-2xl" />
          <span v-show="!sidebar.close">{{ $t('admin') }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/action_log" :class="{ active: currentRoute.path === '/action_log' }">
          <CaCloudLogging class="text-2xl" />
          <span v-show="!sidebar.close">{{ $t('action_log') }}</span>
        </router-link>
      </li>
    </ul>
    <div
      class="mt-auto flex w-full cursor-pointer justify-center bg-base-300 p-4"
      @click="sidebar.close = !sidebar.close"
    >
      <GlCollapseLeft
        class="text-xl"
        :class="{
          'rotate-180 transform': sidebar.close
        }"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSidebarState } from '@/stores/sidebar'
const currentRoute = useRoute()
const sidebar = useSidebarState()
</script>

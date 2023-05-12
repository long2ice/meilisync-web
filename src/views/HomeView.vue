<template>
  <div class="flex gap-4">
    <div class="stats shadow">
      <router-link to="/source">
        <div class="stat">
          <div class="stat-figure">
            <FeDatabase class="text-2xl" />
          </div>
          <div class="stat-title">{{ $t('source') }}</div>
          <div class="stat-value">{{ stat.source_count }}</div>
        </div>
      </router-link>
      <router-link to="/sync">
        <div class="stat">
          <div class="stat-figure">
            <TiOutlineCloudStorage class="text-2xl" />
          </div>
          <div class="stat-title">{{ $t('sync') }}</div>
          <div class="stat-value">{{ stat.sync_count }}</div>
        </div>
      </router-link>
      <router-link to="/sync_log">
        <div class="stat">
          <div class="stat-figure">
            <BsListTask class="text-2xl" />
          </div>
          <div class="stat-title">{{ $t('sync_log') }}</div>
          <div class="stat-value">{{ stat.sync_log_count }}</div>
        </div>
      </router-link>
      <router-link to="/meilisearch">
        <div class="stat">
          <div class="stat-figure">
            <GlTaskDone class="text-2xl" />
          </div>
          <div class="stat-title">{{ $t('meilisearch') }}</div>
          <div class="stat-value">{{ stat.meili_count }}</div>
        </div>
      </router-link>
      <router-link to="/admin">
        <div class="stat">
          <div class="stat-figure">
            <CaUserAdmin class="text-2xl" />
          </div>
          <div class="stat-title">{{ $t('admin') }}</div>
          <div class="stat-value">{{ stat.admin_count }}</div>
        </div>
      </router-link>
      <router-link to="/action_log">
        <div class="stat">
          <div class="stat-figure">
            <CaCloudLogging class="text-2xl" />
          </div>
          <div class="stat-title">{{ $t('action_log') }}</div>
          <div class="stat-value">{{ stat.action_log_count }}</div>
        </div>
      </router-link>
    </div>
  </div>
  <div class="mt-4 max-w-lg">
    <VueDatePicker
      v-model="date"
      :locale="locale"
      range
      multi-calendars
      :enable-time-picker="false"
      :dark="theme === 'dark'"
    />
  </div>
  <div class="w-[75%]">
    <Line :options="options" :data="data" />
  </div>
</template>
<script setup lang="ts">
import { getStats } from '@/api/stat'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns'

const { t, locale } = useI18n()
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
const date = ref()
const theme = ref()
const data = ref<{
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    tension: number
  }[]
}>({
  labels: [],
  datasets: []
})
const stat = ref({
  source_count: 0,
  sync_count: 0,
  sync_log_count: 0,
  meili_count: 0,
  admin_count: 0,
  action_log_count: 0
})
onMounted(async () => {
  const startDate = new Date(new Date().setDate(new Date().getDate() - 30))
  const endDate = new Date()
  date.value = [startDate, endDate]
  theme.value = document.documentElement.dataset.theme
  await initData()
})
new MutationObserver(function () {
  theme.value = document.documentElement.dataset.theme
}).observe(document.documentElement, { attributes: true })
const options = {
  plugins: {
    title: {
      display: true,
      text: t('sync_log_stat')
    }
  }
}
const initData = async () => {
  const ret = await getStats(
    format(date.value[0], 'yyyy-MM-dd'),
    format(date.value[1], 'yyyy-MM-dd')
  )
  stat.value = ret
  const sync_logs = ret.sync_logs
  data.value = {
    labels: _.map(sync_logs, 'date'),
    datasets: [
      {
        label: 'CREATE',
        data: _.map(sync_logs, (log) => {
          if (log.type == 'create') {
            return log.count
          }
          return 0
        }),
        backgroundColor: '#00ff00',
        tension: 0.3
      },
      {
        label: 'UPDATE',
        data: _.map(sync_logs, (log) => {
          if (log.type == 'update') {
            return log.count
          }
          return 0
        }),
        backgroundColor: '#0000ff',
        tension: 0.3
      },
      {
        label: 'DELETE',
        data: _.map(sync_logs, (log) => {
          if (log.type == 'delete') {
            return log.count
          }
          return 0
        }),
        backgroundColor: '#ff0000',
        tension: 0.3
      }
    ]
  }
}
</script>

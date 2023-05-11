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
  <div class="max-w-5xl">
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

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
const { t } = useI18n()
const stat = await getStats()
const options = {
  plugins: {
    title: {
      display: true,
      text: t('task_log_stat')
    }
  }
}
const sync_logs = stat.sync_logs
const data = {
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
</script>

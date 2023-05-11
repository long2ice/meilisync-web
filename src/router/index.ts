import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/init_admin',
      component: () => import('@/views/InitAdminView.vue')
    },
    {
      path: '/',
      component: () => import('@/views/Dashboard.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: '/source',
          component: () => import('@/views/SourceView.vue')
        },
        {
          path: '/meilisearch',
          component: () => import('@/views/MeilisearchView.vue')
        },
        {
          path: '/sync',
          component: () => import('@/views/SyncView.vue')
        },
        {
          path: '/sync_log',
          component: () => import('@/views/SyncLogView.vue')
        },
        {
          path: '/admin',
          component: () => import('@/views/AdminView.vue')
        },
        {
          path: '/action_log',
          component: () => import('@/views/ActionLogView.vue')
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@/views/NotFoundView.vue')
    },
    { path: '/:pathMatch(.*)', redirect: '/404' }
  ]
})

export default router

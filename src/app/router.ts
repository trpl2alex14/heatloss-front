import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

interface RouteMeta {
  title: string
  icon?: string
  bottom?: boolean
}

interface IAppRoute {
  name: string,
  path: string,
  meta: RouteMeta
}

export type AppRoute = IAppRoute & RouteRecordRaw

const routes = [
  {
    path: '/create',
    name: 'CreateCalculation',
    meta: { title: 'Создать расчёт', icon: 'file-plus-2.svg' },
    component: () => import('@features/calculations/components/CalculationsPage.vue')
  },
  {
    path: '/',
    redirect: '/calculations'
  },
  {
    path: '/calculations',
    name: 'Calculations',
    meta: { title: 'Расчёты', icon: 'layout-list.svg' },
    component: () => import('@features/calculations/components/CalculationsPage.vue')
  },
  {
    path: '/requests',
    name: 'Requests',
    meta: { title: 'Заявки', icon: 'mails.svg' },
    component: () => import('@features/requests/components/RequestsPage.vue')
  },
  {
    path: '/cases',
    name: 'Cases',
    meta: { title: 'Кейсы', icon: 'book-open-check.svg' },
    component: () => import('@features/cases/components/CasesPage.vue')
  },
  {
    path: '/directories',
    name: 'Directories',
    meta: { title: 'Справочники', icon: 'database.svg' },
    component: () => import('@features/directories/components/DirectoriesPage.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { title: 'Настройки', icon: 'settings.svg', bottom: true },
    component: () => import('@features/settings/components/SettingsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
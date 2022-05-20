import { createRouter as baseCreateRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/pages/index.vue'),
  },
  {
    name: 'item',
    path: '/:workspace/:path(.*)',
    props: true,
    component: () => import('@/pages/item/index.vue'),
  },
]

export default function createRouter() {
  return baseCreateRouter({
    history: createWebHashHistory(),
    routes,
  })
}

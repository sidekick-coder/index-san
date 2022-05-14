import { defineAsyncComponent } from 'vue'
import { createRouter as baseCreateRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    name: 'home',
    path: '/',
    component: defineAsyncComponent(() => import('@/pages/index.vue')),
  },
  {
    name: 'file',
    path: '/:workspace/:file(.*)',
    props: true,
    component: defineAsyncComponent(() => import('@/pages/view.vue')),
  },
]

export default function createRouter() {
  return baseCreateRouter({
    history: createWebHashHistory(),
    routes,
  })
}

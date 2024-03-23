import { Router } from 'vue-router'

export default (router: Router) => {
    router.addRoute('main', {
        path: '/cheat-sheet',
        component: () => import('./pages/CheatSheet.vue'),
    })
}

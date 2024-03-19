import { defineStartup } from '@composables/define-helpers'
import { useStore } from '@modules/workspace/store'
import { watch } from 'vue'

export default defineStartup(async (app) => {
    const store = useStore()

    await store.setWorkspaces()

    watch(
        () => store.workspaces.length,
        (length) => {
            if (length) return

            app.config.globalProperties.$router.push('/welcome')
        },
        { immediate: true }
    )
})

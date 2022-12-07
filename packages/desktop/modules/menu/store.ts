import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import get from 'lodash/get'

import ShowWorkspaceOptionsDTO from '@core/use-cases/show-workspace-options/show-workspace-options.dto'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useCase } from '@/composables/use-case'

interface Menu {
    label: string
    to: string
    icon?: string
    section?: string
    children?: []
}

export const useStore = defineStore('menu', () => {
    const menu = ref<Menu[]>([])

    const workspace = useWorkspace()

    async function setMenu(workspaceId: string) {
        await useCase<ShowWorkspaceOptionsDTO.Output>('show-workspace-options', {
            workspaceId,
        })
            .then((r) => (menu.value = get(r, 'data.menu.items', [])))
            .catch(() => (menu.value = []))
    }

    watch(() => workspace.currentId, setMenu, { immediate: true })

    return {
        menu,
    }
})

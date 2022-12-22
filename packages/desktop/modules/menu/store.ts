import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import { useCase } from '@/composables/use-case'
import Menu from '@core/entities/menu'

export const useStore = defineStore('menu', () => {
    const menu = ref<Menu[]>([])

    const workspace = useWorkspace()

    async function setMenu(workspaceId = workspace.currentId) {
        await useCase('show-menu', {
            workspaceId: workspaceId || workspace.currentId!,
        })
            .then((r) => (menu.value = r.data))
            .catch(() => (menu.value = []))
    }

    async function save() {
        await useCase('update-menu', {
            workspaceId: workspace.currentId!,
            data: menu.value,
        })
    }

    async function create(item: Menu) {
        menu.value.push(item)

        await save()
    }

    watch(() => workspace.currentId, setMenu)

    return {
        menu,

        setMenu,
        save,
        create,
    }
})

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import ShowMenuDTO from '@core/use-cases/show-menu/show-menu.dto'
import { useCase } from '@/composables/use-case'
import Menu from '@core/entities/menu'

export const useStore = defineStore('menu', () => {
    const menu = ref<Menu[]>([])

    const workspace = useWorkspace()

    async function setMenu(workspaceId = workspace.currentId) {
        await useCase<ShowMenuDTO.Output>('show-menu', {
            workspaceId,
        })
            .then((r) => (menu.value = r.data))
            .catch(() => (menu.value = []))
    }

    async function save() {
        await useCase('update-menu', {
            workspaceId: workspace.currentId,
            data: menu.value,
        })
    }

    async function destroy(item: Menu) {
        // if (!option.options.menu) return
        // const index = option.options.menu.indexOf(item)
        // if (index === -1) return
        // option.options.menu.splice(index, 1)
        // await save()
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
        destroy,
    }
})

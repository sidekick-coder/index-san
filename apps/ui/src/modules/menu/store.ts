import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { useStore as useWorkspace } from '@modules/workspace/store'

import { useCase } from '@composables/use-case'
import Menu from '@index-san/core/entities/menu'

export const useStore = defineStore('menu', () => {
    const menu = ref<Menu[]>([])

    const workspace = useWorkspace()

    async function setMenu(workspaceId = workspace.currentId) {
        if (!workspaceId) {
            menu.value = []
            return
        }

        await useCase('show-menu', {
            workspaceId: workspaceId || workspace.currentId!,
        })
            .then((r) => (menu.value = r.data))
            .catch(() => (menu.value = []))
    }

    async function save() {
        if (!workspace.currentId) return

        await useCase('update-menu', {
            workspaceId: workspace.currentId!,
            data: menu.value,
        })
    }

    async function create(item: Menu) {
        menu.value.push(item)

        await save()
    }

    function addSection() {
        menu.value.push({
            id: String(Math.random() * 9999),
            label: 'Label',
            icon: 'code',
            isSection: true,
            children: [],
        })
    }

    watch(() => workspace.currentId, setMenu)

    watch(menu, save, { deep: true })

    return {
        menu,

        setMenu,
        addSection,
        save,
        create,
    }
})

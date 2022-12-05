import { defineStore } from 'pinia'
import { useCase, DataResponse } from '@/composables/use-case'
import { useWorkspace } from './workspaces'
import get from 'lodash/get'
import set from 'lodash/set'
import uniqBy from 'lodash/uniqBy'
import uuid from 'uuid-random'

export interface Option {
    workspaceId: string
    value: Record<string, any>
}

export interface MenuItem {
    id: string
    workspaceId: string
    label: string
    to: string
    icon?: string
}

export const useOptionStore = defineStore('workspace-options', {
    state: () => ({
        options: [] as Option[],
    }),
    getters: {
        menuItems(state) {
            const menuItems: MenuItem[] = []

            state.options.forEach((o) => {
                const menu: any[] = get(o, 'value.menu.items', [])

                menu.forEach((i) =>
                    menuItems.push({
                        ...i,
                        workspaceId: o.workspaceId,
                    })
                )
            })

            return uniqBy(menuItems, 'id')
        },
    },
    actions: {
        async load() {
            const workspace = useWorkspace()

            this.options = []

            if (!workspace.all.length) await workspace.setAll()

            for await (const w of workspace.all) {
                const { data } = await useCase<DataResponse<any>>('show-workspace-options', {
                    workspaceId: w.id,
                })

                this.options.push({
                    workspaceId: w.id,
                    value: data,
                })
            }
        },
        async update(workspaceId: string, data: any) {
            await useCase('update-workspace-options', { workspaceId, data })
        },
        async addFavorite(item: Omit<MenuItem, 'id'>) {
            const data = {
                id: uuid(),
                label: item.label,
                to: item.to,
            }

            let option = this.options.find((o) => o.workspaceId === item.workspaceId)

            if (!option) return

            option = option.value

            const items = get(option, 'menu.items', [])

            items.push(data)

            set(option, 'menu.items', items)

            await this.update(item.workspaceId, option)
        },
        async removeFavorite(item: MenuItem) {
            let option = this.options.find((o) => o.workspaceId === item.workspaceId)

            if (!option) return

            option = option.value

            const items: MenuItem[] = get(option, 'menu.items', [])

            const index = items.findIndex((i) => i.id === item.id)

            if (index === -1) return

            items.splice(index, 1)

            set(option, 'menu.items', items)

            await this.update(item.workspaceId, option)
        },
    },
})

import orderBy from 'lodash/orderBy'

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useStore as useOptions } from '@/modules/option/store'

export interface Menu {
    label: string
    to: string
    icon?: string
    section?: string
    children?: []
}

export const useStore = defineStore('menu', () => {
    const option = useOptions()

    const menu = computed<Menu[]>(() => {
        return orderBy(option.options.menu || [], 'order')
    })

    async function save() {
        await option.save({
            data: { menu: menu.value.slice() },
        })
    }

    async function destroy(item: Menu) {
        if (!option.options.menu) return

        const index = option.options.menu.indexOf(item)

        if (index === -1) return

        option.options.menu.splice(index, 1)

        await save()
    }

    async function create(item: Menu) {
        option.options.menu?.push(item)

        await save()
    }

    return {
        menu,

        save,
        create,
        destroy,
    }
})

import orderBy from 'lodash/orderBy'

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useStore as useOptions } from '@/modules/options/store'

interface Menu {
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

    return {
        menu,
        save,
    }
})

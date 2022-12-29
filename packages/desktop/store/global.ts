import { defineStore } from 'pinia'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import { useStore as useCollection } from '@/modules/collection/store'
import { useStore as useItem } from '@/modules/item/store'
import { useStore as useEntry } from '@/modules/entry/store'
import { useStore as useView } from '@/modules/view/store'
import { useStore as useColumn } from '@/modules/collection-column/store'
import { useStore as useMenu } from '@/modules/menu/store'

export const useStore = defineStore('global', () => {
    const workspace = useWorkspace()
    const collection = useCollection()
    const item = useItem()
    const view = useView()
    const entry = useEntry()
    const column = useColumn()
    const menu = useMenu()

    return {
        workspace,
        collection,
        item,
        entry,
        view,
        column,
        menu,
    }
})

import { faker } from '@faker-js/faker'
import { test, expect, describe, beforeAll, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

import type { VueWrapper, ComponentMountingOptions } from '@vue/test-utils'

import ViewTable from '@index-san/core/entities/view-table'
import Collection from '@index-san/core/entities/collection'
import ItemFactory from '@index-san/core/__tests__/factories/item'
import CollectionFactory from '@index-san/core/__tests__/factories/collections'
import ColumnFactory from '@index-san/core/__tests__/factories/column'
import { ViewTableFactory } from '@index-san/core/__tests__/factories/view'

import VResizeLine from '@components/VResizeLine.vue'
import VMenu from '@components/VMenu.vue'
import CColumn from '@modules/column/components/CColumn.vue'
import IValue from '@modules/item/components/IValue.vue'
import CTable from './CTable.vue'
import CActions from './CActions.vue'

import { useStore } from '@store/global'
import { useItemStore } from '@modules/item/store'
import { useViewStore } from '@modules/view/store'
import { useApp } from '__tests__/fixtures/app'
import Workspace from '@index-san/core/entities/workspace'
import { waitFor } from '@composables/utils'
import pinia from '@plugins/pinia'
import { useMountWrapper } from '__tests__/fixtures/component'

describe('CTable.vue', () => {
    let globalStore: ReturnType<typeof useStore>

    const component = useMountWrapper(CTable, {
        global: {
            stubs: {
                IValue: true,
                CcColumn: true,
                CActions: true,
                WForm: true,
                VMenu: {
                    render() {
                        return this.$slots.default?.()
                    },
                },
            },
        },
    })

    const app = useApp()

    let workspace: Workspace

    beforeAll(async () => {
        workspace = app.config.workspaceRepository.createFakeSync()

        setActivePinia(createPinia())

        globalStore = useStore()

        globalStore.workspace.workspaces = [workspace]
        globalStore.workspace.currentId = workspace.id

        await globalStore.collection.setCollections()
    })

    afterEach(() => {
        component.unmount()
    })

    async function createCollection(data?: Partial<Collection>) {
        const collection = CollectionFactory.create(data)

        await waitFor(() => !!globalStore.workspace.current)

        await globalStore.collection.create(collection)

        return collection
    }

    function createView(collectionId: string, data?: Partial<ViewTable>) {
        const view = ViewTableFactory.create(data)

        const store = useViewStore(collectionId)

        store.views.push(view)

        return view
    }

    function findActions() {
        return component.wrapper!.findComponent(CActions)
    }

    function findColumns() {
        return component.wrapper!.findAllComponents(CColumn)
    }

    function findColumnResizeLines() {
        return component.wrapper!.findAllComponents(VResizeLine)
    }

    function findColumnsEmpty() {
        return component.wrapper!.find('[data-test-id=no-columns]')
    }

    function findTableWrapper() {
        return component.wrapper!.find('[data-test-id=table-wrapper]')
    }

    function findRowElements() {
        return component.wrapper!.findAll('[data-test-id=item-row]')
    }

    function findViewButton() {
        return component.wrapper!.find('[data-test-id=view-item]')
    }

    function findActionMenu() {
        return component.wrapper!.findComponent(VMenu)
    }

    function findValues() {
        return component.wrapper!.findAllComponents(IValue)
    }

    test('should set component height and width', async () => {
        const collection = await createCollection()

        const wrapper = component.mount({
            props: {
                collectionId: collection.id,
                height: 500,
                width: 1000,
            },
        })

        const style = wrapper.attributes('style')

        expect(style).toBe('width: 1000px; height: 500px;')
    })

    test('should show c-actions by default', async () => {
        const collection = await createCollection()

        const wrapper = component.mount({
            props: {
                collectionId: collection.id,
            },
        })

        expect(findActions().exists()).toBe(true)
    })

    test('should table wrapper element have dynamic height if actions is showed', async () => {
        const collection = await createCollection()

        component.mount({
            props: {
                collectionId: collection.id,
            },
        })

        await nextTick()

        const classes = findTableWrapper().attributes('class') || ''

        expect(classes.includes('h-[calc(100%_-_53px)]')).toBe(true)
    })

    test('should hide c-actions when props hideActions is true', async () => {
        const collection = await createCollection()

        component.mount({
            props: {
                collectionId: collection.id,
                hideActions: true,
            },
        })

        expect(findActions().exists()).toBe(false)
    })

    test('should render a c-column for each collection column', async () => {
        const collection = await createCollection({
            columns: ColumnFactory.createMany(20),
        })

        component.mount({
            props: {
                collectionId: collection.id,
            },
        })

        expect(findColumns().length).toBe(collection.columns.length)
    })

    test('should render empty message when collections columns are empty', async () => {
        const collection = await createCollection({
            columns: [],
        })

        component.mount({
            props: {
                collectionId: collection.id,
            },
        })

        expect(findColumnsEmpty().exists()).toBe(true)
    })

    test('should columns hidden in view not be visible', async () => {
        const collection = await createCollection({
            columns: ColumnFactory.createMany(20),
        })

        const view = createView(collection.id, {
            columns: collection.columns.map((c, index) => ({
                id: c.id,
                hide: index > 10,
                width: 200,
            })),
        })

        const wrapper = component.mount({
            props: {
                collectionId: collection.id,
                viewId: view.id,
            },
        })

        const { length } = findColumns().filter((w) => w.isVisible())

        expect(length).toBe(view.columns.filter((c) => !c.hide).length)
    })

    test('should each column render a v-resize-line', async () => {
        const collection = await createCollection({
            columns: ColumnFactory.createMany(20),
        })

        component.mount({
            props: {
                collectionId: collection.id,
            },
        })

        expect(findColumnResizeLines().length).toBe(collection.columns.length)
    })

    test('should show menu when trigger @contextmenu in item tr element', async () => {
        const collection = await createCollection({
            columns: [ColumnFactory.create({ label: 'Name', field: 'name' })],
        })

        const items = ItemFactory.createMany(5, {
            name: faker.person.firstName(),
        })

        const store = useItemStore(collection.id)

        store.items = items

        component.mount({
            props: {
                collectionId: collection.id,
            },
        })

        const [el] = findRowElements()
        const viewBtn = findViewButton()

        await el.trigger('contextmenu')

        const menu = findActionMenu()

        expect(menu.isVisible()).toBe(true)

        expect(viewBtn.isVisible()).toBe(true)

        expect(viewBtn.attributes('to')).toBe(`/collections/${collection.id}/items/${items[0].id}`)
    })

    test('should a i-value for each item and each column', async () => {
        const collection = await createCollection({
            columns: ColumnFactory.createMany(),
        })

        const items = ItemFactory.createMany(5, {
            name: faker.person.firstName(),
        })

        const store = useItemStore(collection.id)

        store.items = items

        component.mount({
            props: {
                collectionId: collection.id,
            },
        })

        expect(findValues().length).toBe(items.length * collection.columns.length)
    })
})

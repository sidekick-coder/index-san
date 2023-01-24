import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import uniqBy from 'lodash/uniqBy'
import debounce from 'lodash/debounce'

import { useStore as useWorkspace } from '@modules/workspace/store'

import View from '@core/entities/view'
import ViewTable from '@core/entities/view-table'
import ViewGallery from '@core/entities/view-gallery'
import ViewGroup from '@core/entities/view-group'

import { useCase } from '@composables/use-case'
import { useHooks } from '@plugins/hooks'
import { useNonReactive, waitFor } from '@composables/utils'

export type AnyView = View | ViewTable | ViewGallery | ViewGroup

function createStore(collectionId: string) {
    const workspace = useWorkspace()
    const views = ref<AnyView[]>([])
    const loading = ref(false)

    const watcher = watch(
        views,
        () => {
            if (loading.value) return

            saveWithDebounce()
        },
        { deep: true }
    )

    const saveWithDebounce = debounce(save, 500)

    async function save() {
        if (loading.value) return

        await useCase('update-views', {
            workspaceId: workspace.currentId!,
            collectionId,
            data: uniqBy(views.value, 'id'),
        })
    }

    async function load() {
        if (loading.value) return

        if (views.value.length) return

        loading.value = true

        await useCase('show-views', {
            workspaceId: workspace.currentId!,
            collectionId,
        })
            .then((r) => (views.value = r.data))
            .catch(() => (views.value = []))
            .finally(() => (loading.value = false))
    }

    function get<T extends View>(id: string) {
        const view = views.value.find((v) => v.id === id)

        return view ? (view as T) : null
    }

    function set<T extends View>(id: string, payload: Partial<T>) {
        const index = views.value.findIndex((v) => v.id === id)

        if (index !== -1) {
            views.value[index] = {
                ...views.value[index],
                ...payload,
            }
        }
    }

    function destroy(id: string) {
        const index = views.value.findIndex((v) => v.id === id)

        if (index === -1) return

        views.value.splice(index, 1)
    }

    function clear() {
        watcher()

        views.value = []
    }

    return {
        views,
        load,
        save,
        get,
        set,
        destroy,
        clear,
    }
}

export function useViewStore(collectionId: string) {
    const use = defineStore(`view:${collectionId}`, () => createStore(collectionId))

    return use()
}

/** @deprecated */
export function createViewStore(collectionId: string) {
    return useViewStore(collectionId)
}

/** @deprecated */
export const useStore = defineStore('view', () => {
    const workspace = useWorkspace()
    const hooks = useHooks()

    const loading = new Map<string, boolean>()
    const saving = new Map<string, boolean>()

    async function save(collectionId: string, views: AnyView[]) {
        if (saving.get(collectionId)) {
            await waitFor(() => !saving.get(collectionId))
        }

        saving.set(collectionId, true)

        await useCase('update-views', {
            workspaceId: workspace.currentId!,
            collectionId,
            data: uniqBy(views, 'id'),
        }).finally(() => saving.delete(collectionId))
    }

    async function list(collectionId: string): Promise<AnyView[]> {
        if (saving.get(collectionId)) {
            await waitFor(() => !saving.get(collectionId))
        }

        if (loading.get(collectionId)) {
            await waitFor(() => !loading.get(collectionId))
        }

        loading.set(collectionId, true)

        const views = await useCase('show-views', {
            workspaceId: workspace.currentId!,
            collectionId,
        })
            .then((r) => r.data)
            .catch(() => [])

        loading.delete(collectionId)

        return views
    }

    async function show<T = View>(collectionId: string, viewId: string) {
        const response = await list(collectionId)

        const view = response.find((v) => v.id === viewId)

        return (view as T) || null
    }

    async function update<T = View>(collectionId: string, viewId: string, payload: Partial<T>) {
        const all = await list(collectionId)

        all.forEach((v) => {
            if (v.id === viewId) {
                Object.assign(v, payload)
            }
        })

        await save(collectionId, all)

        hooks.emit('view:updated', {
            collectionId,
            viewId,
            payload: useNonReactive(payload),
        })
    }

    async function create(collectionId: string, payload: View) {
        const all = await list(collectionId)

        all.push(payload)

        await save(collectionId, all)

        hooks.emit('view:created', {
            collectionId,
            payload,
        })
    }

    async function destroy(collectionId: string, viewId: string) {
        const all = await list(collectionId)

        const index = all.findIndex((i) => i.id === viewId)

        if (index === -1) return

        all.splice(index, 1)

        await save(collectionId, all)

        hooks.emit('view:deleted', {
            collectionId,
            viewId,
        })
    }

    return {
        list,
        show,
        create,
        update,
        destroy,
    }
})

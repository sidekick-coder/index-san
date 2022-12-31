import { defineStore } from 'pinia'
import { ref, watch, WatchStopHandle } from 'vue'

import debounce from 'lodash/debounce'
import uniqBy from 'lodash/uniqBy'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import View from '@core/entities/view'
import ViewTable from '@core/entities/view-table'
import ViewGallery from '@core/entities/view-gallery'
import ViewGroup from '@core/entities/view-group'

import { useCase } from '@/composables/use-case'
import ViewCommon from '@/../core/entities/view-common'
import { useHooks } from '@/plugins/hooks'
import { useNonReactive } from '@/composables/utils'

type AnyView = View | ViewTable | ViewGallery

interface StoreView {
    collectionId: string
    viewId: string
    readonly persist: boolean
    view: AnyView
}

interface Watchers {
    collectionId: string
    viewId: string
    stop: WatchStopHandle
}

interface Observer {
    name: string
    handler: () => any
}

interface Options {
    immediate?: boolean
}

export const useStore = defineStore('view', () => {
    const workspace = useWorkspace()
    const hooks = useHooks()

    const views = ref<StoreView[]>([])
    const watchers = ref<Watchers[]>([])

    function instantiate(data: AnyView) {
        if (data.component === 'group') {
            return new ViewGroup(data as any, data.id)
        }

        if (data.component === 'table') {
            return new ViewTable(data as any, data.id)
        }

        if (data.component === 'gallery') {
            return new ViewGallery(data as any, data.id)
        }

        return new View(data as any, data.id)
    }

    async function setViews(collectionId: string, forceUpdate = false) {
        if (!forceUpdate && all(collectionId).length) {
            return
        }

        watchers.value.forEach((w, index) => {
            if (w.collectionId === collectionId) {
                w.stop()

                watchers.value.splice(index, 1)
            }
        })

        const raw: AnyView[] = await useCase('show-views', {
            workspaceId: workspace.currentId!,
            collectionId,
        })
            .then((r) => r.data)
            .catch(() => [])

        raw.map(instantiate).forEach((v) => create(collectionId, v, true))

        return all(collectionId)
    }

    async function list(collectionId: string): Promise<AnyView[]> {
        return useCase('show-views', {
            workspaceId: workspace.currentId!,
            collectionId,
        })
            .then((r) => r.data)
            .catch(() => [])
    }

    async function update<T = View>(collectionId: string, viewId: string, payload: Partial<T>) {
        const all = await list(collectionId)

        all.forEach((v) => {
            if (v.id === viewId) {
                Object.assign(v, payload)
            }
        })

        await useCase('update-views', {
            workspaceId: workspace.currentId!,
            collectionId,
            data: uniqBy(all, 'id'),
        })

        hooks.emit('view:updated', {
            collectionId,
            viewId,
            payload: useNonReactive(payload),
        })
    }

    async function save(collectionId: string) {
        const data = views.value
            .filter((v) => v.collectionId === collectionId)
            .filter((v) => v.persist)
            .map((v) => v.view)

        await useCase('update-views', {
            workspaceId: workspace.currentId!,
            collectionId,
            data: uniqBy(data, 'id'),
        })
    }

    async function create(collectionId: string, payload: View, persist = false) {
        const exists = views.value
            .filter((v) => v.collectionId === collectionId)
            .some((v) => v.viewId === payload.id)

        if (exists) {
            return
        }

        const view: StoreView = {
            collectionId,
            viewId: payload.id,
            persist,
            view: payload,
        }

        views.value.push(view)
    }

    /** @deprecated */
    function getViews(collectionId: string) {
        return views.value.filter((v) => v.collectionId === collectionId).map((v) => v.view)
    }

    /** @deprecated */
    function getView<T = ViewCommon>(collectionId: string, viewId: string) {
        return get<T>(collectionId, viewId)
    }

    function all(collectionId: string) {
        return views.value.filter((v) => v.collectionId === collectionId).map((v) => v.view)
    }

    function get<T = ViewCommon>(collectionId: string, viewId: string) {
        const index = views.value.findIndex(
            (v) => v.collectionId === collectionId && v.viewId === viewId
        )

        if (index === -1) return null

        return views.value[index].view as T
    }

    async function show<T = View>(collectionId: string, viewId: string) {
        const response = await list(collectionId)

        const view = response.find((v) => v.id === viewId)

        return (view as T) || null
    }

    function set<T = ViewCommon>(collectionId: string, viewId: string, payload: T) {
        const index = views.value.findIndex(
            (v) => v.collectionId === collectionId && v.viewId === viewId
        )

        if (index === -1) return

        views.value[index] = {
            ...views.value[index],
            view: Object.assign(views.value[index].view, payload),
        }
    }

    async function destroy(collectionId: string, viewId: string) {
        const index = views.value.findIndex(
            (i) => i.collectionId === collectionId && i.viewId === viewId
        )

        if (index === -1) return

        watchers.value.forEach((w, index) => {
            if (w.collectionId !== collectionId) return

            if (w.viewId !== viewId) return

            w.stop()

            watchers.value.splice(index, 1)
        })

        views.value.splice(index, 1)

        await save(collectionId)
    }

    return {
        views,
        setViews,
        all,
        show,
        get,
        set,
        getViews,
        getView,
        create,
        save,
        update,
        destroy,
    }
})

import { defineStore } from 'pinia'
import { ref, watch, WatchStopHandle } from 'vue'
import debounce from 'lodash/debounce'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import View from '@core/entities/view'
import ViewTable from '@core/entities/view-table'
import ViewGallery from '@core/entities/view-gallery'
import ViewGroup from '@core/entities/view-group'

import { useCase } from '@/composables/use-case'
import ViewCommon from '@/../core/entities/view-common'

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

export const useStore = defineStore('view', () => {
    const workspace = useWorkspace()

    const views = ref<StoreView[]>([])
    const watchers = ref<Watchers[]>([])

    function instantiate(data: View) {
        if (data.component === 'group') {
            return Object.assign(new ViewGroup(), data)
        }

        if (data.component === 'table') {
            return Object.assign(new ViewTable(), data)
        }

        if (data.component === 'gallery') {
            return Object.assign(new ViewGallery(), data)
        }

        return Object.assign(new View(), data)
    }

    async function setViews(collectionId: string, forceUpdate = false) {
        if (!forceUpdate && getViews(collectionId).length) {
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

        return getViews(collectionId)
    }

    async function save(collectionId: string) {
        const data = views.value
            .filter((v) => v.collectionId === collectionId)
            .filter((v) => v.persist)
            .map((v) => v.view)

        await useCase('update-views', {
            workspaceId: workspace.currentId!,
            collectionId,
            data,
        })
    }

    async function create(collectionId: string, payload: View, persist = false) {
        const view: StoreView = {
            collectionId,
            viewId: payload.id,
            persist,
            view: payload,
        }

        views.value.push(view)

        if (persist) {
            const index = views.value.indexOf(view)

            const stop = watch(
                () => views.value[index].view,
                debounce(() => save(collectionId), 500),
                {
                    deep: true,
                }
            )

            watchers.value.push({
                collectionId,
                viewId: view.viewId,
                stop,
            })
        }
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
        get,
        getViews,
        getView,
        create,
        save,
        destroy,
    }
})

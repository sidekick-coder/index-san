import { defineStore } from 'pinia'
import { ref, watch, WatchStopHandle } from 'vue'
import debounce from 'lodash/debounce'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import View from '@core/entities/view'
import ViewTable from '@core/entities/view-table'
import ViewGallery from '@core/entities/view-gallery'
import ViewGroup from '@core/entities/view-group'

import { useCase } from '@/composables/use-case'

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

        raw.map((v) => {
            if (v.component === 'group') {
                return Object.assign(new ViewGroup(), v)
            }

            if (v.component === 'table') {
                return Object.assign(new ViewTable(), v)
            }

            if (v.component === 'gallery') {
                return Object.assign(new ViewGallery(), v)
            }

            return Object.assign(new View(), v)
        }).forEach((v) => create(collectionId, v, true))

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

    function getViews(collectionId: string) {
        return views.value.filter((v) => v.collectionId === collectionId).map((v) => v.view)
    }

    function getView<T = AnyView>(collectionId: string, viewId: string) {
        const views = getViews(collectionId)

        return views.find((v) => v.id === viewId) as T
    }

    return {
        views,
        setViews,
        getViews,
        getView,
        create,
        save,
    }
})

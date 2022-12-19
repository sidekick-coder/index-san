import { defineStore } from 'pinia'
import { ref, watch, WatchStopHandle } from 'vue'
import debounce from 'lodash/debounce'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import ShowViewsDTO from '@core/use-cases/show-views/show-views.dto'

import View from '@core/entities/view'
import ViewTable from '@core/entities/view-table'
import ViewGallery from '@core/entities/view-gallery'
import ViewGroup from '@core/entities/view-group'

import { useCase } from '@/composables/use-case'
import { useNonReactive } from '@/composables/utils'
import UpdateViewsDTO from '@core/use-cases/update-views/update-views.dto'

interface UpdatePayload {
    collectionId: string
    viewId: string
    data: Partial<View>
}

interface Register<T = View> {
    collectionId: string
    loaded: boolean
    viewId: string
    view: T
}

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
    const loaded = new Map<string, View[]>()
    const workspace = useWorkspace()

    const views = ref<StoreView[]>([])
    const watchers = ref<Watchers[]>([])

    const registers = ref<Register[]>([])

    function getRegister<T = AnyView>(collectionId: string, viewId: string) {
        let result = registers.value
            .filter((r) => r.collectionId === collectionId)
            .find((r) => r.viewId === viewId)

        if (result) return result as Register<T>

        result = {
            collectionId,
            loaded: false,
            viewId,
            view: new View({}, viewId),
        }

        registers.value.push(result)

        return result as Register<T>
    }

    async function setRegister(collectionId: string, viewId: string) {
        const data = getRegister(collectionId, viewId)

        if (data.loaded) return

        await show(collectionId, viewId)
            .then((view) => (view ? (data.view = view) : true))
            .finally(() => {
                registers.value = registers.value.slice()
            })

        watch(
            () => data.view,
            debounce(() => saveRegister(collectionId, viewId), 500),
            {
                deep: true,
            }
        )
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
        }).forEach((v) => createView(collectionId, v, true))

        return getViews(collectionId)
    }

    async function saveViews(collectionId: string) {
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

    async function createView(collectionId: string, payload: View, persist = false) {
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
                debounce(() => saveViews(collectionId), 500),
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

    async function saveRegister(collectionId: string, viewId: string) {
        const data = getRegister(collectionId, viewId)

        const old = useNonReactive(data.view)

        await updateOrCreate({ collectionId, viewId, data: data.view }).catch(() => {
            data.view = old
        })
    }

    async function list(payload: Partial<ShowViewsDTO.Input>): Promise<View[]> {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        const { collectionId, workspaceId } = payload

        if (!collectionId || !workspaceId) return []

        return useCase('show-views', { workspaceId, collectionId })
            .then((r) => r.data)
            .catch(() => [])
    }

    async function save(payload: Partial<UpdateViewsDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        const { collectionId, workspaceId } = payload

        if (!collectionId || !workspaceId) return

        const views = loaded.get(collectionId)

        if (!views) return

        await useCase('update-views', {
            workspaceId,
            collectionId,
            data: views,
        })
    }

    async function show(collectionId: string, viewId: string) {
        const views = await list({ collectionId })

        const view = views.find((v) => v.id === viewId)

        return view || null
    }

    async function updateOrCreate({ collectionId, viewId, data }: UpdatePayload) {
        const views = await list({ collectionId })

        const index = views.findIndex((v) => v.id === viewId)
        let view = views.find((v) => v.id === viewId)

        if (!view) {
            view = new View()
        }

        Object.assign(view, data)

        view.id = viewId

        if (index === -1) {
            views.push(view)
        }

        if (index !== -1) {
            views[index] = view
        }

        loaded.set(collectionId, views)

        await save({ collectionId, data: views })
    }

    return {
        loaded,

        getRegister,
        setRegister,
        saveRegister,

        views,
        setViews,
        getViews,
        getView,
        createView,

        list,
        show,
        save,
        updateOrCreate,
    }
})

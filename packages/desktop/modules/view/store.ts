import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import ShowViewsDTO from '@core/use-cases/show-views/show-views.dto'

import { useCase } from '@/composables/use-case'
import { useNonReactive } from '@/composables/utils'
import View from '@/../core/entities/view'
import UpdateViewsDTO from '@/../core/use-cases/update-views/update-views.dto'

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

export const useStore = defineStore('view', () => {
    const loaded = new Map<string, View[]>()
    const workspace = useWorkspace()

    const registers = ref<Register[]>([])

    function getRegister<T = View>(collectionId: string, viewId: string) {
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

        if (!collectionId || !workspaceId) {
            return []
        }

        return useCase('show-views', { workspaceId, collectionId })
            .then((r) => {
                loaded.set(collectionId, r.data)
                return r.data
            })
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

        list,
        show,
        save,
        updateOrCreate,
    }
})

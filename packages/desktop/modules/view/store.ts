import { defineStore } from 'pinia'

import { useStore as useWorkspace } from '@/modules/workspace/store'
import ShowViewsDTO from '@core/use-cases/show-views/show-views.dto'

import { useCase } from '@/composables/use-case'
import { waitFor } from '@/composables/utils'
import View from '@/../core/entities/view'
import UpdateViewsDTO from '@/../core/use-cases/update-views/update-views.dto'

interface UpdatePayload {
    collectionId: string
    viewId: string
    data: Partial<View>
}

export const useStore = defineStore('view', () => {
    const loaded = new Map<string, View[]>()
    const workspace = useWorkspace()

    let loading = false

    async function list(
        payload: Partial<ShowViewsDTO.Input>,
        ignoreLoaded = false
    ): Promise<View[]> {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        const { collectionId, workspaceId } = payload

        if (!collectionId || !workspaceId) {
            return []
        }

        if (loaded.has(collectionId) && !ignoreLoaded) {
            return loaded.get(collectionId) as View[]
        }

        if (loading) {
            await waitFor(() => !loading)
        }

        loading = true

        return useCase('show-views', { workspaceId, collectionId })
            .then((r) => {
                loaded.set(collectionId, r.data)
                return r.data
            })
            .catch(() => [])
            .finally(() => (loading = false))
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

        list,
        show,
        save,
        updateOrCreate,
    }
})

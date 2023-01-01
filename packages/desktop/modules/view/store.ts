import { defineStore } from 'pinia'

import uniqBy from 'lodash/uniqBy'

import { useStore as useWorkspace } from '@/modules/workspace/store'

import View from '@core/entities/view'
import ViewTable from '@core/entities/view-table'
import ViewGallery from '@core/entities/view-gallery'
import ViewGroup from '@core/entities/view-group'

import { useCase } from '@/composables/use-case'
import { useHooks } from '@/plugins/hooks'
import { useNonReactive, waitFor } from '@/composables/utils'

export type AnyView = View | ViewTable | ViewGallery | ViewGroup

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

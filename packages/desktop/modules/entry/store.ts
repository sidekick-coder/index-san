import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useCase } from '@/composables/use-case'
import { useStore as useWorkspace } from '@/modules/workspace/store'

import ListDirectoryEntryDTO from '@core/use-cases/list-directory-entry/list-directory.dto'
import ShowDirectoryEntryDTO from '@core/use-cases/show-directory-entry/show-directory-entry.dto'
import CreateDirectoryEntryDTO from '@core/use-cases/create-directory-entry/create-directory-entry.dto'
import UpdateDirectionEntryDTO from '@core/use-cases/update-directory-entry/update-directory-entry.dto'
import DeleteDirectoryEntryDTO from '@core/use-cases/delete-directory-entry/delete-directory-entry.dto'

import ReadDirectoryEntryDTO from '@core/use-cases/read-directory-entry/read-directory-entry.dto'
import WriteDirectoryEntryDTO from '@core/use-cases/write-directory-entry/write-directory-entry.dto'

export const useStore = defineStore('entry', () => {
    const workspace = useWorkspace()

    const layout = ref({
        toolbar: true,
    })

    function list(payload: Partial<ListDirectoryEntryDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase<ListDirectoryEntryDTO.Output>('list-directory-entry', payload)
    }

    function show(payload: Partial<ShowDirectoryEntryDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase<ShowDirectoryEntryDTO.Output>('show-directory-entry', payload)
    }

    function create(payload: Partial<CreateDirectoryEntryDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase<CreateDirectoryEntryDTO.Output>('create-directory-entry', payload)
    }

    function update(payload: Partial<UpdateDirectionEntryDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase<UpdateDirectionEntryDTO.Output>('update-directory-entry', payload)
    }

    function destroy(payload: Partial<DeleteDirectoryEntryDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase<DeleteDirectoryEntryDTO.Output>('delete-directory-entry', payload)
    }

    function read(payload: Partial<ReadDirectoryEntryDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase<any>('read-directory-entry', payload)
    }

    function write(payload: Partial<WriteDirectoryEntryDTO.Input>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase<void>('write-directory-entry', payload)
    }

    return {
        layout,

        list,
        show,
        create,
        update,
        destroy,
        read,
        write,
    }
})

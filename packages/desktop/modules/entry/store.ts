import { defineStore } from 'pinia'

import { useCase } from '@/composables/use-case'
import { useStore as useWorkspace } from '@/modules/workspace/store'

import ReadDirectoryEntryDTO from '@core/use-cases/read-directory-entry/read-directory-entry.dto'
import WriteDirectoryEntryDTO from '@core/use-cases/write-directory-entry/write-directory-entry.dto'
import ListDirectoryEntryDTO from '@/../core/use-cases/list-directory-entry/list-directory.dto'
import ShowDirectoryEntryDTO from '@/../core/use-cases/show-directory-entry/show-directory-entry.dto'

export const useStore = defineStore('entry', () => {
    const workspace = useWorkspace()

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
        list,
        show,

        read,
        write,
    }
})

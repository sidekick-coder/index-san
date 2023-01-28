import { defineStore } from 'pinia'

import { useCase } from '@composables/use-case'
import { useStore as useWorkspace } from '@modules/workspace/store'

import type ListDirectoryEntryDTO from '@core/use-cases/list-directory-entry/list-directory.dto'
import type ShowDirectoryEntryDTO from '@core/use-cases/show-directory-entry/show-directory-entry.dto'
import type CreateDirectoryEntryDTO from '@core/use-cases/create-directory-entry/create-directory-entry.dto'
import type UpdateDirectionEntryDTO from '@core/use-cases/update-directory-entry/update-directory-entry.dto'
import type DeleteDirectoryEntryDTO from '@core/use-cases/delete-directory-entry/delete-directory-entry.dto'

import type ReadDirectoryEntryDTO from '@core/use-cases/read-directory-entry/read-directory-entry.dto'
import type WriteDirectoryEntryDTO from '@core/use-cases/write-directory-entry/write-directory-entry.dto'

export const useStore = defineStore('entry', () => {
    const workspace = useWorkspace()

    function list(payload: Partial<ListDirectoryEntryDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('list-directory-entry', payload as any)
    }

    function show(payload: Partial<ShowDirectoryEntryDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('show-directory-entry', payload as any)
    }

    function create(payload: Partial<CreateDirectoryEntryDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('create-directory-entry', payload as any)
    }

    function update(payload: Partial<UpdateDirectionEntryDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('update-directory-entry', payload as any)
    }

    function copy(source: string, target: string) {
        return useCase('copy-directory-entry', {
            workspaceId: workspace.currentId!,
            sourcePath: source,
            targetPath: target,
        })
    }

    function move(source: string, target: string) {
        return useCase('move-directory-entry', {
            workspaceId: workspace.currentId!,
            sourcePath: source,
            targetPath: target,
        })
    }

    function read(payload: Partial<ReadDirectoryEntryDTO>, silent?: boolean) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('read-directory-entry', payload as any, silent)
    }

    function write(payload: Partial<WriteDirectoryEntryDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('write-directory-entry', payload as any)
    }

    function destroy(payload: Partial<DeleteDirectoryEntryDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return useCase('delete-directory-entry', payload as any)
    }

    return {
        list,
        show,
        create,
        update,
        copy,
        move,
        read,
        write,
        destroy,
    }
})

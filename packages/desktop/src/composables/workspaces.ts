import Workspace from '@core/entities/workspace'
import { useState } from './state'
import { DataResponse, useCase } from './use-case'

interface WorkspaceOptions {
    menu: {
        items: any[]
    }
}

export function useWorkspaceOption(workspaceId: string){
    return useState<WorkspaceOptions>(`workspaces:${workspaceId}:options`, {
        menu: { items: [] }
    })
}

export async function useWorkspaceOptionAsync(workspaceId: string){
    const options = useWorkspaceOption(workspaceId)

    options.value = await useCase<DataResponse<any>>('show-workspace-options', {
        workspaceId
    }).then(r => r.data)

    return options
}

export function useWorkspaces(){
    return useState<Workspace[]>('workspaces', [])
}

export async function useWorkspacesAsync(){
    const workspaces = useWorkspaces()

    workspaces.value = await useCase<DataResponse<Workspace[]>>('list-workspaces')
        .then(({ data }) => data)
        .catch(() => [])

    return workspaces
}

export async function saveWorkspaceOption(workspaceId: string, data: WorkspaceOptions){
    const options = useWorkspaceOption(workspaceId)

    await useCase('update-workspace-options', { workspaceId, data })

    options.value = Object.assign(options.value, data)
}

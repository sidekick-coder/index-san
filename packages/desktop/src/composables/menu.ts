import { computed } from 'vue'
import sortBy from 'lodash/sortBy'

import Workspace from '@core/entities/workspace'

import { useState } from './state'
import { saveWorkspaceOption, useWorkspaceOptionAsync, useWorkspaces, useWorkspacesAsync } from './workspaces'

export interface MenuItem {
    id: string
    order: number
    label: string
    section?: string
    to: string
    icon?: string
}

export interface MenuItemWithWorkspace extends MenuItem {
    workspace: Workspace
}

export function useWorkspaceMenu(workspaceId: string){
    return useState<MenuItem[]>(`workspaces:${workspaceId}:menu`, [])
}

export async function useWorkspaceMenuAsync(workspaceId: string){
    const menu = useWorkspaceMenu(workspaceId)

    const options = await useWorkspaceOptionAsync(workspaceId)

    if (options.value) {
        menu.value = options.value.menu.items
    }


    return menu
}

export function useAllMenu(){
    const workspaces = useWorkspaces()

    return computed(() => {
        const result: MenuItemWithWorkspace[] = []

        workspaces.value.forEach(w => {
            const menu = useWorkspaceMenu(w.id) 

            menu.value.forEach(m => result.push({ ...m, workspace: w }))        
        })

        return sortBy(result, 'order') as MenuItemWithWorkspace[]
    })
}

export async function useAllMenuAsync(){
    const workspaces = await useWorkspacesAsync()

    for await (const workspace of workspaces.value) {        
        await useWorkspaceMenuAsync(workspace.id)
    }

    return useAllMenu()
}

export async function saveWorkspaceMenu(workspaceId: string, payload: MenuItem[] | MenuItemWithWorkspace[]){    
    const items: MenuItem[] = payload.map(i => ({
        id: i.id,
        order: i.order,
        section: i.section,
        to: i.to,
        label: i.label,
        icon: i.icon,
    }))

    await saveWorkspaceOption(workspaceId, {
        menu: {
            items
        }
    })

    return useWorkspaceMenuAsync(workspaceId)
}
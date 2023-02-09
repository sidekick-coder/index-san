import { defineStore } from 'pinia'

import { useCase } from '@composables/use-case'
import { useStore as useWorkspace } from '@modules/workspace/store'

import type ExecuteScriptDTO from '@core/use-cases/execute-script/execute-script.dto'

export const useStore = defineStore('script', () => {
    const workspace = useWorkspace()

    async function execute(payload: Partial<ExecuteScriptDTO>) {
        if (!payload.workspaceId && workspace.currentId) {
            payload.workspaceId = workspace.currentId
        }

        return await useCase('execute-script', payload as any).catch((err) => ({
            logs: [],
            error: err.message ?? 'Error executing script',
            result: null,
        }))
    }

    return {
        execute,
    }
})

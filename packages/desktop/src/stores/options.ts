import { defineStore } from 'pinia'
import { useCase, DataResponse } from '@/composables/use-case'
import { useWorkspace } from './workspaces'

interface Option {
    workspaceId: string
    value: Record<string, any>
}

export const useOptionStore = defineStore('workspace-options', {
    state: () => ({
        options: [] as Option[]
    }),
    actions: {
        async load(){
            const workspace = useWorkspace()

            this.options = []

            if (!workspace.all.length) await workspace.setAll()

            for await (const w of workspace.all) {
                const { data } = await useCase<DataResponse<any>>('show-workspace-options', {
                    workspaceId: w.id
                })

                this.options.push({ 
                    workspaceId: w.id,
                    value: data
                })
            }
            
        },

    }
})
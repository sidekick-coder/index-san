import { defineStore } from 'pinia'
import { useCase } from '../composables/use-case'
export interface Workspace {
    id: string
    name: string
    path: string
    drive: string
}

interface ListResponse {
    data: Workspace[]
}

export const useWorkspace = defineStore('workspace', {
    state: () => ({
        all: [] as Workspace[]
    }),

    actions: {
        async setAll(){
            return useCase<ListResponse>('list-workspaces')
                .then(({ data }) => this.all = data)
                .catch(() => (this.all = []))
        },
        async create(data: Partial<Workspace>){
            return useCase('create-workspace', data)
        },
        async delete(id: string){
            await useCase('delete-workspace', { id })
        },

    }
})
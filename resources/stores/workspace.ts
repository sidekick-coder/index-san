import { useWindowApi } from '@/composables/api'
import { defineStore } from 'pinia'

export interface Workspace {
  name: string
  path: string
}
export interface Item {
  name: string
  path: string
  index: string | null
  workspace: Workspace
}

const api = useWindowApi()

export const useWorkspaceStore = defineStore('workspace', {
  state: () => {
    return {
      workspaces: [] as Workspace[],
    }
  },
  actions: {
    async setWorkspaces() {
      const data = await api.invoke('workspace:index')

      this.workspaces = data
    },
  },
})

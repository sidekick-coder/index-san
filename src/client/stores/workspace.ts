import { defineStore } from 'pinia'

import { useWindowApi } from '@/composables/api'
import { Workspace } from '@/types'

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

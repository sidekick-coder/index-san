import { defineStore } from 'pinia'

import { useCase } from '@/composables/use-case'
import { Workspace } from '@/types'

export const useWorkspaceStore = defineStore('workspace', {
  state: () => {
    return {
      workspaces: [] as Workspace[],
    }
  },
  actions: {
    async setWorkspaces() {
      const data = await useCase('list-workspaces')

      this.workspaces = data
    },
  },
})

import { defineStore } from 'pinia'

export interface Workspace {
  path: string
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => {
    return {
      current: null as Workspace | null,
    }
  },
  actions: {
    setCurrent(payload: Workspace) {
      this.current = payload
    },
  },
})

import { defineStore } from 'pinia'

export interface Workspace {
  name: string
  path: string
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => {
    return {
      current: localStorage.getItem('workspace:last'),
    }
  },
  actions: {
    setCurrent(payload: string) {
      this.current = payload
      localStorage.setItem('workspace:last', payload)
    },
  },
})

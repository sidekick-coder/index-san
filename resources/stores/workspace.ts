import { defineStore } from 'pinia'

export interface Workspace {
  path: string
}

function lastWorkspace() {
  const last = localStorage.getItem('workspace:last')

  return last ? JSON.parse(last) : null
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => {
    return {
      current: lastWorkspace() as Workspace | null,
    }
  },
  actions: {
    setCurrent(payload: Workspace) {
      this.current = payload
      localStorage.setItem('workspace:last', JSON.stringify(payload))
    },
  },
})

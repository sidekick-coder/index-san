import { useWindowApi } from '@/composables/api'
import { defineStore } from 'pinia'

export interface Item {
  name: string
  path: string
  isFolder: boolean
  index?: string
}

const api = useWindowApi()

export const useWorkspaceStore = defineStore('workspace', {
  state: () => {
    return {
      current: localStorage.getItem('item:last'),
      workspaces: [] as Item[],
    }
  },
  actions: {
    setCurrent(payload: string | null) {
      this.current = payload

      if (payload) {
        return localStorage.setItem('item:last', payload)
      }

      return localStorage.removeItem('item:last')
    },
    async setWorkspaces() {
      const data = await api.invoke('workspace:index')

      this.workspaces = data
    },
  },
})

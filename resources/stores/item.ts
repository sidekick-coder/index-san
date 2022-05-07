import { defineStore } from 'pinia'

export interface item {
  path: string
}

export const useItemStore = defineStore('item', {
  state: () => {
    return { 
        current: null as item | null,
     }
  },
  actions: {
    setCurrent(payload: item) {
      this.current = payload
    }
  }
})
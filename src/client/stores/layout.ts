import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      left: true,
      right: false,
    }
  },
  actions: {
    toggleLeft() {
      this.left = !this.left
    },
    toggleRight() {
      this.right = !this.right
    },
  },
})

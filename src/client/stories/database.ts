import { defineStore } from 'pinia'

import { useCase } from '@/composables/use-case'
import { DatabaseTable } from '@/types'

export const useDatabaseStore = defineStore('database', {
  state: () => {
    return {
      tables: [] as DatabaseTable[],
    }
  },
  actions: {
    async load() {
      const data = await useCase('list-database-tables')

      this.tables = data
    },
  },
})

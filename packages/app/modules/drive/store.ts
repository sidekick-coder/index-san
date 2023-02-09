import { useCase } from '@composables/use-case'
import { defineStore } from 'pinia'

import DriveInfo from '@core/entities/drive-info'

export const useStore = defineStore('drive', () => {
    const drives = ref<DriveInfo[]>([])

    async function setDrives() {
        await useCase('list-drives')
            .then((r) => (drives.value = r.data))
            .catch(() => (drives.value = []))
    }

    setDrives()

    return {
        drives,
    }
})

import type { DriveEntry } from "@/composables/useDrive";
import { defineStore } from "pinia";
import orderBy from 'lodash/orderBy'

export const useDirectoryStore = defineStore('directory', () => {
    const { drive } = useDrive()

    const entries = ref<DriveEntry[]>([])
    const loading = ref(false)

    async function load(){
        loading.value = true

        const all = await drive.findAll()

        entries.value = orderBy(all, 'path')

        loading.value = false
    }

    function findChildEntries(path: string){
        if (path === '/') {
            return entries.value.filter(e => !e.path.includes('/'))
        }

        return entries.value.filter(e => {
            if (e.path === path) return false

            if (!e.path.startsWith(path)) return false

            console.log(e.path, path)

            const relative = e.path.slice(path.length)

            return relative.split('/').length === 2
        })
    }

    function findEntryIcon(entry: DriveEntry){
        if (entry.type === 'directory') {
            return 'mdi:folder'
        }
    
        if (entry.path.endsWith('.md')) {
            return 'mdi:markdown'
        }
    
        if (entry.path.endsWith('.ts')) {
            return 'mdi:language-typescript'
        }
    
        return 'mdi:file'
    }
    
    function findEntryIconColor(entry: DriveEntry){
        if (entry.type === 'directory') {
            return 'text-primary-500'
        }
    
        if (entry.path.endsWith('.ts')) {
            return 'text-blue-500'
        }
    
        return 'text-gray-500'
    }

    watch(drive, load, { immediate: true })


    return {
        loading,
        entries,

        load,
        findChildEntries,

        findEntryIcon,
        findEntryIconColor,

    }
})
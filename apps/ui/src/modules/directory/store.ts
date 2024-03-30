import type { DriveEntry } from "@/composables/useDrive";
import { defineStore } from "pinia";
import orderBy from 'lodash/orderBy'

export const useDirectoryStore = defineStore('directory', () => {
    const { drive, isLoaded } = useDrive()

    const entries = ref<DriveEntry[]>([])
    const loading = ref(false)

    const options = ref({
        exclude: ['.is', '.chrono']
    })

    async function load(){
        if (!isLoaded.value) {
            entries.value = []
            return
        }

        loading.value = true

        const all = await drive.value.findAll()

        entries.value = orderBy(all, 'path')

        loading.value = false
    }

    function findChildEntries(path: string){
        if (path === '/') {
            return entries.value.filter(e => {
                if (options.value.exclude.some(ex => e.path.startsWith(ex))) {
                    return false
                }

                return !e.path.includes('/')
            })
        }

        return entries.value.filter(e => {
            if (e.path === path) {
                return false
            }

            if (!e.path.startsWith(path)) {
                return false
            }

            if (options.value.exclude.some(ex => e.path.startsWith(ex))){
                return false
            }

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

    watch(isLoaded, load, { immediate: true })


    return {
        loading,
        entries,

        load,
        findChildEntries,

        findEntryIcon,
        findEntryIconColor,

    }
})
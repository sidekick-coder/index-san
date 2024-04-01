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

    function findEntry(path: string){
        return entries.value.find(e => e.path === path)
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

    function convertPathToEntries(paths: string[]) {
        const entries = [] as DriveEntry[];
        
        paths.forEach(f => {
            const entry = findEntry(f);
    
            if (entry) {
                entries.push(entry);
            }
        })
    
        return entries;
    }

    return {
        loading,
        entries,

        findEntry,
        findChildEntries,

        findEntryIcon,
        findEntryIconColor,
        convertPathToEntries,
    }
})
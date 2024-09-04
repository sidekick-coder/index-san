import type { DriveEntry } from "@/composables/useDrive"

export function findEntryIconColor(entry: DriveEntry){
    if (entry.type === 'directory') {
        return 'text-primary-300'
    }

    if (entry.path.endsWith('.ts')) {
        return 'text-blue-500'
    }

    return 'text-gray-500'
}

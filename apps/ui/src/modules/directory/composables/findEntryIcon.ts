import type { DriveEntry } from "@/composables/useDrive"

export function findEntryIcon(entry: DriveEntry) {
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
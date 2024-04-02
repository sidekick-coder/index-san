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

    if(['.jpg', '.png', '.jpeg', '.webp', '.gif'].some(ext => entry.name.endsWith(ext))) {
        return 'mdi:image'
    }

    if (['.mp4', '.webm', '.mov', '.avi', '.mkv'].some(ext => entry.name.endsWith(ext))) {
        return 'mdi:video'
    }

    return 'mdi:file'
}
import type { DriveEntry } from "@/composables/useDrive"

export function convertPathsToDriveEntries(paths: string[]): DriveEntry[] {
    const { basename } = useDrive()

    const entries = [] as DriveEntry[]

    for (const path of paths) {
        entries.push({
            name: basename(path),
            path: path,
            type: 'file'
        })
    }

    return entries
}
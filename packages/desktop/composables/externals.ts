import { open } from '@tauri-apps/api/shell'

export function openURL(url: string) {
    return open(url)
}

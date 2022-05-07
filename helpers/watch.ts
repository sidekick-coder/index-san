import { debounce } from "lodash";
import { watch as fsWatch } from 'fs'

interface Callback {
    (filename: string): void | Promise<void>
}

export function watch(source: string | string[], callback: Callback) {
    const files = Array.isArray(source) ? source : [source];

    const reload = debounce((_:string, filename: string | null) => {
        if (!filename) return;

        callback(filename);
    }, 500)

    files.forEach(file => fsWatch(file, { recursive: true }, reload))
}
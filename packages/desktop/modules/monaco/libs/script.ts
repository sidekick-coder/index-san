import { lib as core } from './core'

export function mount() {
    const uri = 'ts:runtime/script.d.ts'

    const libs = core.mount()

    const source = `
        declare const workspace: import("core/services/workspace-service").default

        declare function setResult(data: any): void
    `

    libs.push({ uri, source })

    return libs
}

export const lib = {
    mount,
}

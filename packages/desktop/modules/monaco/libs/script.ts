import { lib as core } from './core'

export function mount() {
    const uri = 'ts:runtime/script.d.ts'

    const libs = core.mount()

    const source = `
        declare const Workspace: import("core/entities/workspace").default

        declare const Entry: typeof import("core/entities/directory-entry").default

        declare const Drive: import("core/gateways/drive/drive").default
        
        declare const Facades: import("core/config/app").default['facades']

        declare const Moment: any

        declare function setResult(data: any): void
    `

    libs.push({ uri, source })

    return libs
}

export const lib = {
    mount,
}

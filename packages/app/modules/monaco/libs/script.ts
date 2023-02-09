import { lib as core } from './core'

import momentTypes from 'moment/moment.d.ts?raw'

export function mount() {
    const uri = 'ts:runtime/script.d.ts'

    const libs = core.mount()

    libs.push({
        uri: 'ts:moment.d.ts',
        source: `
            declare module 'moment' { ${momentTypes} }
        `,
    })

    const source = `
        declare const Workspace: import("core/entities/workspace").default

        declare const DirectoryEntry: typeof import("core/entities/directory-entry").default

        declare const Drive: import("core/gateways/drive/drive").default

        declare const Evaluation: import("core/facades/script").default

        declare const Facades: import("core/config/app").default['facades']
        
        declare const Moment: typeof import("moment")

        declare const scope: Record<string, any>

        declare function createItemRepository(name: string): Promise<import("core/repositories/item/item-repository").default>

        declare function setResult(data: any): void
    `

    libs.push({ uri, source })

    return libs
}

export const lib = {
    mount,
}

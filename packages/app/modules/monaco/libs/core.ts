import { MonacoLibs } from '../services/monaco'

const files = import.meta.glob('@core/dist-types/**/*.d.ts', {
    as: 'raw',
    eager: true,
})

export function mount() {
    const libs: MonacoLibs[] = []

    Object.entries(files).forEach(([filename, content]) => {
        const name = filename.replace('../core/dist-types/', 'core/')

        let source = `
            declare module '${name.replace('.d.ts', '')}' {
                ${content}
            }
        `

        source = source
            .replaceAll('./app-service', 'core/services/app-service')
            .replaceAll('../entities', 'core/entities')
            .replaceAll('../facades', 'core/facades')
            .replaceAll('../services', 'core/services')
            .replaceAll('../gateways', 'core/gateways')
            .replaceAll('../repositories', 'core/repositories')
            .replaceAll('./collection-service', 'core/services/collection-service')
            .replaceAll('./array-service', 'core/services/array-service')
            .replaceAll('./workspace-service', 'core/services/workspace-service')
            .replaceAll('./script-service', 'core/services/script-service')

        libs.push({
            uri: `ts:${name}`,
            source,
        })
    })

    return libs
}

export const lib = {
    mount,
}

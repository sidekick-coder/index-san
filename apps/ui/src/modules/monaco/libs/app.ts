import { lib as core } from './core'

export function mount() {
    const libs = core.mount()

    libs.push({
        uri: 'ts:runtime/app-chart.d.ts',
        source: `
            declare module 'app:chart' {
                export function useChart(): any
            }
        `,
    })

    libs.push({
        uri: 'ts:runtime/app-collection.d.ts',
        source: `
            declare module 'app:collection' {
                export function useCollection(name: string): any
            }
        `,
    })

    libs.push({
        uri: 'ts:runtime/app-npm.d.ts',
        source: `
            declare module 'npm:*' {
                const value: any
                export default value
            }
        `,
    })

    return libs
}

export const lib = {
    mount,
}

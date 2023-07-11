import DirectoryEntry from '@index-san/core/entities/directory-entry'
import { useStore } from '@modules/entry/store'
import { defineResolver } from '@modules/evaluation/helpers/define-resolver'
import { useItemStore } from '@modules/item/store'

export const resolvers = [
    defineResolver({
        test: (id) => id === 'app:drive',
        resolve: async () => {
            return {
                useDrive: () => useStore(),
                decode: DirectoryEntry.decode,
                encode: DirectoryEntry.encode,
            }
        },
    }),
    defineResolver({
        test: (id) => id === 'app:collection',
        resolve: async () => {
            return {
                useCollection: (id: string) => useItemStore(id),
            }
        },
    }),
    defineResolver({
        test: (id) => id.startsWith('npm:'),
        resolve: async (id) => {
            const name = id.replace('npm:', '')

            const url = `https://unpkg.com/${name}?module`

            return import(/* @vite-ignore */ url)
        },
    }),
]

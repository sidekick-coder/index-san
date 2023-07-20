import DirectoryEntry from '@index-san/core/entities/directory-entry'
import { useStore } from '@modules/entry/store'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'
import { defineResolver } from '@modules/evaluation/helpers/define-resolver'
import { useItemStore } from '@modules/item/store'


export const resolvers = [
    defineResolver({
        test: (id) => id === 'app:drive',
        resolve: async () => {
            const drive = useStore()

            return {
                useDrive: () => drive,
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
    defineResolver({
        test: (id) => id.startsWith('/'),
        resolve: async (id) => {
            const drive = useStore()
            
            const bytes = await drive.read({
                path: id,
            })

            if (!bytes) {
                throw new Error(`Module not found: ${id}`)
            }

            const content = DirectoryEntry.decode(bytes)

            const evaluation = useEvaluation()

            evaluation.setResolvers(resolvers)

            const { exports } = await evaluation.run(content)

            return exports
        },
    }),
]

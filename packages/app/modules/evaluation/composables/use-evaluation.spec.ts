import { afterEach, describe, expect, it } from 'vitest'
import { useEvaluation } from './use-evaluation'

describe('useEvaluation', () => {
    const composable = useEvaluation()

    afterEach(() => {
        composable.setResolvers([])
    })

    it('should use resolver to handle imports', async () => {
        const lodash = { camelCase: () => '' }

        composable.addResolver({
            test: (id) => id === 'lodash',
            resolve: () => Promise.resolve(lodash),
        })

        const result = await composable.mount(`import { camelCase } from 'lodash'`)

        expect(result.imports.lodash).toEqual(lodash)
    })

    it('should handle multiple resolvers and imports', async () => {
        const lodash = { camelCase: () => '' }
        const vue = { ref: () => '' }

        composable.addResolver({
            test: (id) => id === 'lodash',
            resolve: () => Promise.resolve(lodash),
        })

        composable.addResolver({
            test: (id) => id === 'vue',
            resolve: () => Promise.resolve(vue),
        })

        const result = await composable.mount(`
            import { camelCase } from 'lodash'
            import { ref } from 'vue'
        `)

        expect(result.imports.lodash).toEqual(lodash)
        expect(result.imports.vue).toEqual(vue)
    })

    it('should run code and return results', async () => {
        const lodash = { uppercase: (v: string) => v.toUpperCase() }
        const vue = { ref: (v: string) => `ref(${v})` }

        composable.addResolver({
            test: (id) => id === 'lodash',
            resolve: () => Promise.resolve(lodash),
        })

        composable.addResolver({
            test: (id) => id === 'vue',
            resolve: () => Promise.resolve(vue),
        })

        const result = await composable.run(`
            import { uppercase } from 'lodash'
            import { ref } from 'vue'

            const foo = uppercase('foo')
            const bar = ref('bar')
            
            export default { foo, bar }
        `)

        expect(result.default).toBeDefined()

        expect(result.default.foo).toBe('FOO')
        expect(result.default.bar).toBe('ref(bar)')
    })
})

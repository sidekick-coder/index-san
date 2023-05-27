import { afterEach, describe, expect, it } from 'vitest'
import { useEvaluation } from './use-evaluation'

describe('useEvaluation', () => {
    const composable = useEvaluation()

    afterEach(() => {
        composable.setResolvers([])
    })

    it.each([
        ['import lodash from "lodash"', `const lodash = ${composable.importIdentifier}("lodash");`],
        [
            'import { camelCase } from "lodash"',
            `const { camelCase } = ${composable.importIdentifier}("lodash");`,
        ],
        [
            'import {\n ref\ncomputed\n } from "vue"',
            `const {\n ref\ncomputed\n } = ${composable.importIdentifier}("vue");`,
        ],
    ])('should replace imports to handle imports', async (code, expected) => {
        const result = composable.mount(code)

        expect(result).toBe(expected)
    })

    it('should use resolver to handle imports', async () => {
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

        const result = await composable.mountImports(`
            import { camelCase } from 'lodash'
            import { ref } from 'vue'
        `)

        expect(result.lodash).toEqual(lodash)
        expect(result.vue).toEqual(vue)
    })

    it('should run code and return exported results', async () => {
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

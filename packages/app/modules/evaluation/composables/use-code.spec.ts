import { afterEach, describe, expect, it } from 'vitest'
import { useCode } from './use-code'

describe('useCode', () => {
    const composable = useCode()

    afterEach(() => {
        composable.setResolvers([])
    })

    it.each([
        [`import { ref } from "vue"`, `const { ref } = __INDEX_SAN_IMPORT("vue")`],
        [`import { ref } from 'vue'`, `const { ref } = __INDEX_SAN_IMPORT("vue")`],
        [`import lodash from "lodash"`, `const lodash = __INDEX_SAN_IMPORT("lodash")`],
        [`import lodash from 'lodash'`, `const lodash = __INDEX_SAN_IMPORT("lodash")`],
        [
            `
            import {
                camelCase,
                snakeCase
            } from 'lodash'
        `,
            `
            const {
                camelCase,
                snakeCase
            } = __INDEX_SAN_IMPORT("lodash")
        `,
        ],
    ])('should replace imports (%#)', async (source, expected) => {
        const result = await composable.mount(source)

        expect(result.code).toBe(expected)
    })

    it.each([
        [`export default { foo: 'bar' }`, `__INDEX_SAN_EXPORT({ default: { foo: 'bar' } })`],
        [
            `export default function (){ return {foo: 'bar'} }`,
            `__INDEX_SAN_EXPORT({ default: function (){ return {foo: 'bar'} } })`,
        ],
        [`export const foo = 'bar'`, `__INDEX_SAN_EXPORT({ foo: 'bar' })`],
    ])('should replace exports (%#)', async (source, expected) => {
        const result = await composable.mount(source)

        expect(result.code).toBe(expected)
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

import { describe, expect, it } from 'vitest'
import { defineExportProcessor } from './exports'

describe('useCode', () => {
    const items = [
        [`export default { foo: 'bar' }`, `__CUSTOM_EXPORT_HANDLE({ default: { foo: 'bar' } })`],
        [
            `export default function (){ return {foo: 'bar'} }`,
            `__CUSTOM_EXPORT_HANDLE({ default: function (){ return {foo: 'bar'} } })`,
        ],
        [`export const foo = 'bar'`, `__CUSTOM_EXPORT_HANDLE({ foo: 'bar' })`],
        [
            `
            export default {
                foo: 'bar',
                baz: 'qux'
            }
            `,
            `
            __CUSTOM_EXPORT_HANDLE({
                default: {
                    foo: 'bar',
                    baz: 'qux'
                }
            })
            `,
        ],
    ]

    it.each(items)('should replace %s with %s', async (source, expected) => {
        const processor = defineExportProcessor((key, value) => {
            return `__CUSTOM_EXPORT_HANDLE({ ${key}: ${value} })`
        })

        const result = processor(source)

        const resultWithoutSpaces = result.replace(/\s/g, '')
        const expectedWithoutSpaces = expected.replace(/\s/g, '')

        expect(resultWithoutSpaces).toBe(expectedWithoutSpaces)
    })
})

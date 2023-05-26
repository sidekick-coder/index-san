import { describe, expect, it } from 'vitest'
import { defineExportProcessor } from './exports'

describe('useCode', () => {
    function mount(key: string, value: string) {
        return `__CUSTOM_EXPORT_HANDLE({${key}:${value}});`
    }

    const items = [
        [`export default { foo: 'bar' }`, mount('default', `{ foo: 'bar' }`)],
        [
            `export default function (){ return {foo: 'bar'} }`,
            mount('default', `function (){ return {foo: 'bar'} }`),
        ],
        [`export const foo = 'bar'`, mount('foo', `'bar'`)],
        [`export const foo = ref("Hello word")`, mount('foo', `ref("Hello word")`)],
        [`export function foo(){}`, mount('foo', `function () {}`)],
        [`export function foo(arg1,arg2){}`, mount('foo', `function (arg1,arg2) {}`)],
        [
            `export default {\nfoo: 'bar',\nbaz: 'qux'\n}`,
            mount('default', `{\nfoo: 'bar',\nbaz: 'qux'\n}`),
        ],
        [
            `
                export const foo = 'bar';
                export const baz = 'qux';
            `,
            `
                ${mount('foo', `'bar'`)}
                ${mount('baz', `'qux'`)}
            `,
        ],
    ]

    it.each(items)('should replace %s with %s', async (source, expected) => {
        const processor = defineExportProcessor(mount)

        const result = processor(source)

        expect(result).toBe(expected)
    })
})

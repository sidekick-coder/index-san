import { afterEach, describe, expect, it } from 'vitest'
import { defineFunctionProcessor } from './functions'

describe('defineFunctionProcessor', () => {
    const items = [
        [`function test() {}`, `function prefix_fn_test() {}`],
        [`function test(arg1,arg2) {}`, `function prefix_fn_test(arg1,arg2) {}`],
        [`const test = () => {}`, `const test = () => {}`],
        [
            `
            function test() {
                const inner_test = 123
                console.log('test')
            }
            `,
            `
            function prefix_fn_test() {
                const inner_test = 123
                console.log('test')
            }
            `,
        ],
        [
            `
            function one() {}
            function two() {}
            `,
            `
            function prefix_fn_one() {}
            function prefix_fn_two() {}
            `,
        ],
    ]

    it.each(items)('should replace %s with %s', async (source, expected) => {
        const processor = defineFunctionProcessor((name, params, body) => {
            return `function prefix_fn_${name}(${params}) {${body}}`
        })

        const result = processor(source)

        expect(result).toBe(expected)
    })

    // it('should not replace function declaration inside object', async () => {})
})

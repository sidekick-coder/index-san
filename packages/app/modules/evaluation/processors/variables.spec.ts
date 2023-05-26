import { describe, expect, it } from 'vitest'
import { defineVariableProcessor } from './variables'

describe('defineVariableProcessor', () => {
    const items = [
        [`const test = 123`, `const prefix_test = 123`],
        [`const test = ref("Hello word")`, `const prefix_test = ref("Hello word")`],
        [`const test = () => {}`, `const prefix_test = () => {}`],
        [
            `
            const test = () => {
                const inner_test = 123
                console.log('test')
            }
            `,
            `
            const prefix_test = () => {
                const inner_test = 123
                console.log('test')
            }
            `,
        ],
    ]

    it.each(items)('should replace %s with %s', async (source, expected) => {
        const processor = defineVariableProcessor((name, statements) => {
            return `const prefix_${name} = ${statements}`
        })

        const result = processor(source)

        expect(expected).toBe(result)
    })

    // it('should not replace function declaration inside object', async () => {})
})

import { afterEach, describe, expect, it } from 'vitest'
import { defineImportProcessor } from './imports'

describe('defineImportProcessor', () => {
    const items = [
        [`import { ref } from "vue"`, `const { ref } = __CUSTOM_HANDLE_IMPORT("vue")`],
        [`import { ref } from 'vue'`, `const { ref } = __CUSTOM_HANDLE_IMPORT("vue")`],
        [`import lodash from "lodash"`, `const lodash = __CUSTOM_HANDLE_IMPORT("lodash")`],
        [`import lodash from 'lodash'`, `const lodash = __CUSTOM_HANDLE_IMPORT("lodash")`],
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
            } = __CUSTOM_HANDLE_IMPORT("lodash")
        `,
        ],
    ]

    it.each(items)('should replace %s with %s', async (source, expected) => {
        const processor = defineImportProcessor((statements, moduleId) => {
            return `const ${statements} = __CUSTOM_HANDLE_IMPORT("${moduleId}")`
        })

        const result = processor(source)

        expect(result).toBe(expected)
    })
})

import { describe, it, expect } from 'vitest'

import { createParser } from './parser'
import { NodeImport, NodeType } from '../types/node'

describe('Parser', () => {
    const parser = createParser()

    it.each([
        ["import lodash from 'lodash'", 'lodash', 'lodash'],
        [`import lodash from "lodash"`, 'lodash', 'lodash'],
        ['import lodash from `lodash`', 'lodash', 'lodash'],
        ['import { ref } from "vue"', 'vue', '{ ref }'],
        ['import { ref, computed } from "vue"', 'vue', '{ ref, computed }'],
    ])('should convert %o to import node', (code, moduleId, statements) => {
        const result = parser.toNodes(code)

        const node = result[0] as NodeImport

        expect(result.length).toBe(1)

        expect(node.moduleId).toEqual(moduleId)
        expect(node.statements).toBe(statements)
        expect(node.start).toEqual(0)
        expect(node.end).toEqual(code.length)
        expect(node.type).toEqual(NodeType.Import)
        expect(node.tokens).toEqual(parser.toTokens(code))
    })
})

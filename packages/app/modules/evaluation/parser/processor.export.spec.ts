import { describe, it, expect } from 'vitest'

import { createParser } from './parser'
import { NodeExport, NodeImport, NodeType } from '../types/node'

describe('Processor import', () => {
    const parser = createParser()

    it.each([
        ["export default { foo: 'bar' }", 'default', "{ foo: 'bar' }"],
        ['export function hello(){ }', 'hello', 'function hello(){ }'],
        [
            'export function helloWithArg(arg1,arg2){ }',
            'helloWithArg',
            'function helloWithArg(arg1,arg2){ }',
        ],
        ['export const message = "hello word"', 'message', '"hello word"'],
        ['export const message_snake = "hello word"', 'message_snake', '"hello word"'],
        ['export const count = 123', 'count', '123'],
        ['export const messageObject = { foo: "bar" }', 'messageObject', '{ foo: "bar" }'],
    ])('should convert %o to export node', (code, key, statements) => {
        const result = parser.toNodes(code)

        const node = result[0] as NodeExport

        expect(result.length).toBe(1)

        expect(node.key).toEqual(key)
        expect(node.statements).toBe(statements)
        expect(node.start).toEqual(0)
        expect(node.end).toEqual(code.length)
        expect(node.type).toEqual(NodeType.Export)
        expect(node.tokens).toEqual(parser.toTokens(code))
    })
})

import { createParser } from '../parser/parser'
import { Node, NodeFunction, NodeType, NodeVariable } from '../types/node'
import { useTokenHelper } from './token-helper'

export function useNodeHelper() {
    const parser = createParser()
    const tokenHelper = useTokenHelper()

    function toString(nodes: Node[]) {
        const tokens = nodes.map((n) => n.tokens).flat()

        return tokenHelper.toString(tokens)
    }

    function updateNodeStartAndEnd(nodes: Node[]) {
        nodes.forEach((node) => {
            const firstToken = node.tokens[0]
            const lastToken = node.tokens[node.tokens.length - 1]

            node.start = firstToken.start
            node.end = lastToken.end
        })
    }

    function replaceNode(nodes: Node[], node: Node, newNode: Node) {
        const index = nodes.indexOf(node)

        nodes.splice(index, 1, newNode)

        updateNodeStartAndEnd(nodes)
    }

    function replaceNodeByCode(nodes: Node[], node: Node, code: string) {
        const index = nodes.indexOf(node)

        const newNodes = parser.toNodes(code)

        nodes.splice(index, 1, ...newNodes)

        updateNodeStartAndEnd(nodes)
    }

    function replaceNodeInCode(code: string, node: Node, newCode: string) {
        const result = code.split('')

        result.splice(node.start, node.end - node.start, newCode)

        return result.join('')
    }

    function isVariable(node: Node): node is NodeVariable {
        return node.type === NodeType.Variable
    }

    function isFunction(node: Node): node is NodeFunction {
        return node.type === NodeType.Function
    }

    return {
        toString,
        replaceNodeInCode,
        replaceNode,
        replaceNodeByCode,
        updateNodeStartAndEnd,
        isVariable,
        isFunction,
    }
}

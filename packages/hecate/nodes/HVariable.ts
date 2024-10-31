import { NodeArray } from "@language-kit/core";
import HNode from "../base/HNode";

export default class HVariable extends HNode {
    public type = 'HVariable'

    public keyword: 'const' | 'let' | 'var' = 'const'
    
    public name = ''
    public value = ''
    public export = false
    public children = new NodeArray<HNode>()

    public setPositions(offset?: number | undefined) {
        super.setPositions(offset)

        const startBody = this.tokens.findIndex((t) => t.value === '=')
        const bodyToken = this.tokens[startBody + 1]

        let position = bodyToken?.start || 0

        this.children.setPositions(position + 1)

        return this
    }

}

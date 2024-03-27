import { NodeArray } from "@language-kit/core";
import HNode from "../base/HNode";

export default class HFunction extends HNode {
    public type = 'HFunction'    
    public name = ''
    public body = ''
    public export = false
    public children = new NodeArray<HNode>()


    public setPositions(offset?: number | undefined) {
        super.setPositions(offset)

        const bodyToken = this.tokens.find((t) => t.value === '{')

        let position = bodyToken?.start || 0

        this.children.setPositions(position + 1)

        return this
    }
}
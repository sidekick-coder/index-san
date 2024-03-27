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

        this.children.forEach((child) => {
            child.setPositions(bodyToken?.start ? bodyToken.start + 1 : 0)
        })

        return this
    }
}
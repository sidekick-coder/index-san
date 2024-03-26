// LineProcessor.ts
import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HVariable from '../nodes/HVariable'

export default class HVariableProcessor extends BaseProcessor<HNode> {
    public findConstantEnd() {
        return this.tokens.findIndex((t) => {
            if (t.value === ';') {
                return true
            }

            if (t.type === 'BreakLine') {
                return true
            }

            return false
        })
    }

    public process() {
        const current = this.tokens[0]

        if (!['const', 'let', 'var'].includes(current.value)) {
            return false
        }

        const endIndex = this.findConstantEnd()

        if (endIndex === -1) return false

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HVariable()

        node.tokens = tokens
        node.keyword = current.value as HVariable['keyword']
        node.name = tokens[2].value
        node.value = tokens.slice(5, tokens.length - 1).map((t) => t.value).join('').trim()

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}


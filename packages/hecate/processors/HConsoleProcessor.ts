// LineProcessor.ts
import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HConsole from '../nodes/HConsole'

export default class HConsoleProcessor extends BaseProcessor<HNode> {

    public order = 1

    public findEnd() {
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

    public findArguments() {
        const start = this.tokens.findIndex((t) => t.value === '(')
        const end = this.tokens.findIndex((t) => t.value === ')')

        return this.tokens.slice(start + 1, end).map((t) => t.value)
    }

    public process() {
        const current = this.tokens[0]

        if (current.value !== 'console') {
            return false
        }

        const endIndex = this.findEnd()

        if (endIndex === -1) {
            return false
        }

        const node = new HConsole()
        
        node.tokens = this.tokens.slice(0, endIndex + 1)
        node.args = this.findArguments()

        this.tokens.splice(0, endIndex + 1)
        this.nodes.push(node)

        return true
    }
}


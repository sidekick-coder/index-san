// LineProcessor.ts
import { BaseProcessor } from '@language-kit/core'
import HHecateObject from '../nodes/HHecateObject'

export default class HHecateObjectProcessor extends BaseProcessor<HHecateObject> {

    public order = 1

    public findEnd() {
        return this.tokens.findIndex((t) => t.value === ')')
    }

    public process() {
        const [current, next] = this.tokens

        if (current.value !== '$' || next.value !== 'hecate') {
            return false
        }

        const endIndex = this.findEnd()

        if (endIndex === -1) {
            return false
        }

        const node = new HHecateObject()
        
        node.tokens = this.tokens.slice(0, endIndex + 1)

        this.tokens.splice(0, endIndex + 1)
        this.nodes.push(node)

        return true
    }
}


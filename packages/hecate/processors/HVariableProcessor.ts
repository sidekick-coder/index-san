// LineProcessor.ts
import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HVariable from '../nodes/HVariable'

export default class HVariableProcessor extends BaseProcessor<HNode> {
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

    public isVariable(){
        const [current] = this.tokens

        return ['const', 'let', 'var'].includes(current.value)
    }

    public isExportVariable(){
        const [current, _space, next] = this.tokens

        return current.value === 'export' && ['const', 'let', 'var'].includes(next.value)
    }

    public findName() {
        const fnKeywordIndex = this.tokens.findIndex((t) => ['const', 'let', 'var'].includes(t.value))

        const token = this.tokens.find((t, i) => {
            if (i <= fnKeywordIndex) return false

            return t.type === 'Word'
        })

        return token?.value || ''
    }

    public findValue(){
        const start = this.tokens.findIndex((t) => t.value === '=')
        const end = this.findEnd()

        return this.tokens.slice(start + 1, end).map((t) => t.value).join('').trim()
    }

    public process() {
        const current = this.tokens[0]

        if (!this.isVariable() && !this.isExportVariable()) {
            return false
        }

        const endIndex = this.findEnd()

        if (endIndex === -1) return false

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HVariable()

        node.tokens = tokens
        node.keyword = current.value as HVariable['keyword']
        node.name = this.findName()
        node.export = this.isExportVariable()
        node.value = this.findValue()

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}


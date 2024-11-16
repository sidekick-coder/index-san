// LineProcessor.ts
import { BaseProcessor } from '@language-kit/core'
import HNode from '../base/HNode'
import HVariable from '../nodes/HVariable'

export default class HVariableProcessor extends BaseProcessor<HNode> {
    public order = 1

    public findEndFunction() {
        const start = this.tokens.findIndex((t) => t.value === '{')
        let open = 0

        const index =  this.tokens.findIndex((t, i) => {
            if (i <= start) return false

            if (t.value === '{') {
                open++
                return
            }

            if (open > 0 && t.value === '}') {
                open--
                return
            }

            if (open === 0 && t.value === '}') {
                return true
            }

            return false
        })

        return index
    }

    public findEndArray() {
        const start = this.tokens.findIndex((t) => t.value === '[')
        let open = 0

        const index =  this.tokens.findIndex((t, i) => {
            if (i <= start) return false

            if (t.value === '[') {
                open++
                return
            }

            if (open > 0 && t.value === ']') {
                open--
                return
            }

            if (open === 0 && t.value === ']') {
                return true
            }

            return false
        })

        return index
    }
    
    public findEnd() {
        const start = this.tokens.findIndex((t) => t.value === '=')
        const definitionToken = this.tokens.slice(start).find((t) => t.type !== 'WhiteSpace')

        if (definitionToken?.value === '{') {
            return this.findEndFunction()
        }

        if (definitionToken?.value === '[') {
            return this.findEndArray()
        }

        return this.tokens.findIndex((t) => {
            if (t.value === ';') {
                return true
            }

            if (t.type === 'BreakLine') {
                return true
            }
            
            if (t.type === 'EndOfFile') {
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
        const start = this.tokens.findIndex((t) => ['const', 'let', 'var'].includes(t.value))
        const end = this.tokens.findIndex((t, i) => t.value === '=' && i > start)

        return this.tokens.slice(start + 1, end).map((t) => t.value).join('').trim()
    }

    public findValueTokens(){
        const start = this.tokens.findIndex((t) => t.value === '=')
        const end = this.findEnd()

        return this.tokens.slice(start + 1, end)
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

        if (endIndex === -1) {
            console.error('[hecate] error finind end of variable')
            return false
        } 

        const tokens = this.tokens.slice(0, endIndex + 1)

        const node = new HVariable()

        node.tokens = tokens
        node.keyword = current.value as HVariable['keyword']
        node.name = this.findName()
        node.export = this.isExportVariable()
        node.value = this.findValue()
        node.children = this.parser.toNodes(this.findValue(), {
            lexer: {
                includeEndOfFileToken: false
            }
        })

        this.nodes.push(node)

        this.tokens.splice(0, endIndex + 1)

        return true
    }
}


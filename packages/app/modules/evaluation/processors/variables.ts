import { Lexer, Token, TokenType } from '@language-kit/lexer'
import { useTokenHelper } from '../helpers/token-helper'

interface Callback {
    (name: string, statements: string): string
}

const lexer = new Lexer()

interface Variable {
    start: number
    end: number
    tokens: Token[]
}

export function findVariables(code: string, declarations = [`const`, `let`, `var`]) {
    const variables = [] as Variable[]

    const tokens = lexer.tokenize(code)

    tokens.forEach((token, i) => {
        const nextToken = tokens[i + 2]
        const previousTokens = tokens.slice(0, i)

        if (!nextToken) return

        const openingFunctions = previousTokens.filter((token) => token.value === `{`)
        const closingFunctions = previousTokens.filter((token) => token.value === `}`)

        const isInsideFunction = openingFunctions.length > closingFunctions.length

        if (isInsideFunction) return

        if (!declarations.includes(token.value)) return

        let isInsideString = false

        const endIndex = tokens.findIndex((t, j) => {
            if (j < i) return false

            if ([`'`, `"`].includes(t.value)) {
                isInsideString = !isInsideString
                return false
            }

            if (isInsideString) return false

            if (t.value === `;`) return true

            if (t.type === TokenType.BreakLine) return true

            if (t.type === TokenType.EndOfFile) return true

            return false
        })

        if (endIndex === -1) return

        const allTokens = tokens.slice(i, endIndex + 1)

        const start = tokens
            .slice(0, i)
            .map((t) => t.value)
            .join(``).length

        const end = start + allTokens.map((t) => t.value).join(``).length

        variables.push({
            start,
            end,
            tokens: allTokens,
        })
    })

    return variables
}

export function defineVariableProcessor(cb: Callback) {
    return (code: string) => {
        const variables = findVariables(code)

        return variables.reduce((result, variable) => {
            const name = variable.tokens[2].value

            const value = variable.tokens
                .slice(6, variable.tokens.length - 1)
                .map((t) => t.value)
                .join(``)

            return result.replace(code.slice(variable.start, variable.end), cb(name, value))
        }, code)
    }
}

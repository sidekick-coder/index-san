import { TokenType } from '@language-kit/lexer'
import { ParserToken } from '../types/token'

export function useTokenHelper() {
    function withoutWhiteSpace(tokens: ParserToken[]) {
        return tokens.filter((t) => t.type !== TokenType.WhiteSpace)
    }

    function toString(tokens: ParserToken[]) {
        return tokens.map((t) => t.value).join('')
    }

    function isCall(tokens: ParserToken[]) {
        const [identifier, symbol] = withoutWhiteSpace(tokens)

        if (!identifier || !symbol) return false

        return identifier.type === TokenType.Word && symbol.value === '('
    }

    return {
        withoutWhiteSpace,
        isCall,
        toString,
    }
}

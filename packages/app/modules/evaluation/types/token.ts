import { Token } from '@language-kit/lexer'

export interface ParserToken extends Token {
    start: number
    end: number
}

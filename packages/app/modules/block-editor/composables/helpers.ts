import { Token } from '@language-kit/lexer'
import { MarkdownNodeParagraph, MarkdownParser, Processors } from '@language-kit/markdown'

const parser = new MarkdownParser()

export function createNodeParagraphFromHtml(payload: string) {
    const node = new MarkdownNodeParagraph()

    let text = payload

    // replace <p>{content}</p> > {content}
    text = text.replaceAll(/^<p>(.*)<\/p>$/g, '$1')

    // remove <br>
    text = text.replaceAll(/<br\s*\/?>/g, '')

    // replace whitespace to space
    text = text.replaceAll(/&nbsp;/g, ' ')

    // replace <strong>Text</strong> to **Text**
    text = text.replaceAll(/<strong>([^<]+)<\/strong>/g, '**$1**')

    // replace <em>Text</em> to *Text*
    text = text.replaceAll(/<em>([^<]+)<\/em>/g, '*$1*')

    // replace <s>Text</s> to ~~Text~~
    text = text.replaceAll(/<s>([^<]+)<\/s>/g, '~~$1~~')

    // replace <span {attrs}>Text</span> to [Text]{attrs}
    text = text.replaceAll(/<span\s+([^>]+)>([^<]+)<\/span>/g, '[$2]{ $1 }')

    node.body = text.trim()

    node.tokens = parser.toTokens(text, {
        includeEndOfFileToken: false,
    })

    node.tokens.push(Token.breakLine())

    node.children = parser.toNodes(text, {
        lexer: {
            includeEndOfFileToken: false,
        },
        processors: {
            only: [Processors.Text, Processors.TextBold, Processors.TextWithAttrs],
        },
    })

    return node
}

import { Token } from '@language-kit/lexer'
import { MarkdownNodeParagraph, MarkdownParser, Processors } from '@language-kit/markdown'

const parser = new MarkdownParser()

export function convertHtmlToMarkdown(html: string) {
    let text = html

    // remove <br>
    text = text.replaceAll(/<br\s*\/?>/g, '')

    // replace whitespace to space
    text = text.replaceAll(/&nbsp;/g, ' ')

    // replace <strong><em>Text</em></strong> to ***Text***
    text = text.replaceAll(/<strong><em>([^<]+)<\/em><\/strong>/g, '***$1***')

    // replace <strong>Text</strong> to **Text**
    text = text.replaceAll(/<strong>([^<]+)<\/strong>/g, '**$1**')

    // replace <em>Text</em> to *Text*
    text = text.replaceAll(/<em>([^<]+)<\/em>/g, '*$1*')

    // replace <s>Text</s> to ~~Text~~
    text = text.replaceAll(/<s>([^<]+)<\/s>/g, '~~$1~~')

    // replace <span {attrs}>Text</span> to [Text]{attrs}
    text = text.replaceAll(/<span\s+([^>]+)>([^<]+)<\/span>/g, '[$2]{ $1 }')

    return text
}

export function convertMarkdownToHtml(markdown: string) {
    let html = markdown

    // replace **Text** to <strong>Text</strong>
    html = html.replaceAll(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

    // replace *Text* to <em>Text</em>
    html = html.replaceAll(/\*([^*]+)\*/g, '<em>$1</em>')

    // replace ~~Text~~ to <s>Text</s>
    html = html.replaceAll(/~~([^~]+)~~/g, '<s>$1</s>')

    // replace [Text]{attrs} to <span {attrs}>Text</span>
    html = html.replaceAll(/\[([^\]]+)\]\{([^}]+)\}/g, '<span $2>$1</span>')

    return html
}

export function createNodeParagraphFromHtml(payload: string) {
    const node = new MarkdownNodeParagraph()

    const text = convertHtmlToMarkdown(payload)

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

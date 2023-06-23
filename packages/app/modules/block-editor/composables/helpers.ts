import {
    MarkdownNodeParagraph,
    MarkdownParser,
    MarkdownProcessorParagraph,
} from '@language-kit/markdown'

const parser = new MarkdownParser()

export function createNodeParagraphFromHtml(payload: string) {
    const node = new MarkdownNodeParagraph()

    let text = payload

    if (text.startsWith('<p>')) {
        // replace <p>{content}</p> > {content}
        text = payload.replace(/^<p>(.*)<\/p>$/, '$1')
    }

    // replace <strong>Text</strong> to **Text**
    text = text.replaceAll(/<strong>([^<]+)<\/strong>/g, '**$1**')

    // replace <em>Text</em> to *Text*
    text = text.replaceAll(/<em>([^<]+)<\/em>/g, '*$1*')

    // replace <s>Text</s> to ~~Text~~
    text = text.replaceAll(/<s>([^<]+)<\/s>/g, '~~$1~~')

    // replace <span {attrs}>Text</span> to [Text]{attrs}
    text = text.replaceAll(/<span\s+([^>]+)>([^<]+)<\/span>/g, '[$2]{ $1 }')

    node.children = parser.toNodes(text, {
        lexer: {
            includeEndOfFileToken: false,
        },
        processors: {
            exclude: [MarkdownProcessorParagraph],
        },
    })

    return node
}

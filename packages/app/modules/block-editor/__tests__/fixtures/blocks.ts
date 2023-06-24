import { MarkdownNodeParagraph } from '@language-kit/markdown'

export function createParagraph(data: Partial<MarkdownNodeParagraph> = {}) {
    const node = new MarkdownNodeParagraph()

    Object.assign(node, data)

    return node
}

export function createManyParagraphs(
    length = 5,
    cb?: (i: number) => Partial<MarkdownNodeParagraph>
) {
    return Array.from({ length }).map((_, i) => createParagraph(cb ? cb(i) : {}))
}

import { MarkdownNode, MarkdownNodeHeading, MarkdownNodeParagraph } from '@language-kit/markdown'

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

export function createFactory<T extends MarkdownNode>(defineFn: (data?: Partial<T>) => T) {
    const make = (data?: Partial<T>) => defineFn(data)

    function makeMany(length = 5, data?: Partial<T>) {
        return Array.from({ length }).map(() => make(data))
    }

    return {
        make,
        makeMany,
    }
}

export function createHeadingFactory() {
    return createFactory<MarkdownNodeHeading>((data) => {
        const node = new MarkdownNodeHeading()

        node.level = 1
        node.body = 'Heading'

        Object.assign(node, data)

        return node
    })
}

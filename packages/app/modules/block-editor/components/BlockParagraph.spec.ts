import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it, vi } from 'vitest'

import BlockParagraph from './BlockParagraph.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { createNodeParagraphFromHtml } from '../composables/helpers'
import { Token } from '@language-kit/lexer'
import Block from './Block.vue'
import { useBlockStub } from '../__tests__/stubs'
import ToolbarTextFormat from './ToolbarTextFormat.vue'
import { MarkdownNodeParagraph } from '@language-kit/markdown'

describe('BlockParagraph', () => {
    const component = useMountWrapper(BlockParagraph, {
        shallow: true,
        global: {
            stubs: {
                Block: useBlockStub(),
            },
        },
    })

    afterEach(() => {
        component.unmount()

        vi.resetAllMocks()
    })

    function findHTMLContentEditable() {
        return component.wrapper!.findComponent(HTMLContentEditable)
    }

    function findBlock() {
        return component.wrapper!.findComponent(Block)
    }

    function findToolbarTextFormat() {
        return component.wrapper!.findComponent(ToolbarTextFormat)
    }

    it('should pass node html to mode prop of HTMLContentEditable component', () => {
        const node = createNodeParagraphFromHtml('Hello word')

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const editable = findHTMLContentEditable()

        expect(editable.exists()).toBe(true)

        expect(editable.props('modelValue')).toBe('Hello word')
    })

    it.each([
        [' ', '&nbsp;'],
        ['Hello <strong>bold</strong> ', 'Hello <strong>bold</strong>&nbsp;'],
    ])('should transform endline white-spaces before use the html: %#', (input, expected) => {
        const node = createNodeParagraphFromHtml(input)

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const editable = findHTMLContentEditable()

        expect(editable.props('modelValue')).toBe(expected)
    })

    it.each(['blur', 'keydown.enter', 'keydown.ctrl.s'])(
        'should %s event trigger node update with correct format',
        async (event) => {
            const spy = vi.fn()

            const payload = createNodeParagraphFromHtml('Test <strong>bold</strong>')

            payload.meta = { id: 'test', toolbarId: 'test-toolbar' }

            component.mount({
                props: {
                    'modelValue': payload,
                    'onUpdate:model-value': spy,
                },
            })

            const editable = findHTMLContentEditable()

            const expected = createNodeParagraphFromHtml('Test <strong>bold</strong> update')

            expected.meta = payload.meta

            await editable.setValue('Test <strong>bold</strong> update')

            await editable.trigger(event)

            expect(spy).toHaveBeenCalledOnce()

            expect(spy).toHaveBeenCalledWith(expected)
        }
    )

    it('should updated node always end with a break line', async () => {
        const node = ref(createNodeParagraphFromHtml('Test <strong>bold</strong>'))

        node.value.meta = { id: 'test', toolbarId: 'test-toolbar' }

        component.mount({
            props: {
                'modelValue': node.value,
                'onUpdate:model-value': (v) => (node.value = v),
            },
        })

        const editable = findHTMLContentEditable()

        await editable.setValue('Test <strong>bold</strong> update')

        const lastToken = node.value.tokens.at(-1)

        expect(lastToken).toEqual(Token.breakLine())
    })

    it('should call focus() method of HTMLContentEditable when block is selected', async () => {
        const node = createNodeParagraphFromHtml('Hello word')

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const editable = findHTMLContentEditable()
        const block = findBlock()

        const focus = vi.fn()

        editable.vm.focus = focus

        block.vm.$emit('update:selected', true)

        await nextTick()

        expect(focus).toHaveBeenCalledOnce()
    })

    it('should update node when ToolbarTextFormat emit change event', async () => {
        const node = createNodeParagraphFromHtml('Hello word')

        component.mount({
            props: {
                'modelValue': node,
                'onUpdate:model-value': (n: MarkdownNodeParagraph) => {
                    node.body = n.body
                },
            },
        })

        const editable = findHTMLContentEditable()
        const toolbar = findToolbarTextFormat()

        const input = vi.fn()

        editable.vm.input = input

        await editable.setValue('Updated')

        toolbar.trigger('change')

        await nextTick()

        expect(input).toHaveBeenCalledOnce()

        expect(node.body).toBe('Updated')
    })
})

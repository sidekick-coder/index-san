import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it, vi } from 'vitest'

import BlockParagraph from './BlockParagraph.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { createNodeParagraphFromHtml } from '../composables/helpers'
import { Token } from '@language-kit/lexer'

describe('BlockParagraph', () => {
    const component = useMountWrapper(BlockParagraph, {
        shallow: true,
        global: {
            stubs: {
                Block: {
                    template: '<div><slot /></div>',
                },
            },
        },
    })

    afterEach(component.unmount)

    function findHTMLContentEditable() {
        return component.wrapper!.findComponent(HTMLContentEditable)
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

        expect(editable.props('modelValue')).toBe('Hello&nbsp;word')
    })

    it.each([
        ['Hello word', 'Hello&nbsp;word'],
        ['Hello <strong>bold</strong>', 'Hello&nbsp;<strong>bold</strong>'],
    ])(
        'should transform spaces %s before pass the prop of HTMLContentEditable',
        (input, expected) => {
            const node = createNodeParagraphFromHtml(input)

            component.mount({
                props: {
                    modelValue: node,
                },
            })

            const editable = findHTMLContentEditable()

            expect(editable.exists()).toBe(true)

            expect(editable.props('modelValue')).toBe(expected)
        }
    )

    it.each(['blur', 'keydown.enter', 'keydown.ctrl.s'])(
        'should when %s event happen emit update event with correct format',
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

    it('should updated node always end block with a break line', async () => {
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

    it.todo('should focus HTMLContentEditable when block is selected')

    it.todo('should emit update event when ToolbarTextFormat modifies the content')
})

import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it, vi } from 'vitest'

import BlockParagraph from './BlockParagraph.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { createNodeParagraphFromHtml } from '../composables/helpers'

describe('BlockParagraph', () => {
    const component = useMountWrapper(BlockParagraph, {
        shallow: true,
    })

    afterEach(component.unmount)

    function findHTMLContentEditable() {
        return component.wrapper!.findComponent(HTMLContentEditable)
    }

    it('should pass node as html to HTMLContentEditable component', () => {
        component.mount({
            props: {
                modelValue: createNodeParagraphFromHtml('Test <strong>bold</strong>'),
            },
        })

        const editable = findHTMLContentEditable()

        expect(editable.exists()).toBe(true)

        expect(editable.props('modelValue')).toBe('<p>Test <strong>bold</strong></p>')
    })

    it('should when html changes, emit update event with correct format', async () => {
        const spy = vi.fn()

        component.mount({
            props: {
                'modelValue': createNodeParagraphFromHtml('Test <strong>bold</strong>'),
                'onUpdate:model-value': spy,
            },
        })

        const editable = findHTMLContentEditable()

        await editable.setValue('Test <strong>bold</strong> update')

        expect(spy).toHaveBeenCalledOnce()

        expect(spy).toHaveBeenCalledWith(
            createNodeParagraphFromHtml('Test <strong>bold</strong> update')
        )
    })

    it.todo('should focus HTMLContentEditable when block is selected')

    it.todo('should blur HTMLContentEditable area when block is selected')

    it.todo('should emit update event when ToolbarTextFormat modifies the content')
})

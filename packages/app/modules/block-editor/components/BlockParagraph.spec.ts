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

        expect(spy).toHaveBeenCalledOnce()

        expect(spy).toHaveBeenCalledWith(expected)
    })

    it.todo('should focus HTMLContentEditable when block is selected')

    it.todo('should blur HTMLContentEditable area when block is selected')

    it.todo('should always end block with a break line')

    it.todo('should replace empty spaces with &nbsp; to avoid bugs')

    it.todo('should emit update event when ToolbarTextFormat modifies the content')
})

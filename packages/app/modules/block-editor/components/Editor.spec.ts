import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { create, key } from '../composables/editor'
import { MarkdownNode } from '@language-kit/markdown'
import Editor from './Editor.vue'
import ToolbarVue from './Toolbar.vue'
import BlockParagraph from './BlockParagraph.vue'
import { createManyParagraphs, createParagraph } from '../__tests__/fixtures/blocks'

describe('Editor (unit)', () => {
    const editor = create()

    const component = useMountWrapper(Editor, {
        shallow: true,
        global: {
            provide: {
                [key]: editor,
            },
        },
    })

    afterEach(() => {
        component.unmount()

        editor.clear()
    })

    function findToolbar() {
        return component.wrapper!.findComponent(ToolbarVue)
    }

    function findParagraphs() {
        return component.wrapper!.findAllComponents(BlockParagraph)
    }

    function findInvalidBlock() {
        return component.wrapper!.find('[data-test-id=invalid-block]')
    }

    it('should render toolbar', () => {
        component.mount()

        expect(findToolbar().exists()).toBe(true)
    })

    it('should render a block for each node', () => {
        const size = 5

        const nodes = createManyParagraphs(size, (i) => ({
            body: `Paragraph ${i}`,
        }))

        editor.nodes.push(...nodes)

        component.mount()

        const blocks = findParagraphs()

        expect(blocks).toHaveLength(size)
    })

    it('should show error block when node is invalid', () => {
        const node = new MarkdownNode()

        node.type = 'invalid'

        editor.create(node)

        component.mount()

        expect(findInvalidBlock().exists()).toBe(true)
    })

    it('should send update event when one node is updated', async () => {
        const spy = vi.fn()

        const node = createParagraph()

        editor.create(node)

        editor.on('update', spy)

        component.mount()

        await nextTick()

        node.body = 'Updated'

        const [block] = findParagraphs()

        block.setValue(node)

        await nextTick()

        expect(spy).toHaveBeenCalledWith({ node })
    })
})

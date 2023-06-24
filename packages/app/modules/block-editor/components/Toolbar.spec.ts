import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Block from './Block.vue'
import { create, provideEditor, key } from '../composables/editor'
import { MarkdownNode } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'
import VIcon from '@components/VIcon.vue'
import Toolbar from './Toolbar.vue'

describe('Toolbar (unit)', () => {
    const editor = create()
    const component = useMountWrapper(Toolbar, {
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

    function createManyNodes(length = 5) {
        const nodes = Array.from({ length }, () => editor.make())

        editor.nodes.push(...nodes)

        return nodes
    }

    function findNodesToolbar() {
        return component.wrapper!.findAll('[data-test-id=node-toolbar]')
    }

    it('should create an toolbar element for each node', () => {
        const nodes = createManyNodes()

        component.mount()

        const toolbars = findNodesToolbar()

        expect(toolbars).toHaveLength(nodes.length)
    })

    it('should show only selected node toolbar', () => {
        const nodes = createManyNodes()

        editor.select(nodes[0])

        component.mount()

        const toolbars = findNodesToolbar()

        const selected = toolbars[0]

        expect(selected.classes()).toContain('opacity-100')

        toolbars.slice(1).forEach((t) => expect(t.classes()).toContain('opacity-0'))
    })
})

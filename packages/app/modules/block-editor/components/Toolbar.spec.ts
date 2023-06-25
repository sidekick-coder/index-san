import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it } from 'vitest'

import { create, key } from '../composables/editor'
import Toolbar from './Toolbar.vue'
import { createManyParagraphs } from '../__tests__/factories'

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
        const nodes = createManyParagraphs(length)

        editor.createAll(nodes)

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

        expect(selected.isVisible()).toBe(true)

        toolbars.slice(1).forEach((t) => expect(t.isVisible()).toBe(false))
    })
})

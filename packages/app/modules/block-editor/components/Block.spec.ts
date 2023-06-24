import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Block from './Block.vue'
import { create, provideEditor, key } from '../composables/editor'
import { MarkdownNode } from '@language-kit/markdown'
import uniqueId from 'lodash/uniqueId'
import VIcon from '@components/VIcon.vue'

describe('Block (unit)', () => {
    const editor = create()
    let toolbarContainer: HTMLElement

    const component = useMountWrapper(Block, {
        global: {
            provide: {
                [key]: editor,
            },
        },
    })

    beforeEach(() => {
        toolbarContainer = document.createElement('div')

        document.body.appendChild(toolbarContainer)
    })

    afterEach(() => {
        component.unmount()

        editor.clear()

        toolbarContainer.remove()
    })

    function createNode() {
        const node = new MarkdownNode()

        node.meta.id = uniqueId('node-')

        node.meta.toolbarId = `${editor.id}-toolbar-${node.meta.id}`

        const nodeToolbar = document.createElement('div')

        nodeToolbar.id = node.meta.toolbarId

        toolbarContainer.appendChild(nodeToolbar)

        return node
    }

    function findIcon() {
        return component.wrapper!.findComponent<typeof VIcon>('[data-test-id=icon]')
    }

    it('should render content slot', () => {
        const node = createNode()

        const wrapper = component.mount({
            props: {
                modelValue: node,
            },
            slots: {
                default: `<div class="block-content"></div>`,
            },
        })

        expect(wrapper.find('.block-content').exists()).toBe(true)
    })

    it('should selected model tell if block is selected or not', async () => {
        const node = createNode()
        const selected = ref(false)

        component.mount({
            props: {
                'modelValue': node,
                'selected': selected.value,
                'onUpdate:selected': (v: boolean) => (selected.value = v),
            },
        })

        expect(selected.value).toBe(false)

        editor.selected.push(node)

        await nextTick()

        expect(selected.value).toBe(true)
    })

    it('should set editor.selected when parent component change selected model', async () => {
        const node = createNode()

        const wrapper = component.mount({
            props: {
                modelValue: node,
                selected: false,
            },
        })

        expect(editor.selected).toHaveLength(0)

        wrapper.setProps({ selected: true })

        await nextTick()

        expect(editor.selected).toEqual([node])
    })

    it('should use teleport to render toolbar slot and only if is selected', async () => {
        const node = createNode()

        component.mount({
            props: {
                modelValue: node,
            },
            slots: {
                toolbar: `<div class="block-toolbar"></div>`,
            },
        })

        expect(toolbarContainer.innerHTML).not.toContain('<div class="block-toolbar"></div>')

        editor.select(node)

        await nextTick()

        expect(toolbarContainer.innerHTML).toContain('<div class="block-toolbar"></div>')
    })

    it('should change icon with prop', () => {
        const node = createNode()

        component.mount({
            props: {
                modelValue: node,
                icon: 'mdi:cube',
            },
        })

        const icon = findIcon()

        expect(icon.exists()).toBe(true)

        expect(icon.props('name')).toBe('mdi:cube')
    })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import NewBlockMenu from './NewBlockMenu.vue'

import { useMountWrapper } from '__tests__/fixtures/component'
import i18n from '@plugins/i18n'
import {
    MarkdownNode,
    MarkdownNodeComponent,
    MarkdownNodeHeading,
    MarkdownNodeParagraph,
} from '@language-kit/markdown'

describe('NewBlockMenu', () => {
    const component = useMountWrapper(NewBlockMenu, {
        global: {
            plugins: [i18n],
        },
    })

    afterEach(component.unmount)

    function findAllItems() {
        return component.wrapper!.findAll('[data-test-item]')
    }

    function findItem(name: string) {
        return component.wrapper!.find(`[data-test-id="item-${name}"]`)
    }

    it('should show list of available blocks', () => {
        component.mount()

        expect(findAllItems()).toHaveLength(4)
    })

    it.each([
        ['paragraph', MarkdownNodeParagraph],
        ['heading', MarkdownNodeHeading],
    ])('should emit select event with instance when click on %s item', async (name, instance) => {
        const wrapper = component.mount()

        const item = findItem(name)

        expect(item.exists()).toBe(true)

        await item.trigger('click')

        const emitted = wrapper.emitted<MarkdownNode>('select')

        const node = emitted![0][0]

        expect(node).toBeDefined()

        expect(node).toBeInstanceOf(instance)
    })

    it.each([
        ['script', 'script'],
        ['chart', 'chart'],
    ])(
        'should emit select event with MarkdownNodeComponent instance when click on %s item',
        async (name, componentName) => {
            const wrapper = component.mount()

            const item = findItem(name)

            expect(item.exists()).toBe(true)

            await item.trigger('click')

            const emitted = wrapper.emitted<MarkdownNodeComponent>('select')

            const node = emitted![0][0]

            expect(node).toBeDefined()

            expect(node).toBeInstanceOf(MarkdownNodeComponent)

            expect(node.is('Component')).toBe(true)

            expect(node.name).toBe(componentName)
        }
    )
})

import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MarkdownNodeComponent } from '@language-kit/markdown'
import { useBlockStub } from '../__tests__/stubs'

import BlockScript from './BlockScript.vue'
import VBtn from '@components/VBtn.vue'
import ANSICard from '@modules/evaluation/components/ANSICard.vue'
import { waitFor } from '@composables/utils'
import MonacoEditor from '@components/MonacoEditor.vue'
import { flushPromises } from '@vue/test-utils'

describe('BlockScript (unit)', () => {
    const component = useMountWrapper(BlockScript, {
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

    function createNode(data?: Partial<MarkdownNodeComponent>) {
        const node = new MarkdownNodeComponent()

        node.name = 'script'
        node.attrs = data?.attrs ?? {}
        node.body = data?.body ?? ''

        return node
    }

    function findButton(id: 'run' | 'clear' | 'edit' | 'save') {
        return component.wrapper!.findComponent(`[data-test-id="${id}-btn"]`)
    }

    function findEditor() {
        return component.wrapper!.findComponent<typeof MonacoEditor>('[data-test-id="editor"]')
    }

    function findANSICard() {
        return component.wrapper!.findComponent(ANSICard)
    }

    it('should execute script on run-btn click', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        findButton('run').trigger('click')

        await flushPromises()

        expect(findANSICard().props('modelValue')).toEqual(['Hello world!\n'])
    })

    it('should show editor when click on edit-btn', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        await findButton('edit').trigger('click')

        expect(findEditor().exists()).toBe(true)
    })

    it('should update node when click on save-btn', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        component.mount({
            props: {
                'modelValue': node,
                'onUpdate:modelValue': (n: MarkdownNodeComponent) => {
                    node.body = n.body
                },
            },
        })

        await findButton('edit').trigger('click')

        const editor = findEditor()

        await editor.setValue('console.log("Update!")')

        await findButton('save').trigger('click')

        expect(node.body).toBe('console.log("Update!")')
    })

    it('should clear output on clean-btn click', async () => {
        const node = createNode({
            body: 'console.log("Hello world!")',
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        await findButton('run').trigger('click')

        await flushPromises()

        expect(findANSICard().props('modelValue')).toEqual(['Hello world!\n'])

        await findButton('clear').trigger('click')

        expect(findANSICard().props('modelValue')).toEqual([])
    })
})

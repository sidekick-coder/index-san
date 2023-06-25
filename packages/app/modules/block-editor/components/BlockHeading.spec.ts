import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { create, key } from '../composables/editor'
import BlockHeading from './BlockHeading.vue'
import HTMLContentEditable from './HTMLContentEditable.vue'
import { createHeadingFactory } from '../__tests__/factories'
import { useBlockStub, useVBtnStub } from '../__tests__/stubs'
import { MarkdownNodeHeading } from '@language-kit/markdown'
import Block from './Block.vue'
import VIcon from '@components/VIcon.vue'
import VBtn from '@components/VBtn.vue'

describe('BlockHeading (unit)', () => {
    const editor = create()
    const factory = createHeadingFactory()
    const component = useMountWrapper(BlockHeading, {
        shallow: true,
        global: {
            provide: {
                [key]: editor,
            },
            stubs: {
                Block: useBlockStub(),
                VBtn: useVBtnStub(),
            },
        },
    })

    afterEach(() => {
        component.unmount()

        editor.clear()
    })

    function findEditable() {
        return component.wrapper!.findComponent(HTMLContentEditable)
    }

    function findBlock() {
        return component.wrapper!.findComponent(Block)
    }

    function findDragIcon() {
        return component.wrapper!.findComponent<typeof VIcon>('[data-test-id=dragger-icon]')
    }

    function findToggleLevelButtons() {
        return component.wrapper!.findAllComponents<typeof VBtn>('[data-test-id=toggle-level-btn]')
    }

    it('should render HTMLContentEditable component', () => {
        const node = factory.make({ level: 1 })

        editor.create(node)

        component.mount({
            props: {
                modelValue: node,
            },
        })

        expect(findEditable().exists()).toBe(true)
    })

    it('should use h1 element as  v-model', () => {
        const node = factory.make({ level: 1 })

        editor.create(node)

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const editable = findEditable()

        expect(editable.props('modelValue')).toBe('<h1>Heading</h1>')
    })

    it.each([
        ['Hello word', 'Hello&nbsp;word'],
        ['Hello <strong>bold</strong>', 'Hello&nbsp;<strong>bold</strong>'],
    ])('should transform white-spaces %s before use the html', (input, expected) => {
        const node = factory.make({
            level: 1,
            body: input,
        })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const editable = findEditable()

        expect(editable.props('modelValue')).toBe(`<h1>${expected}</h1>`)
    })

    it('should change heading element based on node level', async () => {
        const node = ref(factory.make({ level: 3 }))

        editor.create(node.value)

        component.mount({
            props: {
                modelValue: node.value,
            },
        })

        const editable = findEditable()

        expect(editable.props('modelValue')).toBe('<h3>Heading</h3>')

        node.value.level = 2

        await nextTick()

        expect(editable.props('modelValue')).toBe('<h2>Heading</h2>')
    })

    it.each(['blur', 'keydown.enter', 'keydown.ctrl.s'])(
        'should update node with %s event',
        async (event) => {
            const node = factory.make()

            editor.create(node)

            component.mount({
                props: {
                    'modelValue': node,
                    'onUpdate:modelValue': (n: MarkdownNodeHeading) => {
                        node.body = n.body
                        node.level = n.level
                    },
                },
            })

            const editable = findEditable()

            await editable.setValue('<h1>Updated</h1>')

            await editable.trigger(event)

            expect(node.body).toBe('Updated')
        }
    )

    it('should focus HTMLContentEditable when block is selected', async () => {
        const node = factory.make()

        editor.create(node)

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const editable = findEditable()
        const block = findBlock()

        const focus = vi.fn()

        editable.vm.focus = focus

        block.vm.$emit('update:selected', true)

        await nextTick()

        expect(focus).toHaveBeenCalledOnce()
    })

    it.each([1, 2, 3, 4, 5, 6])('should show icon based on header level %d', async (level) => {
        const node = factory.make({ level })

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const dragIcon = findDragIcon()

        expect(dragIcon.exists()).toBe(true)

        expect(dragIcon.props('name')).toBe(`lucide:heading-${level}`)
    })

    it.each([1, 2, 3, 4, 5, 6])(
        'should when click on button h%d update header level',
        async (level) => {
            const node = factory.make({ level: 1 })

            component.mount({
                props: {
                    'modelValue': node,
                    'onUpdate:modelValue': (n: MarkdownNodeHeading) => {
                        node.body = n.body
                        node.level = n.level
                    },
                },
            })

            const buttons = findToggleLevelButtons()

            const button = buttons[level - 1]

            expect(button.exists()).toBe(true)

            await button.trigger('click')

            expect(node.level).toBe(level)
        }
    )
})

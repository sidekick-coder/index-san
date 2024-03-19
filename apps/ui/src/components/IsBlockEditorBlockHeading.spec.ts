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

        editor.add(node)

        component.mount({
            props: {
                modelValue: node,
            },
        })

        expect(findEditable().exists()).toBe(true)
    })

    it('should use h1 element as  v-model', () => {
        const node = factory.make({ level: 1 })

        editor.add(node)

        component.mount({
            props: {
                modelValue: node,
            },
        })

        const editable = findEditable()

        expect(editable.props('modelValue')).toBe('Heading')
    })

    it.each([
        ['Hello word ', 'Hello word&nbsp;'],
        ['Hello <strong>bold</strong> ', 'Hello <strong>bold</strong>&nbsp;'],
    ])(
        'should transform white-spaces at end of string %s before use the html',
        (input, expected) => {
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

            expect(editable.props('modelValue')).toBe(`${expected}`)
        }
    )

    it('should change heading element based on node level', async () => {
        const node = ref(factory.make({ level: 3 }))

        editor.add(node.value)

        const wrapper = component.mount({
            props: {
                modelValue: node.value,
            },
        })

        const editable = findEditable()

        expect(editable.props('modelValue')).toBe('Heading')

        expect(wrapper.html()).toContain('<h3>')

        node.value.level = 2

        await nextTick()

        expect(wrapper.html()).toContain('<h2>')
    })

    it.each(['blur', 'keydown.enter', 'keydown.ctrl.s'])(
        'should update node with %s event',
        async (event) => {
            const node = factory.make()

            editor.add(node)

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

            await editable.setValue('Updated')

            await editable.trigger(event)

            expect(node.body).toBe('# Updated')
        }
    )

    it('should focus HTMLContentEditable when block is selected', async () => {
        const node = factory.make()

        editor.add(node)

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

import { useMountWrapper } from '__tests__/fixtures/component'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import ToolbarTextFormat from './ToolbarTextFormat.vue'
import ToolbarBtn from './ToolbarBtn.vue'

describe('ToolbarTextFormat (unit)', () => {
    const component = useMountWrapper(ToolbarTextFormat)

    let container: HTMLDivElement

    beforeAll(() => {
        container = document.createElement('div')

        container.setAttribute('contenteditable', 'true')

        document.body.appendChild(container)
    })

    afterAll(() => {
        container.remove()

        vi.resetAllMocks()
    })

    afterEach(() => {
        component.unmount()

        container.innerHTML = ''
    })

    const buttons = [
        {
            id: 'bold',
            tag: 'strong',
        },
        {
            id: 'italic',
            tag: 'em',
        },
        {
            id: 'underline',
            tag: 'u',
        },
        {
            id: 'strikethrough',
            tag: 's',
        },
    ]

    function findButton(id: string) {
        return component.wrapper!.findComponent<typeof ToolbarBtn>(`[data-test-id="${id}"]`)
    }

    function createSelection(tag = 'div', html = 'Hello word') {
        const element = document.createElement(tag)

        element.innerHTML = html

        container.appendChild(element)

        const range = document.createRange()

        range.selectNodeContents(element)

        const selection = window.getSelection()

        selection?.removeAllRanges()

        selection?.addRange(range)

        return element
    }

    it.each(buttons)('should render $id button ', (btn) => {
        component.mount()

        const button = findButton(btn.id)

        expect(button.exists()).toBe(true)
    })

    it.each(buttons)(
        'should button $id wrap selection in $tag tag and emit change event',
        async (btn) => {
            const wrapper = component.mount()

            const button = findButton(btn.id)

            createSelection('div', 'Hello')

            await button.trigger('click')

            expect(container.innerHTML).toContain(`<${btn.tag}>Hello</${btn.tag}>`)

            expect(wrapper.emitted('change')).toBeDefined()

            expect(wrapper.emitted('change')).toHaveLength(1)
        }
    )

    it.each(buttons)('should button $id unwrap selection in $tag tag', async (btn) => {
        const wrapper = component.mount()

        const button = findButton(btn.id)

        createSelection(btn.tag, 'Hello')

        await button.trigger('click')

        expect(container.innerHTML).toBe('Hello')

        expect(wrapper.emitted('change')).toBeDefined()

        expect(wrapper.emitted('change')).toHaveLength(1)
    })

    it.each(buttons)(
        'should button $id be active when selection is already wrapped in $tag tag',
        async (btn) => {
            let onSelectionChange = () => {
                //
            }

            const implementation = (name: string, cb: () => void) => {
                if (name === 'selectionchange') {
                    onSelectionChange = cb
                }
            }

            vi.spyOn(document, 'addEventListener').mockImplementation(implementation as any)

            component.mount({
                attachTo: document.body,
            })

            const button = findButton(btn.id)

            createSelection(btn.tag, 'Hello')

            await nextTick()

            onSelectionChange()

            await nextTick()

            expect(button.props('active')).toBe(true)
        }
    )
})

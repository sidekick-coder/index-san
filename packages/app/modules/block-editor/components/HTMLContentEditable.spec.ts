import { afterEach, describe, expect, it, vi } from 'vitest'

import HTMLContentEditable from './HTMLContentEditable.vue'

import { useMountWrapper } from '__tests__/fixtures/component'

describe('HTMLContentEditable', () => {
    const component = useMountWrapper(HTMLContentEditable)

    afterEach(component.unmount)

    function findViewArea() {
        return component.wrapper!.find('[data-test-id=view-area]')
    }

    function findEditableArea() {
        return component.wrapper!.find('[data-test-id=editable-area]')
    }

    it('should render html from modelValue', () => {
        component.mount({
            props: {
                modelValue: '<p>test</p>',
            },
        })

        expect(findEditableArea().html()).toContain('<p>test</p>')
    })

    it('should html element should be editable', () => {
        component.mount({
            props: {
                modelValue: '<p>test</p>',
            },
        })

        const editable = findEditableArea()

        expect(editable.exists()).toBe(true)

        expect(editable.attributes('contenteditable')).toBe('true')
    })

    it.each([
        ['<p>Hello {{ name }}</p>', { name: 'Dio' }, '<p>Hello Dio</p>'],
        ['<p>Sum {{ 1 + 2 }}</p>', {}, '<p>Sum 3</p>'],
        ['<p>Sum with variables {{ a + b }}</p>', { a: 1, b: 2 }, '<p>Sum with variables 3</p>'],
    ])('should render text interpolation %s', (modelValue, state, expected) => {
        component.mount({
            props: {
                modelValue,
                state,
            },
        })

        const view = findViewArea()

        expect(view.html({ raw: true })).toBe(`<div data-test-id="view-area">${expected}</div>`)
    })

    it('should update render html when state variables change', async () => {
        const wrapper = component.mount({
            props: {
                modelValue: '<p>{{ message }}</p>',
                state: {
                    message: 'Hello world',
                },
            },
        })

        expect(findEditableArea().html()).toContain('<p>{{ message }}</p>')

        expect(findViewArea().html()).toContain('<p>Hello world</p>')

        await wrapper.setProps({ state: { message: 'Hello Dio' } })

        expect(findViewArea().html()).toContain('<p>Hello Dio</p>')
    })

    it('should emit update:model-value event when html changes', async () => {
        const spy = vi.fn()

        component.mount({
            props: {
                'modelValue': '<p>test</p>',
                'onUpdate:model-value': spy,
            },
        })

        const editable = findEditableArea()

        editable.element.innerHTML = '<p>test2</p>'

        await editable.trigger('input')

        expect(spy).toHaveBeenCalledOnce()

        expect(spy).toHaveBeenCalledWith('<p>test2</p>')
    })

    it('should hide editable-area and show view-area when is dynamic render and is not focused', async () => {
        component.mount({
            props: {
                modelValue: '<p>{{ message }}</p>',
                state: {
                    message: 'Hello world',
                },
            },
        })

        expect(findViewArea().exists()).toBe(true)

        expect(findEditableArea().classes()).toContain('opacity-0')

        await findEditableArea().trigger('focus')

        expect(findViewArea().exists()).toBe(false)

        expect(findEditableArea().classes()).not.toContain('opacity-0')
    })
})

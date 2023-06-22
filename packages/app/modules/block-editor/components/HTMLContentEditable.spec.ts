import { afterEach, describe, expect, it, vi } from 'vitest'

import HTMLContentEditable from './HTMLContentEditable.vue'
import { useMountWrapper } from '__tests__/fixtures/component'

describe('HTMLContentEditable', () => {
    const component = useMountWrapper(HTMLContentEditable)

    afterEach(component.unmount)

    it('should render html from modelValue', () => {
        const wrapper = component.mount({
            props: {
                modelValue: '<p>test</p>',
            },
        })

        expect(wrapper.html()).toContain('<p>test</p>')
    })

    it('should html element should be editable', () => {
        const wrapper = component.mount({
            props: {
                modelValue: '<p>test</p>',
            },
        })

        const editable = wrapper.find('[data-test-id=editable-area]')

        expect(editable.exists()).toBe(true)

        expect(editable.attributes('contenteditable')).toBe('true')
    })

    it.each([
        ['<p>Hello {{ name }}</p>', { name: 'Dio' }, '<p>Hello Dio</p>'],
        ['<p>Sum {{ 1 + 2 }}</p>', {}, '<p>Sum 3</p>'],
        ['<p>Sum with variables {{ a + b }}</p>', { a: 1, b: 2 }, '<p>Sum with variables 3</p>'],
    ])('should render text interpolation %s', (modelValue, state, expected) => {
        const wrapper = component.mount({
            props: {
                modelValue,
                state,
            },
        })

        const view = wrapper.find('[data-test-id=view-area]')

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

        expect(wrapper.html()).toContain('<p>Hello world</p>')

        await wrapper.setProps({ state: { message: 'Hello Dio' } })

        expect(wrapper.html()).toContain('<p>Hello Dio</p>')
    })

    it('should emit update:model-value event when html changes', async () => {
        const spy = vi.fn()

        const wrapper = component.mount({
            props: {
                'modelValue': '<p>test</p>',
                'onUpdate:model-value': spy,
            },
        })

        const editable = wrapper.find('[data-test-id=editable-area]')

        editable.element.innerHTML = '<p>test2</p>'

        await editable.trigger('input')

        expect(spy).toHaveBeenCalledOnce()

        expect(spy).toHaveBeenCalledWith('<p>test2</p>')
    })
})

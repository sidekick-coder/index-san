import { test, expect, describe, beforeEach } from 'vitest'

import VCard from './VCard.vue'
import { useMountWrapper } from '__tests__/fixtures/component'

describe('VCard.vue', () => {
    const component = useMountWrapper(VCard)

    beforeEach(component.unmount)

    test('should set card width without unit', () => {
        const wrapper = component.mount({
            props: {
                width: 100,
            },
        })

        const style = wrapper.attributes('style')

        expect(style).toContain('width: 100px')
    })

    test('should set card width with special unit', () => {
        const wrapper = component.mount({
            props: {
                width: '100em',
            },
        })

        const style = wrapper.attributes('style') || ''

        expect(style).toContain('width: 100em')
    })

    test('should set card height without unit', () => {
        const wrapper = component.mount({
            props: {
                height: 100,
            },
        })

        const style = wrapper.attributes('style')

        expect(style).toContain('height: 100px')
    })

    test('should set card height with special unit', () => {
        const wrapper = component.mount({
            props: {
                height: '100em',
            },
        })

        const style = wrapper.attributes('style')

        expect(style).toContain('height: 100em')
    })

    test('should set card color with app colors', () => {
        const wrapper = component.mount({
            props: {
                color: 'accent',
            },
        })

        const classes = wrapper.classes()

        expect(classes).toContain('bg-accent')
    })

    test('should set card color with css hex color', () => {
        const wrapper = component.mount({
            props: {
                color: '#eee',
            },
        })

        const classes = wrapper.classes()
        const style = wrapper.attributes('style')

        expect(classes).toContain('bg-[var(--color)]')
        expect(style).toContain('--color: #eee')
    })

    test('should render router-link when to prop is defined', () => {
        const wrapper = component.mount({
            props: {
                to: '/test',
            },
        })

        expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(true)
    })
})

import { test, expect, describe, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper, MountingOptions } from '@vue/test-utils'

import VCard from './VCard.vue'
import VIcon from './VIcon.vue'

describe('VCard.vue', () => {
    let wrapper: VueWrapper<InstanceType<typeof VCard>>

    function createComponent(options?: MountingOptions<InstanceType<typeof VCard>['$props']>) {
        wrapper = mount(VCard, {
            ...options,
            global: {
                components: {
                    VIcon,
                },
            },
        })
    }

    beforeEach(() => wrapper?.unmount())

    test('should set card width without unit', () => {
        createComponent({
            props: {
                width: 100,
            },
        })

        const style = wrapper.attributes('style')

        expect(style).toContain('width: 100px')
    })

    test('should set card width with special unit', () => {
        createComponent({
            props: {
                width: '100em',
            },
        })

        const style = wrapper.attributes('style') || ''

        expect(style).toContain('width: 100em')
    })

    test('should set card height without unit', () => {
        createComponent({
            props: {
                height: 100,
            },
        })

        const style = wrapper.attributes('style')

        expect(style).toContain('height: 100px')
    })

    test('should set card height with special unit', () => {
        createComponent({
            props: {
                height: '100em',
            },
        })

        const style = wrapper.attributes('style')

        expect(style).toContain('height: 100em')
    })

    test('should set card color with app colors', () => {
        createComponent({
            props: {
                color: 'accent',
            },
        })

        const classes = wrapper.classes()

        expect(classes).toContain('bg-accent')
    })

    test('should set card color with css hex color', () => {
        createComponent({
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
        createComponent({
            props: {
                to: '/test',
            },
        })

        expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(true)
    })
})

import { test, expect, describe, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper, MountingOptions } from '@vue/test-utils'

import VBtn from './VBtn.vue'
import VIcon from './v-icon.vue'

describe('v-btn.vue', () => {
    let wrapper: VueWrapper<InstanceType<typeof VBtn>>

    function createComponent(options?: MountingOptions<InstanceType<typeof VBtn>['$props']>) {
        wrapper = mount(VBtn, {
            ...options,
            global: {
                components: {
                    VIcon,
                },
            },
        })
    }

    beforeEach(() => wrapper?.unmount())

    test('should render a <button>', () => {
        createComponent()

        expect(wrapper.find('button').exists()).toBe(true)
    })

    test('should render a <router-link> when to prop is defined', () => {
        createComponent({
            props: {
                to: '/',
            },
        })

        expect(wrapper.find('router-link-stub').exists()).toBe(true)
    })

    test('should show a <a> element when href props is defined', () => {
        createComponent({
            props: {
                href: 'https://google.com',
            },
        })

        expect(wrapper.find('a').exists()).toBe(true)
    })

    test('should show loading icon when loading props is defined', () => {
        createComponent({
            props: {
                loading: true,
            },
        })

        expect(wrapper.findComponent(VIcon).exists()).toBe(true)
    })

    test.each(['accent', 'info', 'warn', 'danger'])(
        'should render default mode with %s color classes',
        (color) => {
            createComponent({ props: { color } })

            expect(wrapper.classes()).to.include(`bg-${color}`)
            expect(wrapper.classes()).to.include(`hover:bg-${color}/75`)
        }
    )

    test('should render default mode with custom color class', () => {
        createComponent({ props: { color: 'bg-[#eee]' } })

        expect(wrapper.classes()).to.include(`bg-[#eee]`)
    })

    test.each(['#eee', 'rgb(238, 238, 238)', 'hsl(0, 100%, 50%)'])(
        'should render default mode with custom css color %s',
        (color) => {
            createComponent({ props: { color } })

            expect(wrapper.attributes('style')).toBe(`--color: ${color};`)
            expect(wrapper.classes()).to.include('bg-[var(--color)]')
        }
    )

    test.each(['accent', 'info', 'warn', 'danger'])(
        'should render text mode with %s color classes',
        (color) => {
            createComponent({ props: { color, mode: 'text' } })

            expect(wrapper.classes()).to.include(`hover:border-${color}/5`)
            expect(wrapper.classes()).to.include(`hover:bg-${color}/5`)
            expect(wrapper.classes()).to.include(`hover:text-${color}`)
        }
    )

    test('should render text mode with custom color class', () => {
        createComponent({ props: { color: 'text-[#eee]', mode: 'text' } })

        expect(wrapper.classes()).to.include(`text-[#eee]`)
    })

    test.each(['#eee', 'rgb(238, 238, 238)', 'hsl(0, 100%, 50%)'])(
        'should render text mode with custom css color %s',
        (color) => {
            createComponent({ props: { color, mode: 'text' } })

            expect(wrapper.attributes('style')).toBe(`--color: ${color};`)
            expect(wrapper.classes()).to.include('hover:border-[var(--color)]')
            expect(wrapper.classes()).to.include('hover:bg-[var(--color)]')
            expect(wrapper.classes()).to.include('hover:text-[var(--color)]')
        }
    )
})

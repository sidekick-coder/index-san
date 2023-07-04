import { test, expect, describe, afterEach } from 'vitest'

import VBtn from './VBtn.vue'
import VIcon from './VIcon.vue'
import { useMountWrapper } from '__tests__/fixtures/component'

describe('VBtn.vue', () => {
    const component = useMountWrapper(VBtn)

    afterEach(component.unmount)

    test('should render a <button>', () => {
        const wrapper = component.mount()

        expect(wrapper.find('button').exists()).toBe(true)
    })

    test('should render a <router-link> when to prop is defined', () => {
        const wrapper = component.mount({
            props: {
                to: '/',
            },
        })

        expect(wrapper.find('router-link-stub').exists()).toBe(true)
    })

    test('should show a <a> element when href props is defined', () => {
        const wrapper = component.mount({
            props: {
                href: 'https://google.com',
            },
        })

        expect(wrapper.find('a').exists()).toBe(true)
    })

    test('should show loading icon when loading props is defined', () => {
        const wrapper = component.mount({
            props: {
                loading: true,
            },
        })

        expect(wrapper.findComponent(VIcon).exists()).toBe(true)
    })

    test.each(['accent', 'info', 'warn', 'danger'])(
        'should render default mode with %s color classes',
        (color) => {
            const wrapper = component.mount({ props: { color } })

            expect(wrapper.classes()).to.include(`bg-${color}`)
            expect(wrapper.classes()).to.include(`hover:bg-${color}/75`)
        }
    )

    test('should render default mode with custom color class', () => {
        const wrapper = component.mount({ props: { color: 'bg-[#eee]' } })

        expect(wrapper.classes()).to.include(`bg-[#eee]`)
    })

    test.each(['#eee', 'rgb(238, 238, 238)', 'hsl(0, 100%, 50%)'])(
        'should render default mode with custom css color %s',
        (color) => {
            const wrapper = component.mount({ props: { color } })

            expect(wrapper.attributes('style')).toBe(`--color: ${color};`)
            expect(wrapper.classes()).to.include('bg-[var(--color)]')
        }
    )

    test.each(['accent', 'info', 'warn', 'danger'])(
        'should render text mode with %s color classes',
        (color) => {
            const wrapper = component.mount({ props: { color, mode: 'text' } })

            expect(wrapper.classes()).to.include(`hover:border-${color}/5`)
            expect(wrapper.classes()).to.include(`hover:bg-${color}/5`)
            expect(wrapper.classes()).to.include(`hover:text-${color}`)
        }
    )

    test('should render text mode with custom color class', () => {
        const wrapper = component.mount({ props: { color: 'text-[#eee]', mode: 'text' } })

        expect(wrapper.classes()).to.include(`text-[#eee]`)
    })

    test.each(['#eee', 'rgb(238, 238, 238)', 'hsl(0, 100%, 50%)'])(
        'should render text mode with custom css color %s',
        (color) => {
            const wrapper = component.mount({ props: { color, mode: 'text' } })

            expect(wrapper.attributes('style')).toBe(`--color: ${color};`)
            expect(wrapper.classes()).to.include('hover:border-[var(--color)]')
            expect(wrapper.classes()).to.include('hover:bg-[var(--color)]')
            expect(wrapper.classes()).to.include('hover:text-[var(--color)]')
        }
    )
})

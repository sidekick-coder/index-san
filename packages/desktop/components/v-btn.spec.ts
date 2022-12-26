import { test, expect, describe, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VueWrapper, MountingOptions } from '@vue/test-utils'

import VBtn from './v-btn.vue'
import VIcon from './v-icon.vue'

describe('v-btn.vue', () => {
    let wrapper: VueWrapper<InstanceType<typeof VBtn>>

    function createComponent(options?: MountingOptions<InstanceType<typeof VBtn>['$props']>) {
        wrapper = mount(VBtn, {
            ...options,
            global: {
                stubs: {
                    'fa-icon': true,
                },
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

        expect(wrapper.find('router-link').exists()).toBe(true)
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
})

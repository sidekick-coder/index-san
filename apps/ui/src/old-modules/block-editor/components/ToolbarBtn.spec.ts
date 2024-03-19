import { useMountWrapper } from '__tests__/fixtures/component'
import { afterEach, describe, expect, it } from 'vitest'

import { create, key } from '../composables/editor'
import ToolbarBtn from './ToolbarBtn.vue'

describe('ToolbarBtn (unit)', () => {
    const editor = create()
    const component = useMountWrapper(ToolbarBtn, {
        global: {
            provide: {
                [key]: editor,
            },
        },
    })

    afterEach(() => {
        component.unmount()

        editor.clear()
    })

    it('should render button', () => {
        component.mount({
            slots: {
                default: 'Test',
            },
        })

        expect(component.wrapper!.text()).toBe('Test')
    })

    it('should change active styles based on prop', async () => {
        const wrapper = component.mount({
            props: {
                active: true,
            },
        })

        expect(wrapper.classes()).toContain('text-t-primary')

        await wrapper.setProps({ active: false })

        expect(wrapper.classes()).toContain('text-t-secondary')
    })
})

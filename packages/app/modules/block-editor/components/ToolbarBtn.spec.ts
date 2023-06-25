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

    it.todo('should render button')

    it.todo('should change active styles based on prop')
})

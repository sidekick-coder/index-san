import { Component } from 'vue'

export function useBlockStub(): Component {
    return {
        name: 'BlockStub',
        template: `
            <slot />
            <slot name="toolbar" />
            <slot name="dragger" />
        `,
    }
}

export function useVBtnStub(): Component {
    return {
        name: 'VBtnStub',
        template: `
            <slot />
        `,
    }
}

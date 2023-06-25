import { Component } from 'vue'

export function useBlockStub(): Component {
    return {
        name: 'BlockStub',
        template: '<div><slot /></div>',
    }
}

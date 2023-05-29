const key = Symbol('node-editor')

export function create() {
    const setupContext = reactive({})

    return {
        setupContext,
    }
}

export function provideNodeEditor() {
    const state = create()

    provide(key, state)

    return state
}

export function useNodeEditor() {
    return inject(key, create())
}

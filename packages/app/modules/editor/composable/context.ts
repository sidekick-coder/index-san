import { reactive } from 'vue'

const key = Symbol('editor-context')

export function createContext() {
    return reactive({})
}

export function provideContext() {
    const context = createContext()

    provide(key, context)

    return context
}

export function useContext() {
    const context = inject(key)

    if (!context) {
        throw new Error('useContext must be used inside a <Editor /> component')
    }

    return context
}

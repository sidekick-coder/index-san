import * as Vue from 'vue'
import { Lexer } from '@language-kit/lexer'
const key = Symbol('editor-context')

function createComponent(code: string) {
    const fnNames: string[] = []
    const varNames: string[] = []

    const tokens = new Lexer().tokenize(code)

    tokens.forEach((token, index) => {
        const prevToken = tokens[index - 2]

        if (!prevToken) return

        if (prevToken.value === 'function') {
            fnNames.push(token.value)
        }

        if (['const', 'let', 'var'].includes(prevToken.value)) {
            varNames.push(token.value)
        }
    })

    const regex = /import\s*{([^}]+)}\s*from\s*"([^"]+)";/g

    const replacedCode = code.replaceAll(regex, (_, imports, moduleName) => {
        let name = moduleName.split('/')[0]

        if (name === 'vue') {
            name = 'Vue'
        }

        const assignments = imports
            .split(',')
            .map((imp: string) => imp.trim())
            .map((imp: string) => `const { ${imp} } = window.${name};`)
            .join('\n')

        return assignments
    })

    // replace all imports for const

    ;(window as any).Vue = Vue

    const finalCode =
        replacedCode +
        `
        return {
            ${[...fnNames, ...varNames].join(',')}
        }
    `

    const setupFn = new Function(finalCode)

    const component = {
        name: 'SetupRuntime',
        setup: setupFn,
        template: `<div class="hidden"></div>`,
    }

    return {
        sfc: component,
        fnNames,
        varNames,
    }
}

function createMainContext() {
    const methods = ref([] as string[])
    const variables = ref([] as string[])
    const sfc = shallowRef<any>(null)
    const instance = ref<null | ComponentPublicInstance>(null)

    function mount(code: string) {
        const component = createComponent(code)

        sfc.value = component.sfc
        variables.value = component.varNames
        methods.value = component.fnNames
    }

    function setInstance(_instance: ComponentPublicInstance) {
        instance.value = _instance
    }

    return reactive({
        instance,
        sfc,
        mount,
        setInstance,
    })
}

export function useContext() {
    const context = inject(key)

    if (!context) {
        throw new Error('Context not provided')
    }

    return context as ReturnType<typeof createMainContext>
}

export function provideContext() {
    const context = createMainContext()

    provide(key, context)

    return context
}

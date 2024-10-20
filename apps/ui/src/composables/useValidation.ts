import type { Rule } from './useRules'
import type { InjectionKey } from 'vue'

interface ValidationFn {
    (): boolean
}

const key = Symbol('validations') as InjectionKey<Ref<ValidationFn[]>>

export function provideValidation() {
    const validations = ref<ValidationFn[]>([])

    provide(key, validations)

    return validations
}

export function useValidation() {
    const validations = inject(key, null)

    if (!validations) {
        return ref<ValidationFn[]>([])
    }

    return validations
}

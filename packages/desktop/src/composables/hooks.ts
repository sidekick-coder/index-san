import { ref, inject, provide, InjectionKey, Ref } from 'vue'


interface EventListener {
    name: string
    handler: (data?: any) => void
}

interface HooksManager {
    listeners:  Ref<EventListener[]>
    on: (listener: EventListener) => void
    emit: (name: string, data?: any) => void
}

export const key = Symbol('app:hooks') as InjectionKey<HooksManager>

export function provideHooks(){
    const listeners = ref<EventListener[]>([])

    const on: HooksManager['on'] = (listener) => {
        listeners.value.push(listener)
    }
    
    const emit: HooksManager['emit'] = (name, data) => {
        console.debug('hooks', { name, data })
        listeners.value.filter(l => l.name === name && !!l.handler).forEach(l => l.handler(data))
    }

    const state: HooksManager = {
        listeners,
        on,
        emit
    }

    provide(key, state)

    return state
}

export function useHooks(){
    return inject(key, provideHooks())
}
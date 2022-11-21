import { Plugin } from 'vue'

export interface HookEventListener {
    pattern: string | RegExp
    handler: (data?: any) => void
}

export interface HooksManager {
    listeners:  HookEventListener[]
    on: (listener: HookEventListener) => void
    off: (listener: HookEventListener) => void
    emit: (name: string, data?: any) => void
}

const listeners = [] as HookEventListener[]

export function createHookManager(){

    const on: HooksManager['on'] = (listener) => {
        listeners.push(listener)
    }
    
    const off: HooksManager['off'] = (listener) => {
        const index = listeners.findIndex(l => l.pattern === listener.pattern && listener.handler === listener.handler)

        if (index !== -1) {
            listeners.splice(index, 1)
        }

    }
    
    const emit: HooksManager['emit'] = (name, data) => {
        console.debug('hook', name, data)
        
        listeners
            .filter(l => name.match(l.pattern) && !!l.handler)
            .filter(l => !!l.handler)
            .forEach(l => l.handler(data))
    }

    const state: HooksManager = {
        listeners,
        on,
        off,
        emit
    }

    return state
}

const manager = createHookManager()

export function useHooks(){
    return manager
}

const plugin: Plugin = {
    install: () => true
}

export function createHooks(){
    return plugin
}

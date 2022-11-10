import { Plugin } from 'vue'

export interface HookEventListener {
    name: string
    handler: (data?: any) => void
}

export interface HooksManager {
    listeners:  HookEventListener[]
    on: (listener: HookEventListener) => void
    emit: (name: string, data?: any) => void
}

const listeners = [] as HookEventListener[]

export function createHookManager(){

    const on: HooksManager['on'] = (listener) => {
        listeners.push(listener)
    }
    
    const emit: HooksManager['emit'] = (name, data) => {
        console.debug('hooks', { name, data })
        listeners.filter(l => l.name === name && !!l.handler).forEach(l => l.handler(data))
    }

    const state: HooksManager = {
        listeners,
        on,
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

import type { Plugin } from 'vue'
import type { AnyView } from '@modules/view/store'
import Item from '@index-san/core/entities/item'

export interface Events {
    'view:created': { collectionId: string; payload: AnyView }
    'view:updated': { collectionId: string; viewId: string; payload: Partial<AnyView> }
    'view:deleted': { collectionId: string; viewId: string }
    'item:created': { collectionId: string; payload: Item }
    'item:updated': { collectionId: string; itemId: string; payload: Partial<Item> }
    'item:deleted': { collectionId: string; itemId: string }
}
export interface Listener {
    name: keyof Events
    handler: (data?: any) => void
}

export interface HooksManager {
    listeners: Listener[]
    on: (name: string, listener: Listener) => void
    off: (listener: Listener) => void
    emit: (name: string, data?: any) => void
}

const listeners = [] as Listener[]

export function createHookManager() {
    function on<K extends keyof Events>(name: K, handler: (args: Events[K]) => any) {
        listeners.push({ name, handler })
    }

    function off<K extends keyof Events>(name: K, handler: (args: Events[K]) => any) {
        const index = listeners.findIndex((l) => l.name === name && l.handler === handler)

        if (index !== -1) {
            listeners.splice(index, 1)
        }
    }

    function emit<K extends keyof Events>(name: K, args: Events[K]) {
        listeners
            .filter((l) => name === l.name)
            .filter((l) => !!l.handler)
            .forEach((l) => l.handler(args))
    }

    return {
        listeners,
        on,
        off,
        emit,
    }
}

const manager = createHookManager()

export function useHooks() {
    return manager
}

const plugin: Plugin = {
    install: () => true,
}

export function createHooks() {
    return plugin
}

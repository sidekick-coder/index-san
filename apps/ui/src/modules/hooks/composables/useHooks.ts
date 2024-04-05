export interface HookEvents {
    'drive:write': { path: string, content: string }
    'drive:destroy': { path: string }
    'drive:move': { from: string, to: string }
    'drive:mkdir': { path: string }
}

export interface HookListener {
    name: keyof HookEvents
    handler: (data: HookEvents[keyof HookEvents]) => void
}

const listeners: HookListener[] = []

export function onHook<K extends keyof HookEvents>(name: K, handler: (data: HookEvents[K]) => void) {
    listeners.push({ name, handler: handler as any })
}

export function offHook<K extends keyof HookEvents>(name: K, handler: (data: HookEvents[K]) => void) {
    const index = listeners.findIndex(listener => listener.name === name && listener.handler === handler)
    
    if (index !== -1) {
        listeners.splice(index, 1)
    }
}

export function emitHook<K extends keyof HookEvents>(name: K, data: HookEvents[K]) {
    console.debug(`[hook] ${name}`, data)

    listeners
        .filter(listener => listener.name === name)
        .forEach(listener => listener.handler(data))
}

export function useHooks(){
    return {
        on: onHook,
        off: offHook,
        emit: emitHook
    }
}


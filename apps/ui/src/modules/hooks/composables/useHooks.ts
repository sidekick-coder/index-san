import type { Workspace } from "@/composables/workspace"

export interface HookEvents {
	'drive:write': { path: string, content: string }
	'drive:destroy': { path: string }
	'drive:move': { from: string, to: string }
	'drive:mkdir': { path: string },
	'workspace:loaded': { workspace: Workspace }
}

export interface HookListener {
	name: keyof HookEvents
	handler: (data: HookEvents[keyof HookEvents]) => void
}

const listeners: HookListener[] = []
const debug = false

export function onHook<K extends keyof HookEvents>(name: K, handler: (data: HookEvents[K]) => void) {
	if (debug) console.debug(`[hook] subscribe ${name}`, { handler })

	listeners.push({ name, handler: handler as any })
}

export function offHook<K extends keyof HookEvents>(name: K, handler: (data: HookEvents[K]) => void) {
	const index = listeners.findIndex(listener => listener.name === name && listener.handler === handler)

	if (index !== -1) {
		listeners.splice(index, 1)
	}
}

export async function emitHook<K extends keyof HookEvents>(name: K, data: HookEvents[K]) {
	const subscriptions = listeners.filter(l => l.name === name)

	for await (const s of subscriptions) {
		await s.handler(data)
	}

	if (debug) console.debug(`[hook] emit ${name} `, { subscriptions, data })
}

export function useHooks() {
	return {
		on: onHook,
		off: offHook,
		emit: emitHook
	}
}


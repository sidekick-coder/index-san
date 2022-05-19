import { useEventBus } from '@vueuse/core'

type Listener = ReturnType<typeof useEventBus>

export function useObservers() {
  const observers = new Map<string, Listener>()

  function register(name: string) {
    observers.set(name, useEventBus(name))
  }

  function subscribe(name: string, cb: (...args: any[]) => void) {
    const listener = observers.get(name)

    if (!listener) return

    listener.on(cb)
  }

  function notify(name: string, data?: any) {
    const listener = observers.get(name)

    if (!listener) return

    listener.emit(data)
  }

  return { register, subscribe, notify }
}

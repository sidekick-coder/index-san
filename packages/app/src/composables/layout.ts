import throttle from 'lodash/throttle'
import { ref, provide, inject, InjectionKey, Ref } from 'vue'

export interface LayoutItem {
    el: HTMLElement
    width: number
    height: number
    type?: 'top' | 'left' | 'right'
    isVisible: () => boolean
}

interface LayoutState {
    items: LayoutItem[]
    add(item: LayoutItem): void
    remove(item: LayoutItem): void
}

const layoutKey: InjectionKey<Ref<LayoutState>> = Symbol('layout')

function createLayout() {
    return ref<LayoutState>({
        items: [],
        add: () => true,
        remove: () => true,
    })
}

export function provideLayout() {
    const state = createLayout()

    state.value.add = (item) => {
        state.value.items.push(item)

        useResize(item.el, (width, heigh) => {
            item.width = width
            item.height = heigh
        })
    }

    state.value.remove = (item) => {
        const index = state.value.items.indexOf(item as LayoutItem)

        if (index !== -1) {
            state.value.items.splice(index, 1)
        }
    }

    provide(layoutKey, state)

    return state
}

export function useLayout() {
    return inject(layoutKey, createLayout())
}

export function useResize(el: HTMLElement, cb: (width: number, height: number) => void) {
    if (!el) return

    const resize = throttle(() => cb(el.offsetWidth, el.offsetHeight), 100)

    window.addEventListener('resize', resize)
    el.addEventListener('resize', resize)

    return new ResizeObserver(resize).observe(el)
}

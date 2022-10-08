import { ref, inject, provide, InjectionKey, Ref } from 'vue'

interface PageMeta {
    layout: string
    title: string
}

export const key = Symbol('app:page-meta') as InjectionKey<Ref<PageMeta>>

const getState = () => ref<PageMeta>({
    layout: '',
    title: ''
})

export function providePageMeta(){
    const state = getState()

    provide(key, state)

    return state
}

export function usePageMeta(){
    return inject(key, getState())
}

export function definePageMeta(data?: Partial<PageMeta>) {
    const meta = usePageMeta()

    meta.value = Object.assign(meta.value, data)

    return usePageMeta()
}
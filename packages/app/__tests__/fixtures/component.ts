import { ComponentMountingOptions, VueWrapper, mount } from '@vue/test-utils'
import { DefineComponent } from 'vue'
import merge from 'lodash/merge'

export function useMountWrapper<T extends DefineComponent<any, any, any, any, any>>(
    component: T,
    defaultOptions?: ComponentMountingOptions<T>
) {
    const state = {
        wrapper: null as VueWrapper<InstanceType<T>> | null,
        mount: (options?: ComponentMountingOptions<T>) => {
            state.wrapper = mount(component, merge(defaultOptions, options))

            return state.wrapper!
        },
        unmount: () => {
            state.wrapper?.unmount()
        },
    }

    return state
}

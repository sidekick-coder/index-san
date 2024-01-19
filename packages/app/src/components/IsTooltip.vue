<script lang="ts" setup>
import { useFloating, flip, offset, type Placement } from '@floating-ui/vue';
import type { ComponentPublicInstance } from 'vue';

const root = ref<Element | null>(null)
const floating = ref<HTMLElement | null>(null)

const placement = defineProp<Placement>('placement', {
    type: String,
    default: 'bottom',
})

const model = defineModel({
    default: false,
    local: true,
})

const { floatingStyles } = useFloating(root, floating, {
    placement,
    middleware: [flip(), offset(6)],
})

function onRef(el: Element | ComponentPublicInstance | null, refs: Record<string, any>)  {
    if (el instanceof Element) {
        root.value = el
        return
    }

    if (el?.$el) {
        root.value = el.$el
        return
    }
}

function show() {
    model.value = true
}

function hide() {
    model.value = false
}

</script>

<template>
    <slot
        name="activator"
        :attrs="{
            ref: onRef,
            onMouseenter: show,
            onMouseleave: hide
        }" 
    />

    <div ref="floating" :style="floatingStyles">
        <transition
            enter-active-class="transition ease-out duration-100"
            leave-active-class="transition ease-in duration-75"
            enter-from-class="opacity-0 scale-50"
            leave-to-class="opacity-0 scale-50"
        >

            <div
                class="dark:bg-zinc-200 text-sm py-1 px-2 rounded relative"
                v-visible="model"
            >
                <slot  />

                <div
                    class="flex absolute inset-0"
                    :class="[
                        placement === 'top' && 'justify-center items-end',
                        placement === 'bottom' && 'justify-center items-start',
                        placement === 'right' && 'justify-start items-center',
                        placement === 'left' && 'justify-end items-center',               
                    ]"
                >
                    <div
                        class="w-2 h-2 bg-zinc-200 rotate-45"
                        :class="[
                            placement === 'top' && 'translate-y-1/2',
                            placement === 'bottom' && '-translate-y-1/2',
                            placement === 'right' && '-translate-x-1/2',
                            placement === 'left' && 'translate-x-1/2',
                        ]"
                    />
                </div>
                
            </div>
            
        </transition>
        
       
    </div>
</template>

<script lang="ts" setup>
import { useFloating, shift, type Placement } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';
import type { ComponentPublicInstance } from 'vue';

defineOptions({
    inheritAttrs: false,
})

// floating
const root = ref<any>(null)
const floating = ref<HTMLElement | null>(null)

const placement = defineProp<Placement>('placement', {
    type: String,
    default: 'bottom',
})

const { floatingStyles } = useFloating(root, floating, {
    placement,
    middleware: [shift()],
})

function onRef(el: Element | ComponentPublicInstance | null)  {
    if (el instanceof Element) {
        root.value = el
        return
    }

    if (el?.$el) {
        root.value = el.$el
        return
    }
}

// visibility
const model = defineModel({
    type: Boolean,
    default: false,
})

const closeOnContentClick = defineProp<boolean>('closeOnContentClick', {
    type: Boolean,
    default: true,
})

function toggle() {
    model.value = !model.value
}

function onContentClick(){
    if (closeOnContentClick.value) {
        model.value = false
    }

}

onClickOutside(floating, () => {
    model.value = false
}, {
    ignore: [root],
})

</script>

<template>
    <slot
        name="activator"
        :attrs="{
            ref: onRef,
            onClick: toggle,
        }" 
    />

    <div
        ref="floating"
        class="z-20"
        :style="floatingStyles"
        :class="!model ? 'pointer-events-none' : ''"
        @click="onContentClick"
    >
        <transition
            enter-active-class="transition ease-out duration-200"
            leave-active-class="transition ease-in duration-200"
            enter-from-class="opacity-0 translate-y-4"
            leave-to-class="opacity-0 translate-y-4"
        >
            <div v-visible="model">
                <slot />
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { useFloating, shift, type Placement } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';
import type { ComponentPublicInstance } from 'vue';

defineOptions({
    inheritAttrs: false,
})
// activator
const activatorRef = ref<Element | null>(null)
const activatorRects = ref<DOMRect | null>(null)

function setActivatorRects() {
    if (!activatorRef.value) {
        return
    }

    activatorRects.value = activatorRef.value.getBoundingClientRect()
}

watch(activatorRef, setActivatorRects, { immediate: true })

// floating
const contentRef = ref<HTMLElement | null>(null)

const placement = defineProp<Placement>('placement', {
    type: String,
    default: 'bottom',
})

const { floatingStyles } = useFloating(activatorRef, contentRef, {
    placement,
    middleware: [shift()],
})

function onRef(el: Element | ComponentPublicInstance | null)  {
    if (el instanceof Element) {
        activatorRef.value = el
        return
    }

    if (el?.$el) {
        activatorRef.value = el.$el
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

const openOnClick = defineProp<Boolean>('openOnClick', {
    type: Boolean,
    default: true,
})

function onClick() {
    if (openOnClick.value) {
        model.value = true
    }
}

function onContentClick(){
    if (closeOnContentClick.value) {
        model.value = false
    }

}

onClickOutside(contentRef, () => {
    model.value = false
}, {
    ignore: [activatorRef],
})

</script>

<template>
    <slot
        name="activator"
        :attrs="{
            ref: onRef,
            onClick: onClick,
        }" 
    />

    <div
        ref="contentRef"
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
                <slot :activator-rects="activatorRects" />
            </div>
        </transition>
    </div>
</template>

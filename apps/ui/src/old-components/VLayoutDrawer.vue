<script lang="ts">
export default defineComponent({ inheritAttrs: false })
</script>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

// Props & Emits
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: true,
    },
    right: {
        type: Boolean,
        default: false,
    },
    width: {
        type: Number,
        default: 300,
    },
})

const emit = defineEmits(['update:modelValue'])

// transform
const model = useVModel(props, 'modelValue', emit)

const style = computed(() => {
    let transform = 'translateX(0)'
    let width = `${props.width}px`

    if (!model.value) {
        transform = props.right ? 'translateX(200%)' : 'translateX(-100%)'
    }

    if (props.right && !model.value) {
        // width = `0px`
    }

    return {
        transform,
        width,
    }
})
</script>
<template>
    <aside
        class="overflow-hidden h-full transition-transform duration-300 ease-in-out"
        :class="[right ? 'right-0' : 'left-0']"
        :style="style as any"
    >
        <div
            class="w-full overflow-auto"
            v-bind="$attrs"
            :class="$slots.footer ? 'h-[calc(100%-3rem)]' : 'h-full'"
        >
            <slot />
        </div>

        <div v-if="$slots.footer" class="h-12">
            <slot name="footer" />
        </div>
    </aside>
</template>

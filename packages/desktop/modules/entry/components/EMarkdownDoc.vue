<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { markdown } from '../composables/markdown'
import { onErrorCaptured, defineComponent, ref, watch, defineAsyncComponent } from 'vue'

import { useVModel } from '@vueuse/core'
import { useNonReactive } from '@/composables/utils'

// Props & Emits

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
    state: {
        type: Object,
        default: null,
    },
    scope: {
        type: Object,
        default: () => ({}),
    },
    basePath: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:state'])

// create state
const mState = useVModel(props, 'state', emit)
const innerState = ref(useNonReactive(mState.value || {}))

watch(
    innerState,
    (value) => {
        mState.value = useNonReactive(value)
    },
    { deep: true }
)

// render

const components = {
    SChart: defineAsyncComponent(() => import('@/modules/script/components/SChart.vue')),
    EImg: defineAsyncComponent(() => import('@/modules/entry/components/EImg.vue')),
    CTable: defineAsyncComponent(() => import('@/modules/collection/components/CTable.vue')),
    CGallery: defineAsyncComponent(() => import('@/modules/collection/components/CGallery.vue')),
    CViewGroup: defineAsyncComponent(
        () => import('@/modules/collection/components/CViewGroup.vue')
    ),
}

const view = defineComponent({
    components,
    setup: () => ({ ...props.scope, state: innerState }),
    template: markdown.parse(props.content, {
        basePath: props.basePath,
    }),
})

// catch errors
const error = ref<any>()

onErrorCaptured((err) => {
    error.value = err.message

    return false
})
</script>

<template>
    <article class="is-markdown whitespace-pre-line leading-tight">
        <div v-if="error" class="bg-danger/70 rounded px-4 py-2">
            {{ error }}
        </div>
        <component :is="view" v-else />
    </article>
</template>

<style lang="scss">
.is-markdown {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        @apply font-bold;
        @apply my-4 first:mt-0;
    }

    h1 {
        @apply text-2xl;
    }

    h2 {
        @apply text-xl;
    }

    h3 {
        @apply text-lg;
    }

    p {
        @apply my-2;
    }

    pre {
        @apply bg-b-secondary text-sm p-4 rounded my-4;
        @apply overflow-y-auto whitespace-normal;

        code {
            @apply whitespace-pre;
        }
    }

    ul {
        @apply flex flex-wrap py-4 pl-5;

        li {
            @apply w-full mb-2;
            @apply list-disc;
        }
    }
}
</style>

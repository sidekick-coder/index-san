<script lang="ts" setup>
import { MarkdownNodeComponent } from '@language-kit/markdown';
import { computed, ref, shallowRef, watch } from 'vue';

import BlockBase from './BlockBase.vue'

const components = defineProp<any[]>('components', {
    type: Array,
    default: () => ([])
})

const node = defineModel<MarkdownNodeComponent>({
    type: Object,
    required: true,
})

const context = defineProp<any>('context', {
    type: Object,
    default: () => ({})
})

// render
const loading = ref(true)

const current = ref<any>(null)
const instance = shallowRef<any>(null)

const icon = computed(() => {
    if (current.value?.icon) {
        return current.value.icon
    }

    return 'dashicons:editor-code'
})

function setComponent() {
    loading.value = true

    const search = components.value.find(c => c.name === node.value.name)

    if (!search) {
        instance.value = null
        loading.value = false
        return
    }

    current.value = search

    const attrs: string[] = []

    Object.entries(node.value.attrs).forEach(([key, value]) => {

        if (!key || !value) {
            return
        }

        attrs.push(`${key}="${value}"`)
    })

    instance.value = {
        name: 'ComponentProvider',
        components: {
            ComponentRender: search.component,
        },
        template: `<ComponentRender ${attrs.join(' ')} >${node.value.body}</ComponentRender>`,
        setup() {
            return context.value
        }
    }

    setTimeout(() => {
        loading.value = false
    }, 1000)
}

watch(node, setComponent, { immediate: true })


</script>

<template>
    <BlockBase
        :icon="icon"
        :class="loading ? 'animate-pulse' : ''"
        class="relative"
    >
        <component
            :is="instance"
            v-if="instance"
        />

        <div v-else>
            Component not found
        </div>
    </BlockBase>
</template>

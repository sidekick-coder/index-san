<script lang="ts" setup>
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';

import BlockBase from './BlockBase.vue'
import { MarkdownNodeLogicalComponent } from '../markdown/MarkdownNodeLogicalComponent';
import { createCompiler, HecateCompiler } from 'hecate/composables/createCompiler';

const components = defineProp<any[]>('components', {
    type: Array,
    default: () => ([])
})

const node = defineModel<MarkdownNodeLogicalComponent>({
    type: Object,
    required: true,
})

const context = defineProp<any>('context', {
    type: Object,
    default: () => ({})
})

const baseCompiler = defineProp<HecateCompiler>('compiler', {
    type: Object,
    default: null,
})

// render
const loading = ref(true)

const current = ref<any>(null)
const instance = shallowRef<any>(null)
const componentAttrs = reactive({})
const componentSlots = reactive({})

const icon = computed(() => {
    if (current.value?.icon) {
        return current.value.icon
    }

    return 'dashicons:editor-code'
})

async function render(){
    loading.value = true

    const search = components.value.find(c => c.name === node.value.name)

    if (!search) {
        instance.value = null
        loading.value = false
        return
    }
    
    current.value = search

	instance.value = h(search.component, componentAttrs, componentSlots) 

    setTimeout(() => {
        loading.value = false
    }, 1000)
}

async function load(){	
	const compiler = createCompiler({
		importResolvers: [
			...baseCompiler.value.importResolvers,
			{
				test: k => k === 'app:setup',
				resolve: async () => context.value
			},
			{
				test: k => k === 'app:component',
				resolve: async () => ({ attrs: componentAttrs, slots: componentSlots })
			}	

		]
	}) 


	await compiler.compile(`${node.value.body}`)

	render()
}

watch(node, load, { immediate: true })
watch([componentAttrs, componentSlots], render)

// compile

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

        <div v-else-if="loading">
            Loading...
        </div>

        <div v-else>
            Component not found
        </div>
    </BlockBase>
</template>

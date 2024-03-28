<script lang="ts" setup>
import { createDriveImportResolvers } from '@/modules/hecate/composables/createDriveImportResolvers';
import type { MarkdownNodeComponent } from '@language-kit/markdown';
import { createCompiler } from 'hecate/composables/createCompiler';
import BlockBase from 'hephaestus/components/BlockBase.vue'

const node = defineModel<MarkdownNodeComponent>({
    type: Object,
    required: true
})

const loading = ref(false)

const options = ref<any>(null)

// compile
const resolvers = createDriveImportResolvers()

resolvers.push({
    test: path => path === 'app:chart',
    resolve: async () => Promise.resolve({
        useChart: () => options
    })
})

const compiler = createCompiler({
    importResolvers: resolvers,
})

async function setOptions(){
    const code = node.value.body

    const result  = await compiler.compile(code)

    console.log(result)
}

watch(node, setOptions, { immediate: true })
</script>

<template>
    <BlockBase icon="heroicons-solid:chart-pie">
        <is-chart v-model="options" />
    </BlockBase>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import Script from '@core/entities/script'

import { usePageMeta } from '@/composables/page-meta'
import { useCase } from '@/composables/use-case'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
})

const meta = usePageMeta()
const content = ref('')

const output = ref('')

const script = ref<Script>({
    id: '',
    name: 'Script',
    content: ''
})


async function setItem(){
    const { data: scripts } = await useCase('list-scripts', { workspaceId: props.workspaceId })

    const search = scripts.find((s: Script) => s.name === props.name)

    if (!search) return

    script.value = search

    content.value = script.value.content

    meta.value.title = script.value.name
}

async function save() {
    await useCase('update-script', {
        workspaceId: props.workspaceId,
        name: script.value.name,
        content: content.value,
    })

    await setItem()
}

async function execute() {

    if (script.value.content !== content.value) {
        await save()
    }

    await useCase('execute-script', {
        workspaceId: props.workspaceId,
        name: script.value.name,
    }).then(r => output.value = r.data)
}
watch(() => props, setItem, {
    immediate: true,
    deep: true,
})

</script>
<template>
    <div class="h-full w-full">
        <div class="h-[50px] border-b border-b-gray-500 flex justify-end items-center">
            <div class="mr-auto">
                Script Editor
            </div>
            <w-btn
                :disabled="script.content === content"
                class="mr-3 disabled:bg-gray-500"
                color="blue"
                size="sm"
                @click="save"
            >
                Save
            </w-btn>
            <w-btn color="red" size="sm" @click="execute" >Execute</w-btn>
        </div>

        <div class="h-[calc(100%_-_51px)] flex w-full">
            <is-textarea
                v-model="content"
                class="py-5 bg-transparent outline-none"
                :class="output ? 'w-[calc(100%_-_500px)]' : 'w-full' "
                spellcheck="false"
                @keydown.ctrl.s="save"
                @keydown.ctrl.enter="execute"
            />
    
            <div
                v-show="output"
                class="h-full w-[500px] border-l border-zinc-700 p-3"
            >
                <div class="flex">
                    <div class="font-bold text-xl mb-4 mr-auto">Output</div>

                    <is-icon name="times" @click="output = '' " />

                </div>
                
                <div class="whitespace-pre-line bg-gray-700 rounded py-2 px-4 leading-7">
                    {{ output }}
                </div>
            </div>

        </div>

    </div>
</template>
<script setup lang="ts">
import { useDirectoryEntry } from '@/composables/directory-entry'
import { ref } from 'vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
})

const repository = useDirectoryEntry(props.workspaceId)
const root = ref<HTMLTextAreaElement>()
const previewRef = ref<HTMLTextAreaElement>()

const decoder = new TextDecoder('utf-8')

const content = ref('')
const edit = ref(false)
const loading = ref(false)
const previewHeight = ref(100)

async function load(){    
    const contentBuffer = await repository.read(props.path)    
    
    content.value = decoder.decode(contentBuffer)
}

async function setPreview(){
    loading.value = true

    setTimeout(() => loading.value = false, 500)
}

load()

async function save() {

    if (previewRef.value) {
        previewHeight.value  = previewRef.value.clientHeight
    }

    await repository.write(props.path, content.value)

    setPreview()
}


</script>
<template>
    <div class="flex min-h-full w-full">    
        <is-textarea
            v-show="edit"
            ref="root"
            v-model="content"
            class="min-h-full w-6/12 border-r border-zinc-700 bg-transparent outline-none"
            autofocus
            spellcheck
            @keydown.ctrl.s="save"
        />

        <div
            ref="previewRef"
            :class="edit ? 'w-6/12 pl-10' : 'w-full'"
            class="relative"            
            :style="`min-height: ${previewHeight}px`"
        >
            <div class="absolute top-0 right-0 cursor-pointer">
                <i @click="edit = !edit" >
                    <fa-icon icon="pen" />
                </i>
            </div>

            <is-markdown  class="w-full  pb-32" v-if="!loading && content" :content="content" />
        </div>
        
        
    </div>
</template>
<script lang="ts" setup>

import MonacoEditor from './MonacoEditor.vue'
import DirectoryEntryToolbar from '@/modules/directory/components/DirectoryEntryToolbar.vue';

// general
const path = defineProp<string>('path', {
    type: String,
    required: true
})


const language = defineProp<string>('language', {
    type: String,
    default: 'plaintext'
})

const readonly = defineProp<boolean>('readonly', {
    type: String,
    required: false
})

const drive = useWorkspaceDrive() 

// load
const text = ref('')

async function load(){
    const content = await drive.read(path.value)

    if (content) {
        text.value = decode(content)
    }

}

watch(path, load, { immediate: true })

async function save(){
    await drive.write(path.value, text.value)

}
</script>

<template>
    <div class="h-full w-full flex flex-col">
        <DirectoryEntryToolbar :path="path" />
        
        <div class="flex-1">
            <monaco-editor
                v-model="text"
                :language="language"
                :readonly="readonly"
                @keydown.ctrl.s.prevent="save"
            />
        </div>
    </div>
</template>

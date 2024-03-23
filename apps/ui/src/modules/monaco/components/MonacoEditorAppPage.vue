<script lang="ts" setup>

import MonacoEditor from './MonacoEditor.vue'

// general
const path = defineProp<string>('path', {
    type: String,
    required: true
})

const language = defineProp<string>('language', {
    type: String,
    default: 'plaintext'
})

const { drive, encode, decode } = useDrive()

// load
const text = ref('')

async function load(){
    const content = await drive.value.read(path.value)

    if (content) {
        text.value = decode(content)
    }

}

watch(path, load, { immediate: true })

async function save(){
    await drive.value.write(path.value, text.value)

}
</script>

<template>
    <div class="h-dvh">
        <monaco-editor
            v-model="text"
            :language="language"
            @keydown.ctrl.s.prevent="save"
        />
    </div>
</template>

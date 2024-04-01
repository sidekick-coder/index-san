<script lang="ts" setup>
import DirectoryEntryToolbar from '@/modules/directory/components/DirectoryEntryToolbar.vue';

// general
const path = defineProp<string>('path', {
    type: String,
    required: true
})

const { drive, encode, decode } = useDrive()

// load
const src = ref<string>()

async function load(){
    const content = await drive.value.read(path.value)

    if (!content) {
        src.value = undefined
        return
    }


    const base64 = btoa(content.reduce((data, b) => data + String.fromCharCode(b), ''))

    src.value = `data:image/png;base64,${base64}`

}

watch(path, load, { immediate: true })
</script>

<template>
    <div class="h-full flex flex-col">
        <DirectoryEntryToolbar :path="path" />
        
        <div class="flex-1 overflow-auto">
            <img
                v-if="src"
                :src="src"
                class="mx-auto"
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
import DirectoryEntryToolbar from '@/modules/directory/components/DirectoryEntryToolbar.vue';
import { findHandle } from 'drive-fsa';

// general
const path = defineProp<string>('path', {
    type: String,
    required: true
})

// load
const src = ref<string>()
const error = ref<string>()

async function load(){
    const rootHandle = await findCurrentDriveHandle()

    if (!rootHandle) {
        error.value = 'Can not find root handle'
        return
    }

    const handle = await findHandle(rootHandle, path.value)

    if (!handle || handle instanceof FileSystemFileHandle === false) {
        error.value = 'Error reading file'
        return
    }

    const file = await handle.getFile()

    src.value = URL.createObjectURL(file)

}

watch(path, load, { immediate: true })
</script>

<template>
    <div class="h-full flex flex-col">
        <DirectoryEntryToolbar :path="path" />
        
        <div class="flex-1 overflow-auto">
            <div v-if="error">
                {{ error }}
            </div>

            <div
                v-else-if="src"
                class="flex items-center justify-center h-full w-full"
            >
                <video
                    :src="src"
                    controls
                    class="max-w-[80%]"
                    autoplay
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type ChronoObjectCommit from 'chrono/src/entities/ChronoObjectCommit';
import { useChronoStore } from '../store';
import { formatDistanceToNow } from 'date-fns'

// general
const chronoStore = useChronoStore()
const { decode } = useDrive()

const path = defineProp<string>('path', {
    type: String,
    required: true
})

const hash = defineProp<string>('hash', {
    type: String,
    required: true
})


// change history
const current = ref<ChronoObjectCommit>()
const changes = ref<ChronoObjectCommit[]>([])

async function setChanges(){
    if (!await chronoStore.setHasRepository()) return

    changes.value = await chronoStore.app.log(path.value)

    if (hash.value) {
        current.value = changes.value.find(change => change.hash === hash.value)
    }
}

watch(path, setChanges, { immediate: true })

// blob path
const contents = ref<string>()
const blobPath = ref()

function hasExtension(...ext: string[]){
    return ext.some(e => path.value.endsWith(e))
}

async function setBlobPath(){
    if (!current.value) {
        blobPath.value = undefined
        return
    }

    const object = await chronoStore.app.findCommitEntryObject({
        commitHash: current.value.hash,
        path: path.value
    })

    blobPath.value = `.chrono/blobs/${object.blobHash.slice(0, 2)}/${object.blobHash.slice(2)}`
}

async function setContents(){
    if (!current.value) {
        contents.value = ''
        return
    }

    const response = await chronoStore.app.show(path.value, current.value.hash)

    contents.value = response ? decode(response) : ''
}

watch(current, setBlobPath)
watch(current, setContents, { immediate: true })

</script>

<template>
    <div class="flex min-h-full">
        <div class="flex-1">
            <div
                v-if="!blobPath"
                class="p-4 text-center text-body-100"
            >
                No content
            </div>

            <monaco-editor-app-page
                v-else-if="hasExtension('.txt', 'md')"
                :path="blobPath"
                readonly
            />
            
            <hephaestus-editor
                v-else-if="hasExtension('.hph')"
                :path="blobPath"
                readonly
                language="hephaestus"
            />

            <div
                v-else
                class="p-4 text-center text-body-100"
            >
                Can not display content
            </div>
        </div>

        <div class="w-72 border-l border-body-500 min-h-full">
            <is-list-item
                v-for="change in changes"
                :key="change.hash"
                size="none"
                class="px-4 py-4"
                :active="current?.hash === change.hash"
                @click="current = change"
            >
                <div class="w-10">
                    <is-icon
                        name="heroicons:user-circle-solid"
                        size="none"
                        class="text-2xl"
                    />
                </div>

                <div class="flex flex-col flex-1">
                    <div>
                        {{ change.message }}
                    </div>

                    <div class="text-sm text-body-100">
                        {{ formatDistanceToNow(change.date) }}
                    </div>
                </div>
            </is-list-item>
        </div>
    </div>
</template>

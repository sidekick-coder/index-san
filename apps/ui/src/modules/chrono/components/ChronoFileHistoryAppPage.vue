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

// contents
const contents = ref<string>()

async function setContents(){
    if (!current.value) {
        contents.value = ''
        return
    }

    const response = await chronoStore.app.show(path.value, current.value.hash)

    contents.value = response ? decode(response) : ''
}

watch(current, setContents, { immediate: true })

</script>

<template>
    <div class="flex min-h-full">
        <div class="flex-1">
            {{ 
                contents ? contents : 'No content available'
            }}
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

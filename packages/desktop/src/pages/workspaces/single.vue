<script setup lang="ts">
import { computed, watch } from 'vue'
import { useWorkspace } from '@/stores/workspaces'
import { usePageMeta } from '@/composables/page-meta'
    
const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
})


const meta = usePageMeta()

meta.value.layout = 'workspace'

const store = useWorkspace()

const workspace = computed(() => store.all.find(w => w.id === props.workspaceId))

if (!workspace.value) store.setAll()

function load(){
    if (!workspace.value?.name) return

    meta.value.title = workspace.value.name
}

watch(() => props.workspaceId, load, { immediate: true })

</script>
    
<template>
        <div class="h-full w-full flex flex-wrap items-baseline p-10">
            <div class="flex flex-wrap w-full">
                <div class="w-full text-2xl mb-4">
                    <h1>{{ workspace?.name }}</h1>
                </div>
                

                <router-link
                    class="w-full max-w-[500px] bg-gray-700 p-5 rounded mr-2"
                    :to="`/workspaces/${workspaceId}/collections`"
                >
                    Collections
                </router-link>

                <router-link
                    class="w-full max-w-[500px] bg-gray-700 p-5 rounded"
                    :to="`/workspaces/${workspaceId}/entries`"
                >
                    Entries
                </router-link>
            </div>

        </div>
</template>
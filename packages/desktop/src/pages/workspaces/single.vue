<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
    
import { useDirectoryEntry } from '@/composables/directory-entry'
import DirectoryEntry from '@core/entities/directory-entry'
import { useWorkspace } from '@/stores/workspaces'
    
const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
})

const store = useWorkspace()

const workspace = computed(() => store.all.find(w => w.id === props.workspaceId))

if (!workspace.value) store.setAll()

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
                        :to="`/workspaces/${workspaceId}/entry-folder`"
                    >
                        Entries
                    </router-link>
                </div>

            </div>
    </template>
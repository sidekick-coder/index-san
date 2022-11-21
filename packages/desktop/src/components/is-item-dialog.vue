<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const itemId = ref('')
const workspaceId = ref('')
const collectionId = ref('')

const router = useRouter()
const route = useRoute()

const dialog = ref(false)

const show = ref(false)

watch(
    () => route.query,
    (query) => {
        itemId.value = query.itemId as string
        workspaceId.value = query.workspaceId as string
        collectionId.value = query.collectionId as string

        if ([itemId.value, workspaceId.value, collectionId.value].some((i) => !i)) {
            dialog.value = false
            show.value = false
            itemId.value = ''
            workspaceId.value = ''
            collectionId.value = ''
            return
        }

        show.value = true
        dialog.value = true
    }
)

watch(dialog, (v) => {
    if (v) return
    router.push({ query: {} })
})
</script>
<template>
    <is-dialog v-model="dialog">
        <template v-if="show">
            <div>
                <is-item-form
                    :workspace-id="workspaceId"
                    :collection-id="collectionId"
                    :item-id="itemId"
                />
            </div>

            <div class="my-4 bg-gray-600 h-[1px] w-full"></div>

            <is-item-content
                :workspace-id="workspaceId"
                :collection-id="collectionId"
                :item-id="itemId"
                class="h-[40vh]"
            />
        </template>
    </is-dialog>
</template>

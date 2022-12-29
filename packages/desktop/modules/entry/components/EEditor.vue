<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from '@/modules/entry/store'

import MEditor from '@/modules/monaco/components/MEditor.vue'
import DirectoryEntry from '@/../core/entities/directory-entry'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: 'text',
    },
})

// set content
const store = useStore()

const content = ref('')

async function setContent() {
    const bytes = await store.read({
        path: props.path,
    })

    if (!bytes) return

    content.value = DirectoryEntry.decode(bytes)
}

watch(() => props.path, setContent, {
    immediate: true,
})

// update entry

async function save() {
    await store.write({
        data: DirectoryEntry.encode(content.value),
        path: props.path,
    })
}
</script>
<template>
    <v-layout use-percentage>
        <v-layout-toolbar class="border-b border-b-lines">
            <v-container class="-mr-3 flex justify-end w-full">
                <v-btn size="sm" class="mr-2" text @click="setContent">
                    <v-icon name="arrows-rotate" class="mr-2" />
                    {{ $t('reload') }}
                </v-btn>
                <v-btn size="sm" class="mr-2" text @click="save">
                    <v-icon name="save" class="mr-2" />
                    {{ $t('save') }}
                </v-btn>
            </v-container>
        </v-layout-toolbar>

        <v-layout-content>
            <div class="h-full flex">
                <m-editor
                    v-model="content"
                    :language="language"
                    :minimap="false"
                    :padding="{ top: 20 }"
                    line-numbers="off"
                    @keydown.ctrl.s="save"
                />
            </div>
        </v-layout-content>
    </v-layout>
</template>

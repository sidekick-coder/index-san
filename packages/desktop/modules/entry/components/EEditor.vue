<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStore } from '@/modules/entry/store'

import MEditor from '@/modules/monaco/components/MEditor.vue'

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
    const decoder = new TextDecoder('utf-8')

    const contentBuffer = await store.read({
        path: props.path,
    })

    content.value = decoder.decode(contentBuffer)
}

watch(() => props.path, setContent, {
    immediate: true,
})

// update entry

async function save() {
    await store.write({
        data: content.value,
        path: props.path,
    })
}
</script>
<template>
    <w-layout use-percentage>
        <w-toolbar class="border-b border-b-lines">
            <v-container class="-mr-3 flex justify-end w-full">
                <v-btn size="sm" class="mr-2" text @click="setContent">
                    <is-icon name="arrows-rotate" class="mr-2" />
                    {{ $t('reload') }}
                </v-btn>
                <v-btn size="sm" class="mr-2" text @click="save">
                    <is-icon name="save" class="mr-2" />
                    {{ $t('save') }}
                </v-btn>
            </v-container>
        </w-toolbar>

        <w-content>
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
        </w-content>
    </w-layout>
</template>

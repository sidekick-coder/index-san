<script setup lang="ts">
import { useState } from '@/composables/state'
import { ref, watch } from 'vue'
import { useStore } from '@/modules/entry/store'

import EMarkdownDoc from '../components/EMarkdownDoc.vue'
import MEditor from '@/modules/monaco/components/MEditor.vue'
import DirectoryEntry from '@/../core/entities/directory-entry'
import { useRoute } from 'vue-router'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
})

// set preview
const preview = ref({
    el: null as null | InstanceType<typeof EMarkdownDoc>,
    loading: false,
    height: 100,
})

async function setPreview() {
    if (preview.value.el) {
        preview.value.height = preview.value.el.$el.clientHeight
    }

    preview.value.loading = true

    setTimeout(() => (preview.value.loading = false), 800)
}

// set content
const store = useStore()

const content = ref('')

async function setContent() {
    const decoder = new TextDecoder('utf-8')

    const contentBuffer = await store.read({
        path: props.path,
    })

    content.value = decoder.decode(contentBuffer)

    setPreview()
}

watch(() => props.path, setContent, {
    immediate: true,
})

// update entry

const edit = useState('app:markdown:preview', false, {
    localStorage: true,
})

async function save() {
    await store.write({
        data: content.value,
        path: props.path,
    })

    setPreview()
}

// state
const route = useRoute()

const key = `app:markdown:states:${route.path}`

const state = useState(key, {}, { localStorage: true })
</script>
<template>
    <w-layout use-percentage>
        <w-toolbar class="border-b border-b-lines">
            <is-container class="-mr-3 flex justify-end w-full">
                <v-card-title class="mr-auto">
                    {{ DirectoryEntry.basename(path) }}
                </v-card-title>

                <v-btn size="sm" class="mr-2" text @click="setPreview">
                    <is-icon name="arrows-rotate" class="mr-2" />
                    {{ $t('reload') }}
                </v-btn>
                <template v-if="edit">
                    <v-btn size="sm" class="mr-2" text @click="save">
                        <is-icon name="save" class="mr-2" />
                        {{ $t('save') }}
                    </v-btn>
                </template>
                <v-btn size="sm" text @click="edit = !edit">
                    <is-icon :name="!edit ? 'pen' : 'eye'" class="mr-2" />
                    {{ !edit ? $t('editMode') : $t('viewMode') }}
                </v-btn>
            </is-container>
        </w-toolbar>

        <w-content>
            <div class="h-full flex">
                <div v-show="edit" class="min-h-full w-6/12 pl-[calc(40px_-_26px)]">
                    <m-editor
                        v-model="content"
                        language="markdown"
                        :minimap="false"
                        :padding="{ top: 20 }"
                        line-numbers="off"
                        @keydown.ctrl.s="save"
                    />
                </div>

                <div class="pt-5 overflow-auto px-10" :class="[edit ? 'w-6/12' : 'w-full']">
                    <div
                        v-if="preview.loading"
                        :style="`min-height: ${preview.height}px`"
                        class="flex w-full h-full items-center justify-center"
                    >
                        <is-icon
                            name="fa-brands fa-markdown"
                            class="text-[5rem] text-t-secondary animate-pulse"
                        />
                    </div>

                    <e-markdown-doc
                        v-else-if="content"
                        :ref="(r: any) => (preview.el = r)"
                        v-model:state="state"
                        class="w-full pb-32"
                        :content="content"
                        :base-path="DirectoryEntry.dirname(path)"
                    />
                </div>
            </div>
        </w-content>
    </w-layout>
</template>

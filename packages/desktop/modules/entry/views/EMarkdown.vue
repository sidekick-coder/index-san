<script setup lang="ts">
import { useState } from '@/composables/state'
import { ref, watch } from 'vue'
import { useStore } from '@/modules/entry/store'

import EMarkdownDoc from '../components/EMarkdownDoc.vue'
import MEditor from '@/modules/monaco/components/MEditor.vue'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
})

const root = ref<HTMLTextAreaElement>()
const previewRef = ref<HTMLTextAreaElement>()

const content = ref('')
const edit = useState('app:markdown:preview', false, {
    localStorage: true,
})
const loading = ref(false)
const previewHeight = ref(100)

// set content
const store = useStore()
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

async function setPreview() {
    loading.value = true

    setTimeout(() => (loading.value = false), 500)
}

// save entry
async function save() {
    if (previewRef.value) {
        previewHeight.value = previewRef.value.clientHeight
    }

    await store.write({
        data: content.value,
        path: props.path,
    })

    setPreview()
}
</script>
<template>
    <w-layout use-percentage>
        <w-toolbar class="border-b border-b-lines">
            <is-container class="-mr-3 flex justify-end w-full">
                <template v-if="edit">
                    <is-btn size="sm" class="mr-2" text @click="setPreview">
                        <is-icon name="arrows-rotate" class="mr-2" />
                        {{ $t('reload') }}
                    </is-btn>

                    <is-btn size="sm" class="mr-2" text @click="save">
                        <is-icon name="save" class="mr-2" />
                        {{ $t('save') }}
                    </is-btn>
                </template>
                <is-btn size="sm" text @click="edit = !edit">
                    <is-icon :name="!edit ? 'pen' : 'eye'" class="mr-2" />
                    {{ !edit ? $t('editMode') : $t('viewMode') }}
                </is-btn>
            </is-container>
        </w-toolbar>

        <w-content>
            <div class="h-full w-full flex">
                <div v-show="edit" class="min-h-full w-6/12 pl-[calc(40px_-_26px)]">
                    <m-editor
                        ref="root"
                        v-model="content"
                        language="markdown"
                        :minimap="false"
                        :padding="{ top: 20 }"
                        line-numbers="off"
                        @keydown.ctrl.s="save"
                    />
                </div>

                <div
                    ref="previewRef"
                    class="overflow-auto pt-5"
                    :class="edit ? 'w-6/12' : 'w-full'"
                    :style="`min-height: ${previewHeight}px`"
                >
                    <is-container>
                        <e-markdown-doc
                            v-if="!loading && content"
                            class="w-full pb-32"
                            :content="content"
                        />
                    </is-container>
                </div>
            </div>
        </w-content>
    </w-layout>
</template>

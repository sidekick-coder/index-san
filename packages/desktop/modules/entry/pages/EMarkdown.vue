<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { ref, watch, computed, useAttrs, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import DirectoryEntry from '@core/entities/directory-entry'

import { useState } from '@/composables/state'
import { useStore } from '@/modules/entry/store'
import { createBindings } from '@/composables/binding'

import EMarkdownDoc from '../components/EMarkdownDoc.vue'

const MEditor = defineAsyncComponent(() => import('@/modules/monaco/components/MEditor.vue'))

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
    hideActions: {
        type: Boolean,
        default: false,
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

    if (!contentBuffer) return

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
        data: DirectoryEntry.encode(content.value),
        path: props.path,
    })

    setPreview()
}

// state
const route = useRoute()

const key = `app:markdown:states:${route.path}`

const state = useState(key, {}, { localStorage: true })

// define expose

defineExpose({
    edit,
    save,
    setPreview,
})

// bindings

const bindings = computed(() => createBindings(useAttrs(), ['doc']))

// mode
const tm = useI18n()

const mode = useState<'edit' | 'side-by-side' | 'view'>('app:markdown-editor:mode', 'view', {
    localStorage: true,
})

const modeLabels: Record<typeof mode.value, string> = {
    'edit': tm.t('editMode'),
    'side-by-side': tm.t('sideBySide'),
    'view': tm.t('view'),
}
</script>
<template>
    <v-layout :id="path" use-percentage v-bind="bindings.root">
        <v-layout-toolbar v-if="!hideActions" class="border-b border-b-lines">
            <div class="flex pl-6 pr-7 w-full">
                <v-menu offset-y :close-on-content-click="true">
                    <template #activator="{ attrs }">
                        <v-btn v-bind="attrs" class="mr-auto" color="b-primary">
                            {{ modeLabels[mode] }}
                        </v-btn>
                    </template>

                    <v-card color="b-secondary">
                        <v-list-item
                            v-for="(option, name) in modeLabels"
                            :key="option"
                            @click="mode = name"
                        >
                            {{ option }}
                        </v-list-item>
                    </v-card>
                </v-menu>

                <template v-if="['edit', 'side-by-side'].includes(mode)">
                    <v-btn size="sm" text @click="setPreview">
                        <v-icon name="arrows-rotate" />
                    </v-btn>
                    <v-btn size="sm" text @click="save">
                        <v-icon name="save" />
                    </v-btn>
                </template>
            </div>
        </v-layout-toolbar>

        <v-layout-content>
            <div class="h-full flex">
                <div
                    v-if="['edit', 'side-by-side'].includes(mode)"
                    class="min-h-full"
                    :class="[mode === 'side-by-side' ? 'w-6/12 pl-[calc(40px_-_26px)]' : 'w-full']"
                >
                    <m-editor
                        v-model="content"
                        language="markdown"
                        :minimap="false"
                        :padding="{ top: 20 }"
                        line-numbers="off"
                        @keydown.ctrl.s="save"
                    />
                </div>

                <div
                    v-if="['view', 'side-by-side'].includes(mode)"
                    class="pt-5 overflow-auto px-10"
                    :class="[mode === 'side-by-side' ? 'w-6/12' : 'w-full']"
                >
                    <div
                        v-if="preview.loading"
                        :style="`min-height: ${preview.height}px`"
                        class="flex w-full h-full items-center justify-center"
                    >
                        <v-icon
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
                        v-bind="bindings.doc"
                    />
                </div>
            </div>
        </v-layout-content>
    </v-layout>
</template>

<script lang="ts" setup>
import MonacoEditor from '@/modules/monaco/components/MonacoEditor.vue'
import HephaestusEditor from 'hephaestus/components/Editor.vue'

import { createEditor } from 'hephaestus/composables/createEditor'
import { createCompiler, type HecateCompilerImportResolver, type HecateCompilerResult } from 'hecate/composables/createCompiler'
import { createDriveImportResolvers } from '@/modules/hecate/composables/createDriveImportResolvers'
import { createCommonImportResolvers } from '@/modules/hecate/composables/createCommonImportResolvers'

import DirectoryEntryToolbar from '@/modules/directory/components/DirectoryEntryToolbar.vue';
import IsBtn from '@/components/IsBtn.vue'
import EditorLogs from './HephaestusEditorLogs.vue'
import EditorErrors from './HephaestusEditorErrors.vue'
import EditorTextarea from './HephaestusEditorEditTextarea.vue'

import BlockChart from './HephaestusBlockChart.vue'
import type { MarkdownNodeComponent } from '@language-kit/markdown'

// general
const tm = useI18n()
const { drive: _drive, decode } = useDrive();
const drive = unref(_drive);

// entry
const path = defineProp<string>('path', {
    type: String,
    required: true
})

const contents = ref<Uint8Array>()

async function load(){
    const response = await drive.read(path.value)

    if (response) {
        contents.value = response
    }
}

watch(path, load, { immediate: true })

// mode
const loadingMode = ref(false)
const mode = useLocalStorage<'text' | 'blocks' | 'split'>('hephaestus-editor:mode', 'text')

const modes = [
    {
        id: 'split' as const,
        label: tm.t('split'),
        icon: 'heroicons-solid:arrows-expand',
    },
    {
        id: 'blocks' as const,
        label: tm.t('block'),
        icon: 'heroicons:cube-solid',
    },
    {
        id: 'text' as const,
        label: tm.t('text'),
        icon: 'heroicons-solid:document-text',
    },
]

function setMode(value: 'text' | 'blocks' | 'split'){
    loadingMode.value = true

    mode.value = value

    setTimeout(() => {
        loadingMode.value = false
    }, 500)
}

// editor
const saving = ref(false)
const text = ref('')

const { nodes, setNodes } = createEditor()

async function save(){
    saving.value = true

    await drive.write(path.value, text.value)

    setTimeout(() => {
        saving.value = false
    }, 500)
}

async function saveText(){
    await save()

    setNodes(text.value)
}

function setTextByContents(){
    if (contents.value) {
        text.value = decode(contents.value).replace(/\r\n/g, '\n')

        setNodes(text.value)
    }
}

function setTextByNodes(){
    text.value = nodes.value.map(n => n.toText()).join('')

    save()
}

watch(contents, setTextByContents)
watch(nodes, setTextByNodes)

// components & blocks
const blocks = [
    {
        test: (node: MarkdownNodeComponent) => node.is('Component') && node.name === 'chart',
        component: BlockChart,
    }
]

const editorComponents = [
    {
        name: 'button',
        component: IsBtn,
        icon: 'heroicons-solid:academic-cap',
    }
]

// logs & errors
const errors = ref<Error[]>([])
const logs = ref<string[]>([])

// compiler
const importResolvers = [
    ...createCommonImportResolvers(),
    ...createDriveImportResolvers({ fromEntryPath: path.value })
]

const logger = {
    log: (...args: string[]) => logs.value.push(args.join(' ')),
}

const compiler = createCompiler({
    importResolvers,
    logger
})

// save


</script>

<template>
    <div class="flex flex-col h-full">
        <DirectoryEntryToolbar :path="path">
            <template #append-controls>
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-8 w-8"
                    @click="load"
                >
                    <is-icon name="heroicons:arrow-path-solid" />
                </is-btn>
            </template>

            <template #right>
                <div class="flex -mr-2 items-center">
                    <editor-logs :logs="logs" />
                    <editor-errors :errors="errors" />
                </div>
            </template>
        </DirectoryEntryToolbar>

        <div class="flex h-[calc(100%-2rem-3rem)]">
            <div
                v-if="loadingMode"
                class="flex items-center justify-center size-full"
            >
                <is-icon
                    name="heroicons-solid:refresh"
                    class="animate-spin "
                />
            </div>

            <template v-else>
                <div
                    v-if="mode === 'text' || mode === 'split'"
                    class="flex-1 border-r border-body-500"
                >
                    <MonacoEditor
                        v-model="text"
                        language="hephaestus"
                        hide-line-numbers
                        @keydown.ctrl.s.prevent="saveText"
                    />
                </div>
            
                <div
                    v-if="mode === 'blocks' || mode === 'split'"
                    class="flex-1 max-w-full"
                >
                    <HephaestusEditor
                        v-model="nodes"
                        v-model:errors="errors"
                        v-model:logs="logs"
                        :components="editorComponents"
                        :compiler="compiler"
                        :blocks="blocks"
                        :edit-textarea-component="EditorTextarea"
                    />
                </div>
            </template>
        </div>

        
        <div class="h-8 bg-body-900 w-full flex text-xs z-10">
            <div
                v-for="m in modes"
                :key="m.id"
                class="px-2 hover:bg-body-800 cursor-pointer flex items-center"
                :class="mode === m.id ? 'text-primary-500' : ''"
                @click="setMode(m.id)"
            >
                <is-icon
                    :name="m.icon"
                    class="mr-2"
                />

                {{ m.label }}
            </div>

            <div class="flex-1" />

            <div
                v-if="saving"
                class="px-2 flex items-center "
            >
                <div class="mr-2">
                    {{ $t('saving') }}
                </div>

                <is-icon
                    name="heroicons-solid:refresh"
                    class="animate-spin text-xs"
                />
            </div>
        </div>
    </div>
</template>
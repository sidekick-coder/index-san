<script lang="ts" setup>
import MonacoEditor from '@/modules/monaco/components/MonacoEditor.vue'
import HephaestusEditor from 'hephaestus/components/Editor.vue'

import { createEditor } from 'hephaestus/composables/createEditor'
import { createCompiler, type HecateCompilerResult } from 'hecate/composables/createCompiler'

import IsBtn from '@/components/IsBtn.vue'
import EditorLogs from './HephaestusEditorLogs.vue'
import EditorErrors from './HephaestusEditorErrors.vue'
import { createDriveImportResolvers } from '@/modules/hecate/composables/createDriveImportResolvers'

import BlockChart from './HephaestusBlockChart.vue'
import type { MarkdownNodeComponent } from '@language-kit/markdown'

// general
const tm = useI18n()
const { drive, decode } = useDrive()

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
        icon: 'heroicons-solid:cube',
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

// compiler
const driveResolvers = createDriveImportResolvers({
    fromEntryPath: path.value,
})

const compiler = createCompiler({
    importResolvers: [
        ...driveResolvers,
    ]
})

// editor
const saving = ref(false)

const blocks = [
    {
        test: (node: MarkdownNodeComponent) => node.is('Component') && node.name === 'chart',
        component: BlockChart,
    }
]

const errors = ref<Error[]>([])
const logs = ref<string[]>([])
const { text, nodes, setNodes } = createEditor()

const editorComponents = [
    {
        name: 'button',
        component: IsBtn,
        icon: 'heroicons-solid:academic-cap',
    }
]

function setEditorText(){
    if (contents.value) {
        text.value = decode(contents.value)

        setNodes()
    }
}

async function save(){
    saving.value = true

    await drive.write(path.value, text.value)

    setNodes()

    setTimeout(() => {
        saving.value = false
    }, 500)
}

watch(contents, setEditorText)
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="h-16 border-b border-body-500 flex items-center px-10 gap-x-5">
            <div class="-ml-3">
                <is-btn
                    variant="text"
                    color="primary"
                    size="none"
                    class="h-10 w-10"                    
                    to="/entries"
                >
                    <is-icon name="heroicons-solid:home" />
                </is-btn>
            </div>

            <div class="flex-1">
                <div
                    class="text-sm h-10 bg-body-500 w-full px-4 py-2 outline-none rounded flex items-center gap-x-2 text-body-100"
                >
                    <is-icon name="heroicons-solid:computer-desktop" />

                    {{ `/${path}` }}
                </div>  
            </div>

            <div class="flex-1" />

            <div class="flex">
                <editor-logs :logs="logs" />
                <editor-errors :errors="errors" />
            </div>
        </div>

        <div class="flex h-[calc(100%-2rem-4rem)]">
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
                        @keydown.ctrl.s.prevent="save"
                    />
                </div>
            
                <div
                    v-if="mode === 'blocks' || mode === 'split'"
                    class="flex-1"
                >
                    <HephaestusEditor
                        v-model="nodes"
                        v-model:errors="errors"
                        v-model:logs="logs"
                        :components="editorComponents"
                        :compiler="compiler"
                        :blocks="blocks"
                    />
                </div>
            </template>
        </div>

        
        <div class="h-8 bg-body-900 w-full flex text-xs">
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
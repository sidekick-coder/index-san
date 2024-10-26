<script lang="ts" setup>
import MonacoEditor from '@/modules/monaco/components/MonacoEditor.vue'
import HephaestusEditor from 'hephaestus/components/Editor.vue'

import { createEditor } from 'hephaestus/composables/createEditor'
import { createCompiler } from 'hecate/composables/createCompiler'

import DirectoryEntryToolbar from '@/modules/directory/components/DirectoryEntryToolbar.vue';
import IsBtn from '@/components/IsBtn.vue'
import IsChart from '@/components/IsChart.vue'
import EditorLogs from './HephaestusEditorLogs.vue'
import EditorErrors from './HephaestusEditorErrors.vue'
import EditorTextarea from './HephaestusEditorEditTextarea.vue'

import { useGlobalResolvers } from '@/modules/hecate/composables/global-resolvers'

// general
const tm = useI18n()
const drive = useWorkspaceDrive() 

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
const readonly = defineProp<boolean>('readonly', {
    type: Boolean,
    default: false
})

const saving = ref(false)
const original = ref('')
const text = ref('')


const { nodes, setNodes } = createEditor()

async function save(){
    if (text.value === original.value || readonly.value) return

    saving.value = true

    await drive.write(path.value, text.value)

    original.value = text.value

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
        original.value = text.value

        setNodes(text.value)
    }
}

function setTextByNodes(){
    text.value = nodes.value.map(n => n.toText()).join('')
}

watch(contents, setTextByContents)
watch(nodes, setTextByNodes)

const editorComponents: any[] = [
    {
        name: 'button',
        component: IsBtn,
        icon: 'heroicons:cursor-arrow-rays-solid',
    },
    {
        name: 'chart',
        component: IsChart,
        icon: 'heroicons:chart-pie-solid',
    }
]

editorComponents.push(...usePluginComponents())

// logs & errors
const errors = ref<Error[]>([])
const logs = ref<string[]>([])

// compiler

const importResolvers = useGlobalResolvers({
	extend: []
})

const logger = {
    log: (...args: string[]) => logs.value.push(...args),
}

const compiler = createCompiler({
    importResolvers,
    logger
})
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
                    class="w-6/12 border-r border-body-500"
                >
                    <MonacoEditor
                        v-model="text"
                        language="hephaestus"
                        hide-line-numbers
                        :readonly="readonly"
                        @keydown.ctrl.s.prevent="saveText"
                    />
                </div>
            
                <div
                    v-if="mode === 'blocks' || mode === 'split'"
                    class="w-6/12"
                >
                    <HephaestusEditor
                        v-model="nodes"
                        v-model:errors="errors"
                        v-model:logs="logs"
                        :components="editorComponents"
                        :compiler="compiler"
                        :edit-textarea-component="EditorTextarea"
                        :readonly="readonly"
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

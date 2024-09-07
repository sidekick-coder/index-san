<script lang="ts" setup>
import MonacoEditor from '@/modules/monaco/components/MonacoEditor.vue'
import HephaestusEditor from 'hephaestus/components/Editor.vue'

import { createEditor } from 'hephaestus/composables/createEditor'
import { createCompiler } from 'hecate/composables/createCompiler'

import IsBtn from '@/components/IsBtn.vue'
import IsChart from '@/components/IsChart.vue'
import EditorTextarea from '@/modules/hephaestus/components/HephaestusEditorEditTextarea.vue'

import { useGlobalResolvers } from '@/modules/hecate/composables/global-resolvers'

// general
const tm = useI18n()

// sample list
const files = import.meta.glob('@/modules/hephaestus/samples/*.hph', {
	eager: true,
	as: 'raw'
})

const samples: Record<string, string> = {}

Object.entries(files).forEach(([filename, content]) => {
	const name = filename.split('/').pop()!
	

	samples[name] = content
})

const selected = useRouteQuery<string>('sample', 'intro.hph')
const hideSidebar = useRouteQuery<boolean>('hide-sidebar', false)

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
const text = ref()

const { nodes, setNodes } = createEditor()

async function saveText(){
    setNodes(text.value)
}

function setTextByNodes(){
    text.value = nodes.value.map(n => n.toText()).join('')
}

function setText(){

	text.value = samples[selected.value] || ''

	setNodes(text.value)
}

watch(nodes, setTextByNodes)
watch(selected, setText, { immediate: true })

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
    <div class="flex h-dvh w-dvw">
        <div
            v-if="!hideSidebar"
            class="w-80 bg-body-800 border-r border-body-500"
        >
            <is-list-item
                class="border-b border-body-500"
                to="/workspace-selector"
            >
                <is-logo class="size-5" />

                <h1 class="text- font-bold ml-2">
                    Index-san
                </h1>
            </is-list-item>

            <is-list-item
                v-for="s in Object.keys(samples)"
                :key="s"
                class="px-4 items-center group text-body-100"
                :active="selected === s"
                @click="selected = s"
            >
                <div class="w-4">
                    <is-icon
                        name="heroicons:document-solid"
                        size="lg"
                    />
                </div>

                <div class="ml-4 font-bold truncate">
                    {{ s }}
                </div>
            </is-list-item>
        </div>
        <div class="flex flex-col h-full flex-1 bg-body-700">
            <div class="flex h-full">
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
            </div>
        </div>
    </div>
</template>

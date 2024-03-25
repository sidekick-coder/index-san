<script lang="ts" setup>
import MonacoEditor from '@/modules/monaco/components/MonacoEditor.vue'
import HephaestusEditor from 'hephaestus/components/Editor.vue'
import { createEditor } from 'hephaestus/composables/createEditor'

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

// editor
const saving = ref(false)
const { text, nodes } = createEditor()

function setEditorText(){
    if (contents.value) {
        text.value = decode(contents.value)
    }
}

async function save(){
    saving.value = true

    await drive.write(path.value, text.value)

    setTimeout(() => {
        saving.value = false
    }, 500)
}

watch(contents, setEditorText)
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="flex h-[calc(100%-2rem)]">
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
                    <HephaestusEditor v-model="nodes" />
                </div>
            </template>
        </div>

        <div class="w-full">
            <div class="h-8 bg-body-900 w-full flex text-xs">
                <div
                    v-for="m in modes"
                    :key="m.id"
                    class="px-2 hover:bg-body-800 cursor-pointer flex items-center"
                    :class="mode === m.id ? 'text-primary-800' : ''"
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
    </div>
</template>
<script setup lang="ts">
import { Parser } from '@language-kit/markdown'
import { NodeWithId } from '../types/node'

import MonacoEditor from '../../monaco/components/MEditor.vue'
import NodeEditor from './NodeEditor.vue'
import MDCEditor from './MDCEditor.vue'
import { useLocalStorage, useMagicKeys, whenever } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { findCircularItem } from '@composables/utils'

const model = defineModel({
    type: String,
    default: '',
})

const parser = new Parser()

const text = ref('')
const nodes = ref<NodeWithId[]>([])

function mountNodes(value: string) {
    return parser.toNodes(value).map((n) => new NodeWithId(n))
}

function load() {
    nodes.value = mountNodes(model.value)

    text.value = model.value
}

function updateText(value: string) {
    text.value = value

    nodes.value = mountNodes(value)

    model.value = value
}

function onChangeNodes() {
    text.value = nodes.value.map((n) => n.toText()).join('')

    model.value = text.value
}

onMounted(load)

// mode
const tm = useI18n()
const mode = useLocalStorage<'block' | 'split' | 'text'>('editor:mode', 'split')

const modes = [
    {
        id: 'split' as const,
        label: tm.t('split'),
        icon: 'table-columns',
    },
    {
        id: 'block' as const,
        label: tm.t('block'),
        icon: 'cube',
    },
    {
        id: 'text' as const,
        label: tm.t('text'),
        icon: 'material-symbols:text-fields',
    },
]

const keys = useMagicKeys()

whenever(keys.Alt_m, () => {
    const index = modes.findIndex((m) => m.id === mode.value)

    if (index === -1) return

    const item = findCircularItem(modes, index - 1)

    mode.value = item.id
})
</script>
<template>
    <div class="flex flex-wrap h-full w-full">
        <div class="h-[calc(100%-32px)] w-full">
            <transition
                enter-active-class="transition duration-200"
                leave-active-class="transition duration-200"
                enter-from-class="opacity-0 translate-x-2 absolute"
                leave-to-class="opacity-0 translate-x-2 absolute"
            >
                <div v-if="mode === 'split'" class="w-full h-full flex flex-wrap">
                    <div class="h-full w-6/12">
                        <MDCEditor v-model="text" @keydown.ctrl.s="updateText(text)" />
                    </div>

                    <div class="h-full w-6/12 border-l border-b-secondary/25">
                        <NodeEditor v-model="nodes" @change="onChangeNodes" />
                    </div>
                </div>

                <NodeEditor v-else-if="mode === 'block'" v-model="nodes" @change="onChangeNodes" />

                <MDCEditor v-else v-model="text" @keydown.ctrl.s="updateText(text)" />
            </transition>
        </div>

        <div class="h-8 border-t border-lines w-full flex text-xs">
            <div
                v-for="m in modes"
                :key="m.id"
                class="px-2 hover:bg-b-secondary cursor-pointer flex items-center"
                @click="mode = m.id"
            >
                <v-icon :name="m.icon" class="mr-2" />

                {{ m.label }}
            </div>
        </div>
    </div>
</template>

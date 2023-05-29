<script setup lang="ts">
import * as Vue from 'vue'

import { waitFor } from '@composables/utils'
import { useContext } from '../composable/context'
import { Node as MarkdownNode, NodeType } from '@language-kit/markdown'
import { useEvaluation } from '@modules/evaluation/composables/use-evaluation'
import { createParser } from '@modules/evaluation/parser/parser'
import { useNodeHelper } from '@modules/evaluation/helpers/node-helper'
import npmResolver from '@modules/evaluation/resolvers/npm'
import { useMagicKeys, whenever } from '@vueuse/core'
import MonacoEditor from '../../monaco/components/MEditor.vue'
import { NodeWithId } from '../types/node'
import { useNodeEditor } from '../composable/node-editor'

const model = defineModel({
    type: Object as PropType<NodeWithId>,
    required: true,
})

const editor = useNodeEditor()

const evaluation = useEvaluation()
const parser = createParser()
const nodeHelper = useNodeHelper()

evaluation.addResolver({
    test: (id) => id === 'vue',
    resolve: () => Promise.resolve(Vue),
})

evaluation.addResolver(npmResolver)

async function load() {
    if (editor.setupIsLoading) {
        await editor.onLoadedContext()
    }

    if (!model.value.isComponent()) return

    editor.setupIsLoading = true

    const nodes = parser.toNodes(model.value.body)

    const toExportNames = [] as string[]

    nodes.forEach((node) => {
        if (nodeHelper.isVariable(node) || nodeHelper.isFunction(node)) {
            toExportNames.push(node.name)
        }
    })

    let preparedCode = nodeHelper.toString(nodes)

    preparedCode += '\n\n'

    preparedCode += toExportNames.map((n) => `export const ${n} = ${n}`).join('\n')

    const result = await evaluation.run(preparedCode)

    Object.assign(editor.setupContext, result)

    editor.setupIsLoading = false
}

watch(() => model.value, load, {
    immediate: true,
})

// edit

const dialog = ref(false)
const text = ref('')

const keys = useMagicKeys()

function save() {
    const payload = [':: setup', text.value, '', '::', ''].join('\n')

    const tokens = parser.toTokens(payload)

    // remove eof
    tokens.pop()

    const node = new NodeWithId(model.value.id, {
        ...model.value,
        tokens,
    })

    if (node.isComponent()) {
        node.name = 'setup'
        node.body = text.value
    }

    model.value = node

    dialog.value = false

    load()
}

whenever(keys.Alt_S, () => {
    dialog.value = !dialog.value
})

watch(dialog, (v) => {
    if (!v) return

    text.value = model.value.isComponent() ? model.value.body : ''
})
</script>

<template>
    <v-dialog v-model="dialog">
        <v-card width="800" height="500" color="b-secondary">
            <v-card-head padding>
                <v-card-title>
                    {{ $t('editEntity', [$t('block')]) }}
                </v-card-title>

                <div class="ml-auto flex gap-x-4">
                    <v-btn color="danger" @click="dialog = false">
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn @click="save">
                        {{ $t('save') }}
                    </v-btn>
                </div>
            </v-card-head>
            <MonacoEditor v-model="text" language="javascript" autofocus />
        </v-card>
    </v-dialog>
</template>

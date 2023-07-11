<script setup lang="ts">
import { ref } from 'vue'

import EvaluationOutput from '@index-san/core/entities/evaluation-output'

import EEditor from '../components/EEditor.vue'
import MEditor from '@modules/monaco/components/MEditor.vue'
import SOutput from '@modules/script/components/SOutput.vue'
import { mount as lib } from '@modules/monaco/libs/script'

import { useStore } from '@store/global'

defineProps({
    path: {
        type: String,
        required: true,
    },
})

const store = useStore()

const content = ref('')

const loading = ref(false)
const output = ref<EvaluationOutput>()

async function execute() {
    loading.value = true

    await store.script
        .execute({
            content: content.value,
        })
        .then((r) => (output.value = r as any))
        .catch(() => (output.value = undefined))
        .finally(() => setTimeout(() => (loading.value = false), 500))
}

const editorRef = ref<InstanceType<typeof EEditor>>()

function save() {
    if (!editorRef.value) return

    editorRef.value.save()
}
</script>
<template>
    <e-editor ref="editorRef" v-model="content" :path="path" language="javascript">
        <template #prepend-actions>
            <v-btn size="sm" mode="text" :loading="loading" @click="execute">
                <v-icon name="play" />
            </v-btn>
        </template>

        <template #editor>
            <v-layout use-percentage>
                <v-layout-content>
                    <div class="h-full flex">
                        <m-editor
                            v-model="content"
                            language="typescript"
                            :minimap="false"
                            :padding="{ top: 20 }"
                            :libs="lib()"
                            @keydown.ctrl.s="save"
                            @keydown.ctrl.e="execute"
                        />
                    </div>
                </v-layout-content>

                <v-layout-drawer
                    :width="500"
                    :model-value="!!output"
                    right
                    class="border-l border-lines"
                >
                    <s-output :output="output" />
                </v-layout-drawer>
            </v-layout>
        </template>
    </e-editor>
</template>

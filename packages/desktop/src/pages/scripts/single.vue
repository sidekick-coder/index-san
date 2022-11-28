<script setup lang="ts">
import { ref, watch } from 'vue'

import Script from '@core/entities/script'

import { usePageMeta } from '@/composables/page-meta'
import { useCase } from '@/composables/use-case'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
})

const meta = usePageMeta()
const content = ref('')

const output = ref('')

const script = ref<Script>({
    id: '',
    name: 'Script',
    content: '',
})

// load script
async function setItem() {
    const { data: scripts } = await useCase('list-scripts', { workspaceId: props.workspaceId })

    const search = scripts.find((s: Script) => s.name === props.name)

    if (!search) return

    script.value = search

    content.value = script.value.content

    meta.value.title = script.value.name
}

watch(() => props, setItem, {
    immediate: true,
    deep: true,
})

// save
async function save() {
    await useCase('update-script', {
        workspaceId: props.workspaceId,
        name: script.value.name,
        content: content.value,
    })

    await setItem()
}

// execute

const execution = ref({
    loading: false,
})

async function execute() {
    if (script.value.content !== content.value) {
        await save()
    }

    execution.value.loading = true

    const data = {
        workspaceId: props.workspaceId,
        name: script.value.name,
    }

    await useCase('execute-script', data)
        .then((r) => (output.value = r.data))
        .finally(() => {
            execution.value.loading = false
        })
}
</script>
<template>
    <w-layout use-percentage>
        <w-toolbar class="border-b border-lines">
            <is-container>
                <div class="grow" />

                <is-btn
                    :disabled="script.content === content"
                    class="mr-3 disabled:bg-lines"
                    color="info"
                    size="sm"
                    @click="save"
                >
                    Save
                </is-btn>

                <is-btn color="accent" size="sm" :loading="execution.loading" @click="execute">
                    {{ $t('execute') }}
                </is-btn>
            </is-container>
        </w-toolbar>

        <w-content>
            <w-layout use-percentage>
                <w-content>
                    <is-code-editor v-model="content" @keydown.ctrl.s="save" />
                </w-content>
                <w-drawer :model-value="!!output" right :width="400" class="border-l border-lines">
                    <is-card color="b-secondary" class="h-full">
                        <is-card-head class="flex items-center">
                            <div class="font-bold text-xl mr-auto">Output</div>

                            <is-btn text @click="output = ''">
                                <is-icon name="times" />
                            </is-btn>
                        </is-card-head>

                        <is-code-editor readonly :model-value="output" language="bash" />
                    </is-card>
                </w-drawer>
            </w-layout>
        </w-content>
    </w-layout>
</template>

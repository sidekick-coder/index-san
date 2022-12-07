<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Script from '@core/entities/script'

import { useMeta } from '@/composables/metas'
import { useStore } from '@/modules/script/store'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const meta = useMeta()
const content = ref('')

const script = ref<Script>({
    id: '',
    name: 'Script',
    content: '',
})

// set script
const store = useStore()

async function setItem() {
    const search = store.scripts.find((s: Script) => s.id === props.id)

    if (!search) return

    script.value = search

    content.value = script.value.content

    meta.value.title = script.value.name
}

watch(() => props.id, setItem, {
    immediate: true,
})

// save
async function save() {
    await store.update({
        content: content.value,
        name: script.value.name,
    })

    setItem()
}

// execute

const execution = ref({
    loading: false,
    logs: [],
    error: null as null | any,
    result: null as null | any,
})

const output = computed(() => {
    const result: string[] = []

    if (execution.value.logs.length) {
        result.push('[logs]')
        result.push(...execution.value.logs)
    }

    if (execution.value.error) {
        result.push('[error]')
        result.push(execution.value.error)
    }

    if (execution.value.result) {
        result.push('[result]')

        result.push(JSON.stringify(execution.value.result, null, 4))
    }

    return result.join('\n')
})

function reset() {
    execution.value.logs = []
    execution.value.error = null
    execution.value.result = null
}

async function execute() {
    execution.value.loading = true

    reset()

    await store
        .execute({ content: script.value.content })
        .then((r) => {
            execution.value.logs = r.logs
            execution.value.error = r.error
            execution.value.result = r.result
        })
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
                    <is-code-editor
                        v-model="content"
                        @keydown.ctrl.s="save"
                        @keyup.ctrl.e="execute"
                    />
                </w-content>
                <w-drawer :model-value="!!output" right :width="500" class="border-l border-lines">
                    <is-card color="b-secondary" class="h-full">
                        <is-card-head class="flex items-center">
                            <div class="font-bold text-xl mr-auto">Output</div>

                            <is-btn text @click="reset">
                                <is-icon name="times" />
                            </is-btn>
                        </is-card-head>

                        <is-code-editor readonly :model-value="output" language="shell" />
                    </is-card>
                </w-drawer>
            </w-layout>
        </w-content>
    </w-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useStore } from '@modules/entry/store'

import MEditor from '@modules/monaco/components/MEditor.vue'
import DirectoryEntry from '@core/entities/directory-entry'
import { useVModel } from 'vue-wind/composables/v-model'

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
    path: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: 'text',
    },
})

const emit = defineEmits(['update:modelValue'])

// set content
const store = useStore()

const model = useVModel(props, 'modelValue', emit)

const innerContent = ref('')

const content = computed({
    get() {
        if (model.value !== null) {
            return model.value
        }

        return innerContent.value
    },
    set(value) {
        if (model.value !== null) {
            model.value = value
            return
        }

        innerContent.value = value
    },
})

async function setContent() {
    const bytes = await store.read({
        path: props.path,
    })

    if (!bytes) return

    content.value = DirectoryEntry.decode(bytes)
}

watch(() => props.path, setContent, {
    immediate: true,
})

// update entry

async function save() {
    await store.write({
        data: DirectoryEntry.encode(content.value),
        path: props.path,
    })
}

defineExpose({ save })
</script>
<template>
    <v-layout use-percentage>
        <v-layout-toolbar class="border-b border-b-lines">
            <div class="px-7 flex justify-end w-full">
                <slot name="prepend-actions" />

                <v-btn size="sm" mode="text" @click="setContent">
                    <v-icon name="arrows-rotate" />
                </v-btn>

                <v-btn size="sm" mode="text" @click="save">
                    <v-icon name="save" />
                </v-btn>
            </div>
        </v-layout-toolbar>

        <v-layout-content>
            <slot name="editor" s>
                <div class="h-full flex">
                    <m-editor
                        v-model="content"
                        :language="language"
                        :minimap="false"
                        :padding="{ top: 20 }"
                        line-numbers="off"
                        @keydown.ctrl.s="save"
                    />
                </div>
            </slot>
        </v-layout-content>
    </v-layout>
</template>

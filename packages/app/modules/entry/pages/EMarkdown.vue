<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash/debounce'

import DirectoryEntry from '@core/entities/directory-entry'

import { useStore } from '@modules/entry/store'

import MEditor from '@modules/markdown-editor/components/MEditor.vue'

const props = defineProps({
    path: {
        type: String,
        required: true,
    },
    hideActions: {
        type: Boolean,
        default: false,
    },
})

// set content
const store = useStore()

const content = ref('')

async function setContent() {
    const decoder = new TextDecoder('utf-8')

    const contentBuffer = await store.read({
        path: props.path,
    })

    if (!contentBuffer) return

    content.value = decoder.decode(contentBuffer)
}

const save = debounce(async () => {
    await store.write({
        data: DirectoryEntry.encode(content.value),
        path: props.path,
    })
}, 1000)

watch(() => props.path, setContent, {
    immediate: true,
})

watch(content, save)

// save

// mode
const tm = useI18n()

const mode = ref('edit')

const modeLabels: Record<typeof mode.value, string> = {
    'edit': tm.t('editMode'),
    'side-by-side': tm.t('sideBySide'),
    'view': tm.t('view'),
}
</script>
<template>
    <v-layout :id="path" use-percentage>
        <v-layout-toolbar class="border-b border-b-lines">
            <div class="flex pl-6 pr-7 w-full">
                <v-menu offset-y :close-on-content-click="true">
                    <template #activator="{ attrs }">
                        <v-btn v-bind="attrs" class="mr-auto" color="b-primary">
                            {{ modeLabels[mode] }}
                        </v-btn>
                    </template>

                    <v-card color="b-secondary">
                        <v-list-item
                            v-for="(option, name) in modeLabels"
                            :key="option"
                            @click="mode = name"
                        >
                            {{ option }}
                        </v-list-item>
                    </v-card>
                </v-menu>

                <template v-if="['edit', 'side-by-side'].includes(mode)">
                    <v-btn size="sm" mode="text">
                        <v-icon name="arrows-rotate" />
                    </v-btn>
                    <v-btn size="sm" mode="text">
                        <v-icon name="save" />
                    </v-btn>
                </template>

                <slot name="append-actions" />
            </div>
        </v-layout-toolbar>

        <v-layout-content>
            <m-editor v-model="content" />
        </v-layout-content>
    </v-layout>
</template>
